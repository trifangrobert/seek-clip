import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";
const extractAudio = require("ffmpeg-extract-audio");
// import extractAudio from "ffmpeg-extract-audio";


dotenv.config();
const backend_asr_url: string | undefined = process.env.BACKEND_ASR_URL;

// video is a file path
export const getTranscription = async (video: any): Promise<string> => {
    // console.log(video);
    // print type of video
    // console.log(typeof video);
    // call transcription service
    // return transcription

    // console.log("backend_asr_url: ", backend_asr_url);
    const formData = new FormData();

    const audioPath = video.path.replace(".mp4", ".mp3");

    const audio = await extractAudio({
        input: video.path,
        output: audioPath,
    })

    formData.append("audio", fs.createReadStream(audioPath));

    // console.log("formData: ", formData);
    const response = await axios.post(backend_asr_url + "/transcribe", formData, {
        headers: {
            ...formData.getHeaders()
        },
    });

    if (response.status !== 200) {
        throw new Error("Error transcribing audio");
    }
    console.log("Response.data: ", response.data)
    const transcription = response.data.transcription;
    
    const captionsFilename = audioPath.split("/")[1].replace(".mp3", ".vtt");
    const captionsDir = path.join(__dirname, "../..", "captions");

    // console.log("captionsFilename: ", captionsFilename);
    // console.log("captionsDir: ", captionsDir);

    if (!fs.existsSync(captionsDir)) {
        fs.mkdirSync(captionsDir);
    }

    const responseCaptions = await axios.get(backend_asr_url + `/vtt/${captionsFilename}`, {
        responseType: "arraybuffer"
    });

    if (responseCaptions.status !== 200) {
        throw new Error("Error fetching captions");
    }

    const captionsFilepath = path.join(captionsDir, captionsFilename);

    // console.log("captionsFilepath: ", captionsFilepath);
    fs.writeFileSync(captionsFilepath, Buffer.from(responseCaptions.data));

    // console.log("Captions file written to: ", captionsFilepath);

    console.log("transcription: ", transcription);

    const deleteCaptions = await axios.delete(backend_asr_url + `/vtt/delete/${captionsFilename}`);
    if (deleteCaptions.status !== 200) {
        throw new Error("Error deleting captions");
    }

    return transcription;
};
