import { useState } from 'react'
import Dropzone from './components/Dropzone'
import JobInput from './components/JobInput'
import ScoreCard from './components/ScoreCard'
import KeywordHighlighter from './components/KeywordHighlighter'
import Suggestions from './components/Suggestions'
import './App.css'

export default function App() {
  const [resumeText, setResumeText] = useState('')
  const [fileName,   setFileName]   = useState('')
  const [jobText,    setJobText]    = useState('')
  const [result,     setResult]     = useState(null)
  const [loading,    setLoading]    = useState(false)

  function handleFileRead(text, name) {
    setResumeText(text)
    setFileName(name)
    setResult(null)
  }

  async function handleAnalyse() {
    if (!resumeText || !jobText) return
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:5000/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobText })
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error('Backend error:', err)
      alert('Could not connect to backend. Make sure Flask is running!')
    }
    setLoading(false)
  }

  function handleReset() {
    setResumeText('')
    setFileName('')
    setJobText('')
    setResult(null)
  }

  return (
    <>
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <div className="app">
        <nav>
          <div className="nav-logo">
            <div className="nav-logo-dot" />
            ResumeAI
          </div>
          <div className="nav-badge">ATS Checker</div>
        </nav>

        {!result ? (
          <>
            <div className="hero">
              <div className="hero-eyebrow">Powered by HuggingFace NLP</div>
              <h1>Beat the <em>ATS</em> every time</h1>
              <p>Upload your resume and paste a job description. Our AI analyses keyword match, scores your resume, and tells you exactly what to fix.</p>
            </div>

            <div className="input-grid">
              <div className="panel">
                <div className="panel-label">
                  <div className="panel-label-dot" />
                  Your Resume
                </div>
                <Dropzone onFileRead={handleFileRead} />
                {fileName && (
                  <div className="file-pill">
                    ✓ {fileName}
                  </div>
                )}
              </div>

              <div className="panel">
                <div className="panel-label">
                  <div className="panel-label-dot" />
                  Job Description
                </div>
                <JobInput value={jobText} onChange={setJobText} />
              </div>
            </div>

            <div className="analyse-btn-wrap">
              <button
                className="analyse-btn"
                onClick={handleAnalyse}
                disabled={!resumeText || !jobText || loading}
              >
                {loading ? 'Analysing with AI...' : 'Analyse My Resume →'}
              </button>
            </div>
          </>
        ) : (
          <div className="results-section">
            <button className="back-btn" onClick={handleReset}>
              ← New Analysis
            </button>

            <div className="results-grid">
              <ScoreCard
                score={result.score}
                matched={result.matched?.length || 0}
                missing={result.missing?.length || 0}
                total={result.totalKeywords}
              />
              <KeywordHighlighter
                matched={result.matched || []}
                missing={result.missing || []}
              />
            </div>

            <Suggestions suggestions={result.suggestions || []} />
          </div>
        )}
      </div>
    </>
  )
}
