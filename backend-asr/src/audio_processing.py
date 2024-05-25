import soundfile as sf
import torch
import resampy
import librosa
from tqdm import tqdm
from utils import format_timestamp
from config import BOOSTED_LM, SPELL_CHECK, SAMPLE_RATE, BLOCK_SIZE
import os
import torch
from itertools import groupby
from flask import current_app as app


def make_subtitles(transcription, predicted_ids, input_values, offset=0.0):
    processor = app.processor
    
    words = [w for w in transcription.split(" ") if len(w) > 0]
    predicted_ids = predicted_ids[0].tolist()
    duration_sec = input_values.shape[1] / SAMPLE_RATE
    
    # print(words)
    # print(predicted_ids)
    # print(duration_sec)
    ids_w_time = [(i / len(predicted_ids) * duration_sec, _id) for i, _id in enumerate(predicted_ids)]
    
    ids_w_time = [i for i in ids_w_time if i[1] != processor.tokenizer.pad_token_id]
    
    split_ids_w_time = [list(group) for k, group
                in groupby(ids_w_time, lambda x: x[1] == processor.tokenizer.word_delimiter_token_id)
                if not k]
    
    # print(ids_w_time)
    # print(split_ids_w_time)
    
    print(f"split_ids_w_time: {len(split_ids_w_time)}")
    print(f"words: {len(words)}")
    # print(split_ids_w_time)
    # print(words)
    
    # remove last elements from split_ids_w_time until lengths match
    while len(split_ids_w_time) > len(words):
        split_ids_w_time = split_ids_w_time[:-1]
    
    # remove last elements from words until lengths match
    while len(words) > len(split_ids_w_time):
        words = words[:-1]
    
    # assert len(split_ids_w_time) == len(words) 
    
    word_timestamps = []
    for cur_ids_w_time, cur_word in zip(split_ids_w_time, words):
        _times = [_time for _time, _id in cur_ids_w_time]
        start_time = min(_times)
        end_time = max(_times)
                    
        word_timestamps.append((cur_word, (start_time, end_time)))
        
    group_size = 7
    
    group_timestamps = []
    for i in range(0, len(word_timestamps), group_size):
        group = word_timestamps[i:min(i + group_size, len(word_timestamps))]
        start_group_time = group[0][1][0]
        end_group_time = group[-1][1][1]
        text = " ".join([w[0] for w in group])
        group_timestamps.append((text, (start_group_time, end_group_time)))
            
            
    subtitles = []        
    for text, (start_time, end_time) in group_timestamps:
        start_formatted = format_timestamp(offset + start_time)
        end_formatted = format_timestamp(offset + end_time)
        subtitles.append((text, (start_formatted, end_formatted)))
    
    return subtitles
            

def save_subtitles(subtitles, filename):
    save_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    save_path = os.path.join(save_path, "captions")
    filepath = os.path.join(save_path, filename)
    
    print(f"Saving subtitles to {filepath}...")
    with open(filepath, "w") as f:
        f.write("WEBVTT\n\n")
        for text, (start_time, end_time) in subtitles:
            f.write(f"{start_time} --> {end_time}\n")
            f.write(f"{text}\n\n")
    
    

def speech_to_text(audio):
    processor = app.processor
    asr = app.asr
    fix_spelling = app.fix_spelling
    
    input_values = processor(audio, return_tensors="pt", sampling_rate=SAMPLE_RATE).input_values
    with torch.no_grad():
        logits = asr(input_values).logits
        
    predicted_ids = torch.argmax(logits, dim=-1)
    if BOOSTED_LM:
        # warning: transcription from the boosted model combined 
        # with predicted_ids from the base model fails to generate subtitles
        transcription = processor.batch_decode(logits.numpy()).text[0]
    else:    
        transcription = processor.batch_decode(predicted_ids)[0]

    transcription = transcription.lower()
        
    # spell check the transcription
    if SPELL_CHECK:
        transcription = fix_spelling(transcription, max_length=2048)[0]["generated_text"]
    
    return transcription, predicted_ids, input_values


def process_audio(audio_file):
    audio, sample_rate = sf.read(audio_file) 
    audio_filename = audio_file.filename
    
    if len(audio.shape) > 1:
        audio = (audio[:, 0] + audio[:, 1]) / 2 # audio is stereo
        
    if sample_rate != 16000:
        audio = resampy.resample(audio, sample_rate, 16000)
        sample_rate = 16000
        
    sf.write("audio.wav", audio, sample_rate)
        
    print(f'Audio sample rate must be {SAMPLE_RATE} and it is {librosa.get_samplerate("audio.wav")}')
    stream = librosa.stream("audio.wav", block_length=BLOCK_SIZE, frame_length=16000, hop_length=16000)
    
    try:
        transcription = ""
        predicted_ids = torch.tensor([])
        input_values = torch.tensor([])
        stream = [s for s in stream]
        subtitles = []
        
        for idx, speech in tqdm(enumerate(stream), desc="Processing audio"):
            if speech.shape[0] < 100: # skip short audio segments
                continue
            
            curr_transcription, curr_predicted_ids, curr_input_values = speech_to_text(speech)
            # print(curr_transcription)
            # print(curr_predicted_ids)
            # print(curr_input_values)
            
            transcription += curr_transcription
            predicted_ids = torch.cat([predicted_ids, curr_predicted_ids], dim=1)
            input_values = torch.cat([input_values, curr_input_values], dim=1)
            
            subtitles += make_subtitles(curr_transcription, curr_predicted_ids, curr_input_values, offset=idx * BLOCK_SIZE)
            
    except Exception as e:
        print(e)
        return "Error occurred while processing the audio"
        
    try:
        vtt_filename = f"{audio_filename.split('.')[0]}.vtt"
        save_subtitles(subtitles, vtt_filename)
    except Exception as e:
        print(e)
        return "Error occurred while generating subtitles"

    os.remove("audio.wav")
    
    return transcription
