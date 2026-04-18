## ResumeMatch AI
# Resume Analyzer

A web-based Resume Analyzer built using React and Vite that compares a candidate’s resume with a job description and provides a match score, keyword analysis, and improvement suggestions.

## 🚀 Features

- Upload resume in PDF, DOCX, or TXT format
- Extract text from resumes automatically
- Paste job description for comparison
- Keyword matching between resume and job description
- Match percentage score generation
- Highlight matched and missing keywords
- Smart suggestions to improve resume relevance
- Clean and responsive UI

## 🛠️ Tech Stack

- React.js
- Vite
- JavaScript (ES6+)
- HTML5 & CSS3
- pdfjs-dist (PDF parsing)
- mammoth.js (DOCX parsing)
- react-dropzone (file upload)

## 📁 Project Structure
## 📁 Project Structure

```bash
src/
│── components/
│   ├── Dropzone.jsx
│   ├── JobInput.jsx
│   ├── KeywordHighlighter.jsx
│   ├── ScoreCard.jsx
│   ├── Suggestions.jsx
│
│── utils/
│   ├── analyser.js
│
│── App.jsx
│── main.jsx
│── App.css
```
## ⚙️ How It Works

1. User uploads resume (PDF/DOCX/TXT)
2. Text is extracted using file parsers
3. Job description is pasted manually
4. Keywords are extracted from both inputs
5. Matching algorithm compares keywords
6. System generates:
   - Match score
   - Matched keywords
   - Missing keywords
   - Improvement suggestions

## 📊 Output

- Match Score (%)
- Matched Keywords List
- Missing Keywords List
- Resume Improvement Suggestions

## 💡 Future Improvements

- AI-based semantic matching (NLP/LLM integration)
- Resume scoring using embeddings
- Login system for users
- Save and track resume history
- ATS optimization scoring
