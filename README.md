# CV Pass ATS

A tool designed to optimize CVs/resumes to pass Applicant Tracking Systems (ATS) by tailoring your original CV data to specific job descriptions while following ATS optimization guidelines.

## 🚀 Overview

CV Pass ATS analyzes your existing CV and job descriptions to create tailored, ATS-friendly versions of your resume. The tool helps highlight relevant skills and experiences while maintaining authenticity and adhering to best practices for passing automated screening systems.

## 🫠 The problem

I was not sure how I could get through the ATS screening processes, so I read a lot, and had some chats with my mentor. This is where I landed, well, I landed in the realm of tailoring my CV for each job I was applying for. Considering I am quite "okay" at building products, I used this and spent 6 hours hacking this project together. Right now, it's tailored for people like me (and likely you), who understand code and can work in editors. My mentor has flagged that this is monetisable, so I'll try to convert this into a web app or mobile app.

## 💡 Feedback, Issues, Improvements
I'm open to feedback and suggestions, if you have any feedback for me about this project please go [here](https://www.feedback.cheap/project/jd784hvemny8r8xy02h9ffnyc57bnh1h). If you have issues, please create a new Issue inside the Github Repository. If you have improvements, you can raise a PR and I'll take a look.

## ✨ Features

- **CV Tailoring**: Customizes your CV to match specific job descriptions
- **ATS Optimization**: Restructures content to be more ATS-friendly
- **Multiple Output Formats**: Generates both Markdown and DOCX versions
- **Keyword Matching**: Emphasizes relevant skills and experiences
- **Ethical Optimization**: Enhances your existing information without fabrication

## 🛠️ Installation

```bash
git clone https://github.com/yourusername/cv-pass-ats.git
cd cv-pass-ats
npm install
```

## 🔧 Usage
1. Place your original CV in YAML format in the meta/original-cv.yaml file
2. Add your job description to inputs/job-description.txt
3. Update your metadata in inputs/metadata.yaml with company, role, and platform information
4. Run the process:

```bash
npm run start
```

### The tool will generate:
- A tailored CV in YAML format
- A formatted Markdown version
- A professional DOCX document ready for submission

All outputs will be saved in a timestamped folder under the outputs directory.

## 📊 How It Works
1. Input : The system takes your original CV (in YAML format), a job description, and ATS optimization strategies
2. Analysis : Using OpenAI's GPT-4o, it analyzes the content to identify relevant matches
3. Tailoring : It restructures and rephrases your existing information to better match the job requirements
4. Formatting : The tailored content is converted to professional Markdown and DOCX formats
5. Output : All files are saved with proper formatting for ATS compatibility

```plaintext
Original CV (YAML) + Job Description + ATS Strategies
            ↓
      Tailored CV (YAML)
            ↓
    Formatted Markdown
            ↓
      Final DOCX File
```

## 🚧 Potential Enhancements
- PDF/DOCX to YAML converter for existing CVs
- Web interface for easier interaction

## 📝 License
[MIT License](./LICENSE)

## 🧑‍💻 Author
Jason De Jesuz 🖤
