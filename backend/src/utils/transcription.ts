import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
const extractAudio = require("ffmpeg-extract-audio");
// import extractAudio from "ffmpeg-extract-audio";


dotenv.config();
const backend_asr_url: string | undefined = process.env.BACKEND_ASR_URL;

// video is a file path
export const getTranscription = async (video: any): Promise<string> => {
    console.log(video);
    // print type of video
    console.log(typeof video);
    // call transcription service
    // return transcription

    console.log("backend_asr_url: ", backend_asr_url);
    const formData = new FormData();

    const audioPath = video.path.replace(".mp4", ".mp3");

    const audio = await extractAudio({
        input: video.path,
        output: audioPath,
    })

    formData.append("audio", fs.createReadStream(audioPath));


    console.log("formData: ", formData);
    const response = await axios.post(backend_asr_url + "/transcribe", formData, {
        headers: {
            ...formData.getHeaders()
        }
    });

    if (response.status !== 200) {
        throw new Error("Error transcribing audio");
    }

    const transcription = response.data.transcription;

    return transcription;
};