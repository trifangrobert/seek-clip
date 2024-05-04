from transformers import pipeline
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

pipe = pipeline("text-classification", model="3funnn/bert-topic-classification")

@app.route("/topic", methods=["POST"])
def get_topic():
    data = request.get_json()
    text = data["text"]
    
    chunk_size = 512
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    
    res = []
    for chunk in chunks:
        res.extend(pipe(chunk))
    
    # majority voting
    res = [r["label"] for r in res]
    
    res = max(set(res), key=res.count)
    
    return jsonify(res)

if __name__ == "__main__":
    # app.run(debug=True, port=5004) # this is for local
    app.run(host="0.0.0.0", port=5003) # this is for docker