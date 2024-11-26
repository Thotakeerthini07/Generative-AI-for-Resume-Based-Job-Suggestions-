from google.cloud import aiplatform

# Initialize Google Cloud AI Platform
aiplatform.init(project="jobmatching-442612")

def analyze_resume_and_suggest_jobs(resume_text):
    """
    Analyze a resume using a generative AI model and provide job suggestions.

    Args:
        resume_text (str): The text of the resume.

    Returns:
        dict: A dictionary containing job suggestions or an error message.
    """
    # Define the AI prompt
    prompt = f"""
    Analyze the following resume and suggest three job titles that are most relevant to the candidate's skills.
    Resume: {resume_text}
    For each job title, provide a brief description of why it is a good fit.
    """

    try:
        # Specify the model for text generation (e.g., text-bison or Gemini)
        model_name = "text-bison"  # Update to the correct model name if using Gemini or another model
        text_generator = aiplatform.generation.TextGeneration(model=model_name)

        # Call the AI model for text generation
        response = text_generator.generate_text(
            content=prompt,
            parameters={
                "maxOutputTokens": 300,  # Limit response length
                "temperature": 0.7,      # Creativity level
                "topP": 0.8,             # Probability sampling
                "topK": 40               # Number of highest-probability tokens
            }
        )

        # Return the AI's suggestions as a structured result
        return {"status": "success", "suggestions": response.text}

    except Exception as e:
        # Handle any errors during the process
        return {"status": "error", "message": str(e)}
    

resume_text = "Experienced software engineer skilled in Python, machine learning, and cloud technologies."
result = analyze_resume_and_suggest_jobs(resume_text)

if result["status"] == "success":
    print("Job Suggestions:")
    print(result["suggestions"])
else:
    print("Error:", result["message"])

