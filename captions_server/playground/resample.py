import librosa
import soundfile as sf
import os
from tqdm import tqdm
from tqdm.contrib.concurrent import process_map
import pandas as pd

def resample(args):
    input_path, output_path = args
    target_sr=16000
    audio, sample_rate = librosa.load(input_path, sr=None)
    audio = librosa.resample(audio, orig_sr=sample_rate, target_sr=target_sr)
    sf.write(output_path, audio, samplerate=target_sr)


if __name__ == "__main__":
    dataset_root_path = "../../data/cv-corpus-16.1-delta-2023-12-06/en"
    audio_path = dataset_root_path + "/clips"
    save_path = dataset_root_path + "/clips_16k"
    os.makedirs(save_path, exist_ok=True)
    
    valid_files = dataset_root_path + "/validated.tsv"

    data = pd.read_csv(valid_files, sep='\t')
    # keep only sentence and path columns
    data = data[['path', 'sentence']]

    audio_files = sorted(data['path'].tolist())
    # print(audio_files[:1])

    input_files = [os.path.join(audio_path, file) for file in audio_files]
    output_files = [os.path.join(save_path, file) for file in audio_files]
    files = list(zip(input_files, output_files))
    # for idx, (x, y) in enumerate(files[:5]):
    #     print(x)
    #     print(y)
    #     print()

    process_map(resample, files, max_workers=8, chunksize=1, desc="Resampling")

