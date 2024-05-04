import os
from flask import Flask
from flask_cors import CORS
from routes import register_routes
from models import init_model
from config import ASR_REPO, BOOSTED_LM

os.environ["TOKENIZERS_PARALLELISM"] = "false"

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    register_routes(app)
    
    app.asr, app.processor, app.fix_spelling = init_model(ASR_REPO, BOOSTED_LM)
    
    return app

if __name__ == "__main__":
    app = create_app()
    # this is for local development
    # app.run(debug=True, port=5002)
    
    # this is for docker
    app.run(host="0.0.0.0", port=5001)
