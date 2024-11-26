from flask import Flask, request, jsonify
import PyPDF2  # Install via: pip install PyPDF2
from resume import analyze_resume_and_suggest_jobs  # Import your function

app = Flask(__name__)

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

    try:
        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(file)
        resume_text = ''.join(page.extract_text() for page in pdf_reader.pages)

        # Get job suggestions
        suggestions = analyze_resume_and_suggest_jobs(resume_text)
        return jsonify({"status": "success", "job_suggestions": suggestions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/test', methods=['GET'])
def test():
    return "API is working!"

