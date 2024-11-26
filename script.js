document.getElementById('submitBtn').addEventListener('click', async function () {
  const resumeFile = document.getElementById('resumeFile').files[0];
  const statusMessage = document.getElementById('statusMessage');

  if (!resumeFile) {
      statusMessage.textContent = "Please select a file.";
      return;
  }

  const formData = new FormData();
  formData.append('file', resumeFile);

  try {
      statusMessage.textContent = "Uploading and analyzing your resume...";

      const response = await fetch('/analyze-resume', {
          method: 'POST',
          body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
          const suggestions = data.job_suggestions.replace(/\n/g, '<br>');
          statusMessage.innerHTML = `<h3>Job Suggestions:</h3>${suggestions}`;
      } else {
          statusMessage.textContent = `Error: ${data.error}`;
      }
  } catch (error) {
      statusMessage.textContent = "An error occurred while uploading the resume.";
      console.error(error);
  }
});
