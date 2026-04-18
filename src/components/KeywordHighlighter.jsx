export default function KeywordHighlighter({ matched, missing }) {
  if (!matched || !missing) return null
  return (
    <div className="keywords-panel">
      <div>
        <div className="kw-group-title matched-title">
          ✓ Matched
          <span className="kw-count matched-count">{matched.length}</span>
        </div>
        <div className="kw-tags">
          {matched.slice(0, 30).map((k, i) => (
            <span key={i} className="kw-tag matched">{k}</span>
          ))}
        </div>
      </div>
      <div>
        <div className="kw-group-title missing-title">
          ✕ Missing
          <span className="kw-count missing-count">{missing.length}</span>
        </div>
        <div className="kw-tags">
          {missing.slice(0, 30).map((k, i) => (
            <span key={i} className="kw-tag missing">{k}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
