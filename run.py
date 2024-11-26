from flask import send_from_directory

@app.route('/')
def serve_frontend():
    return send_from_directory('static', 'index.html')
