from transformers import Wav2Vec2ForCTC, Wav2Vec2Tokenizer
import os
import re
import numpy as np
import pandas as pd
from IPython.display import Audio
from playsound import playsound
import librosa
import torch

if __name__ == "__main__":
    # Load Wav2Vec from huggingface
    tokenizer = Wav2Vec2Tokenizer.from_pretrained("facebook/wav2vec2-base-960h")
    model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

    dataset_root_path = "../../data/cv-corpus-16.1-delta-2023-12-06/en"
    valid_files = dataset_root_path + "/validated.tsv"

    data = pd.read_csv(valid_files, sep='\t')
    # keep only sentence and path columntfs
    data = data[['path', 'sentence']]

    # rename
    data = data.rename(columns={'path': 'file', 'sentence': 'text'})
    # print(data.head())

    chars_to_ignore_regex = '[\,\?\.\!\-\;\:\"\(\)\{\}“”\‘\-\–\—\’]'
    data["text"] = data["text"].apply(lambda x: re.sub('’', "'", x))
    data["text"] = data["text"].apply(lambda x: re.sub('‘', "'", x))
    data["text"] = data["text"].apply(lambda x: re.sub('–', "-", x))
    data["text"] = data["text"].apply(lambda x: re.sub('—', "-", x))
    data["text"] = data["text"].apply(lambda x: re.sub(chars_to_ignore_regex, '', x).lower())
    data["file"] = data["file"].apply(lambda x: dataset_root_path + "/clips_16k_wav/" + x.replace('.mp3', '.wav'))

    # pick up a random audio sample 
    rand_pos = np.random.randint(0, len(data))

    sample = data.iloc[rand_pos]

    
    files = [sample["file"]]
    playsound(files[0])

    cc = ""
    for path in files:
        # Load the audio with the librosa library
        input_audio, _ = librosa.load(path, sr=16000)

        # Tokenize the audio
        input_values = tokenizer(input_audio, return_tensors="pt", padding="longest").input_values

        # Feed it through Wav2Vec & choose the most probable tokens
        with torch.no_grad():
            logits = model(input_values).logits
            predicted_ids = torch.argmax(logits, dim=-1)

        # Decode & add to our caption string
        transcription = tokenizer.batch_decode(predicted_ids)[0]
        cc += transcription + " "

    print(f"Ground truth: {sample['text']}")
    print(f"Predicted: {cc}")