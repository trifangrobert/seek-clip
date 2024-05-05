import datetime
from flask import Flask, request, jsonify
from routes import bp
import soundfile as sf
import torch
import resampy
from itertools import groupby
import os
from flask import send_file
import librosa
from tqdm import tqdm

from flask_cors import CORS

from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor, Wav2Vec2ProcessorWithLM
from transformers import pipeline

# os.environ["TOKENIZERS_PARALLELISM"] = "false"


fix_spelling = pipeline("text2text-generation", model="oliverguhr/spelling-correction-english-base")

asr_repos = {
    "base-960h": "facebook/wav2vec2-base-960h",
    "minilibrispeech": "3funnn/wav2vec2-base-minilibrispeech",
    "common-voice": "3funnn/wav2vec2-base-common-voice",
    "jonatasgrosman": "jonatasgrosman/wav2vec2-large-xlsr-53-english"
}

lm_boosted_repos = {
    "minilibrispeech": "3funnn/wav2vec2-base-minilibrispeech-lm",
    "common-voice": "3funnn/wav2vec2-base-common-voice-lm",
}

ASR_REPO = "minilibrispeech"
BOOSTED_LM = True
SPELL_CHECK = True
SAMPLE_RATE = 16000

asr = None
processor = None

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    global asr, processor
    asr, processor = init_model(ASR_REPO, BOOSTED_LM)
    
    return app


def init_model(asr_repo, boost_lm):    
    asr = Wav2Vec2ForCTC.from_pretrained(asr_repos[asr_repo])
        
    if boost_lm: # this is only available for minilibrispeech and common-voice
        processor = Wav2Vec2ProcessorWithLM.from_pretrained(lm_boosted_repos[asr_repo])
    else:
        processor = Wav2Vec2Processor.from_pretrained(asr_repos[asr_repo])
            
    return asr, processor


def format_timestamp(seconds):
    td = datetime.timedelta(seconds=seconds)
    # keep only 3 decimal places
    if '.' not in str(td):
        td = str(td) + ".000"
    
    td_seconds, td_microseconds = str(td).split(".")
    td_microseconds = td_microseconds[:min(3, len(td_microseconds))]
    if len(td_microseconds) < 3:
        td_microseconds = td_microseconds + "0" * (3 - len(td_microseconds))
    # print(td_seconds)
    # print(td_microseconds)
    td = f"0{td_seconds}.{td_microseconds}"
    # print(td)
    return td

def make_subtitles(transcription, predicted_ids, input_values, filename):
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
            
    # create a file name with the date and time
    save_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    save_path = os.path.join(save_path, "captions")
    filepath = os.path.join(save_path, filename)
            
    # create a vtt file
    with open(filepath, "w") as f:
        f.write("WEBVTT\n\n")
        for i, (text, (start_time, end_time)) in enumerate(group_timestamps):
            start_formatted = format_timestamp(start_time)
            end_formatted = format_timestamp(end_time)
            f.write(f"{start_formatted} --> {end_formatted}\n")
            f.write(f"{text}\n\n")
    

def speech_to_text(audio):
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


def process_audio(audio_file, asr_repo="base-960h", boost_lm=False, spell_check=False, subtitles=False):
    audio, sample_rate = sf.read(audio_file) 
    audio_filename = audio_file.filename
    
    if len(audio.shape) > 1:
        audio = audio[:, 0] + audio[:, 1] # audio is stereo
        
    if sample_rate != 16000:
        audio = resampy.resample(audio, sample_rate, 16000)
        sample_rate = 16000
        
    sf.write("audio.wav", audio, sample_rate)
        
    print(f'Audio sample rate must be {SAMPLE_RATE} and it is: {librosa.get_samplerate("audio.wav")}')
    stream = librosa.stream("audio.wav", block_length=30, frame_length=16000, hop_length=16000)
    
    try:
        transcription = ""
        predicted_ids = torch.tensor([])
        input_values = torch.tensor([])
        stream = [s for s in stream]
        
        for speech in tqdm(stream, desc="Processing audio"):
            if speech.shape[0] < 30 * 16000:
                continue
            
            curr_transcription, curr_predicted_ids, curr_input_values = speech_to_text(speech, sample_rate, asr_repo=asr_repo, boost_lm=boost_lm, spell_check=spell_check)
            # print(curr_transcription)
            # print(curr_predicted_ids)
            # print(curr_input_values)
            
            transcription += curr_transcription
            predicted_ids = torch.cat([predicted_ids, curr_predicted_ids], dim=1)
            input_values = torch.cat([input_values, curr_input_values], dim=1)
    except Exception as e:
        print(e)
        return "Error occurred while processing the audio"
        
    if subtitles:
        try:
            vtt_filename = f"{audio_filename.split('.')[0]}.vtt"
            make_subtitles(transcription, predicted_ids, input_values, sample_rate, vtt_filename)
        except Exception as e:
            print(e)
            return "Error occurred while generating subtitles"
    
    os.remove("audio.wav")
    
    return transcription


@app.route("/vtt/<filename>", methods=["GET"])
def get_vtt_file(filename):
    save_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    save_path = os.path.join(save_path, "captions")
    filepath = os.path.join(save_path, filename)
    
    if not os.path.exists(filepath):
        return "File not found", 404
    
    return send_file(filepath, as_attachment=True)

@app.route("/transcribe", methods=["POST"])
def transcribe():
    print(request.files)
    print(request.files['audio'])
    if 'audio' not in request.files:
        return "Audio file is required", 400
    
    audio_file = request.files['audio']
    
    # get the file extension
    file_extension = audio_file.filename.split(".")[-1]
    
    # check if the file is a valid audio file
    if file_extension not in ["wav", "flac", "mp3"]:
        return "Invalid file format. Only wav, mp3 or flac files are accepted", 400
    
    print("Getting transcription...")
    
    transcription = process_audio(audio_file, asr_repo="minilibrispeech", boost_lm=True, spell_check=True, subtitles=True)
    
    return jsonify({"transcription": transcription})


if __name__ == "__main__":
    # 5002 is for the local machine
    app.run(debug=True, port=5002)
    
    # 5001 is for the docker container
    # app.run(host='0.0.0.0', port=5001)
    # audio_path = "./data/84-121550-0000.flac"
    
    # audio_path = "./url-1714742141524.mp3"
    # audio_filename = "url-1714742141524.mp3"
    
    # audio_path = "./url-1714745745737.mp3"
    # audio_filename = "url-1714745745737.mp3"
    
    # file_extension = audio_path.split(".")[-1]
    
    # print("Getting transcription...")
    
    # start_time = time.time()
    # transcription = process_audio(audio_path, audio_filename, asr_repo="common-voice", boost_lm=False, spell_check=False, subtitles=True)
    # end_time = time.time()
    
    # print(f"Time taken: {end_time - start_time}")
    
    # print(transcription)
    