from flask import Flask, request, jsonify
from resume import analyze_resume_and_suggest_jobs

app = Flask(__name__)

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    data = request.json
    resume_text = data.get('resume_text', '')

    if not resume_text:
        return jsonify({"error": "No resume text provided"}), 400

    suggestions = analyze_resume_and_suggest_jobs(resume_text)
    return jsonify({"job_suggestions": suggestions})

if __name__ == '__main__':
    app.run(debug=True)
