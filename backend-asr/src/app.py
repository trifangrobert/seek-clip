from flask import Flask, request, jsonify
import soundfile as sf
import torch
import resampy
from itertools import groupby

from flask_cors import CORS

from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor, Wav2Vec2ProcessorWithLM
from transformers import pipeline

fix_spelling = pipeline("text2text-generation", model="oliverguhr/spelling-correction-english-base")

app = Flask(__name__)
CORS(app)

asr_repos = {
    "base-960h": "facebook/wav2vec2-base-960h",
    "minilibrispeech": "3funnn/wav2vec2-base-minilibrispeech",
    "common-voice": "3funnn/wav2vec2-base-common-voice",
}

lm_boosted_repos = {
    "minilibrispeech": "3funnn/wav2vec2-base-minilibrispeech-lm",
    "common-voice": "3funnn/wav2vec2-base-common-voice-lm",
}

asr = None
processor = None

def make_subtitles(transcription, predicted_ids, input_values, sample_rate):
    words = [w for w in transcription.split(" ") if len(w) > 0]
    predicted_ids = predicted_ids[0].tolist()
    duration_sec = input_values.shape[1] / sample_rate
    
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
    
    assert len(split_ids_w_time) == len(words) 
    
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
            
    # create a vtt file
    with open("output.vtt", "w") as f:
        f.write("WEBVTT\n\n")
        for i, (text, (start_time, end_time)) in enumerate(group_timestamps):
            f.write(f"{i+1}\n")
            f.write(f"{start_time:.3f} --> {end_time:.3f}\n")
            f.write(f"{text}\n\n")
        
    return group_timestamps
    

def speech_to_text(audio, sample_rate, asr_repo="base-960h", boost_lm=True, spell_check=True):
    global asr, processor
    
    if asr is None:
        asr = Wav2Vec2ForCTC.from_pretrained(asr_repos[asr_repo])
        
    if processor is None:
        if boost_lm: # this is only available for minilibrispeech and common-voice
            processor = Wav2Vec2ProcessorWithLM.from_pretrained(lm_boosted_repos[asr_repo])
        else:
            processor = Wav2Vec2Processor.from_pretrained(asr_repos[asr_repo])
        
    input_values = processor(audio, return_tensors="pt", sampling_rate=sample_rate).input_values
    with torch.no_grad():
        logits = asr(input_values).logits
        
    if boost_lm:
        transcription = processor.batch_decode(logits.numpy())[0][0]
    else:
        # take argmax and decode
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = processor.batch_decode(predicted_ids)[0]
        
        # make_subtitles(transcription, predicted_ids, input_values, sample_rate)
    
    transcription = transcription.lower()
        
    # spell check the transcription
    if not spell_check:
        return transcription
    
    transcription = fix_spelling(transcription, max_length=2048)[0]["generated_text"]
    return transcription

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
    
    audio, sample_rate = sf.read(audio_file) 
    if len(audio.shape) > 1:
        audio = audio[:, 0]
        
    print(audio)
    print(sample_rate)

    # save audio
    sf.write("audio.wav", audio, sample_rate)
    
    
    #  convert the audio to 16kHz if it is not
    if sample_rate != 16000:
        audio = resampy.resample(audio, sample_rate, 16000)
        sample_rate = 16000
    
    transcription = speech_to_text(audio, sample_rate, asr_repo="base-960h", boost_lm=False, spell_check=False)
    return jsonify({"transcription": transcription})


if __name__ == "__main__":
    # app.run(debug=True, port=5001)
    app.run(host='0.0.0.0', port=5003, debug=True)
    # audio_path = "./data/84-121550-0000.flac"
    # transcription = speech_to_text(audio_path)
    # print(transcription)
    