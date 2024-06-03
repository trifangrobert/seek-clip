from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
app = Flask(__name__)
CORS(app)

openai_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_key)
MODEL = "gpt-3.5-turbo"

def ask_gpt(subtitles, question, model_name=MODEL):
    # response = "This is a placeholder response."
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": f"Memorize the following text, it represents the subtitles from a video. I will ask you questions about it: {subtitles}"},
            {"role": "user", "content": f"Question: {question}"},
        ]
    )
        
    response_message = response.choices[0].message.content
    return response_message

@app.route("/qa", methods=["POST"])
def qa():
    data = request.get_json()
    subtitles = data["subtitles"]
    question = data["question"]
    
    try:    
        response = ask_gpt(subtitles, question)
    except Exception as e:
        response = {"error": str(e)}
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5004)
    
    
    