from flask import request, jsonify, send_file
import os
from audio_processing import process_audio

def register_routes(app):
    @app.route("/vtt/delete/<filename>", methods=["DELETE"])
    def delete_vtt_file(filename):
        save_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        save_path = os.path.join(save_path, "captions")
        filepath = os.path.join(save_path, filename)
        
        if not os.path.exists(filepath):
            return "File not found", 404
        
        os.remove(filepath)
        
        return "File deleted successfully"
    
    @app.route("/vtt/<filename>", methods=["GET"])
    def get_vtt_file(filename):
        save_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        save_path = os.path.join(save_path, "captions")
        filepath = os.path.join(save_path, filename)
        
        if not os.path.exists(filepath):
            return "File not found", 404
        
        return send_file(filepath, as_attachment=True)

    @app.route("/transcribe", methods=["POST"])
    def transcribe():
        print(request.files)
        print(request.files['audio'])
        if 'audio' not in request.files:
            return "Audio file is required", 400
        
        audio_file = request.files['audio']
        
        # get the file extension
        file_extension = audio_file.filename.split(".")[-1]
        
        # check if the file is a valid audio file
        if file_extension not in ["wav", "flac", "mp3"]:
            return "Invalid file format. Only wav, mp3 or flac files are accepted", 400
        
        print("Getting transcription...")
        
        transcription = process_audio(audio_file)
        
        return jsonify({"transcription": transcription})
