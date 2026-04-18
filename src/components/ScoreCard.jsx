import { useEffect, useState } from 'react'

export default function ScoreCard({ score, matched, missing, total }) {
  const [animated, setAnimated] = useState(0)

  const color  = score >= 70 ? '#22d3a5' : score >= 40 ? '#fbbf24' : '#ff6b6b'
  const r      = 65
  const circ   = 2 * Math.PI * r
  const offset = circ - (animated / 100) * circ

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(t)
  }, [score])

  const verdict = score >= 70
    ? 'Strong match — likely to pass ATS screening'
    : score >= 40
    ? 'Moderate match — a few edits will help significantly'
    : 'Weak match — resume needs tailoring for this role'

  return (
    <div className="score-panel">
      <div className="score-title">Match Score</div>
      <div className="score-ring-wrap">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle className="score-ring-bg" cx="80" cy="80" r={r} />
          <circle
            className="score-ring-fill"
            cx="80" cy="80" r={r}
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-ring-text">
          <span className="score-number" style={{ color }}>{score}%</span>
          <span className="score-label-sm">{matched}/{total} keywords</span>
        </div>
      </div>
      <p className="score-verdict">{verdict}</p>
      <div className="score-stats">
        <div className="score-stat">
          <div className="score-stat-num" style={{ color: '#22d3a5' }}>{matched}</div>
          <div className="score-stat-lbl">Matched</div>
        </div>
        <div className="score-stat">
          <div className="score-stat-num" style={{ color: '#ff6b6b' }}>{missing}</div>
          <div className="score-stat-lbl">Missing</div>
        </div>
      </div>
    </div>
  )
}
