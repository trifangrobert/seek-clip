import os
from pydub import AudioSegment
from tqdm.contrib.concurrent import process_map

def convert(args) -> None:
    src, dst = args
    sound = AudioSegment.from_mp3(src)
    sound.export(dst, format="wav")

if __name__ == "__main__":
    audio_path = "../../data/cv-corpus-16.1-delta-2023-12-06/en/clips_16k"
    save_path = "../../data/cv-corpus-16.1-delta-2023-12-06/en/clips_16k_wav"
    os.makedirs(save_path, exist_ok=True)

    audio_files = os.listdir(audio_path)
    input_files = [os.path.join(audio_path, file) for file in audio_files]
    output_files = [os.path.join(save_path, file.replace('.mp3', '.wav')) for file in audio_files]
    files = list(zip(input_files, output_files))

    process_map(convert, files, max_workers=8, chunksize=1, desc="Converting")


