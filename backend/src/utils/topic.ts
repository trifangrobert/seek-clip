import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const backend_topic_url: string | undefined = process.env.BACKEND_TOPIC_URL;

export const getTopic = async (text: string): Promise<string> => {
    console.log(`Extracting topic from text: ${text}`);

    try {
        // create a request to the topic service as json
        const response = await axios.post(backend_topic_url + "/topic", {
            text: text
        });
    
        if (response.status !== 200) {
            throw new Error("Error extracting topic");
        }

        const topic = response.data;
        console.log(`Extracted topic: ${topic}`);
        return topic;
    }
    catch (error) {
        console.error("Error extracting topic: ", error);
        throw new Error("Error extracting topic");
    }
}

