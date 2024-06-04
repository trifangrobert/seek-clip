from transformers import pipeline
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

pipe = pipeline("text-classification", model="3funnn/bert-topic-classification")
CHUNK_SIZE = 512
NUM_CHUNKS = 10

@app.route("/topic", methods=["POST"])
def get_topic():
    data = request.get_json()
    text = data["text"]
    
    chunks = [text[i:i+CHUNK_SIZE] for i in range(0, len(text), CHUNK_SIZE)][:NUM_CHUNKS]
    
    res = []
    for index, chunk in enumerate(chunks):
        chunk_results = pipe(chunk)
        if index == 0:
            res.extend(chunk_results * 5)
        else:
            res.extend(chunk_results)
    
    # majority voting
    res = [r["label"] for r in res]
    
    res = max(set(res), key=res.count)
    
    return jsonify(res)

if __name__ == "__main__":
    # app.run(debug=True, port=5004) # this is for local
    app.run(host="0.0.0.0", port=5003) # this is for docker