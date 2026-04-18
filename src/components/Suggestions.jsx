const icons = {
  success: '✦',
  warning: '⚠',
  info:    '→',
  tech:    '⌥',
  soft:    '◈',
  verb:    '✎'
}

export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null
  return (
    <div className="suggestions-panel">
      <div className="suggestions-title">AI Suggestions</div>
      <div className="suggestions-list">
        {suggestions.map((s, i) => (
          <div key={i} className={`suggestion-card sug-${s.type}`}>
            <span className="suggestion-icon">{icons[s.type] || '→'}</span>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
