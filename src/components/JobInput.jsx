export default function JobInput({ value, onChange }) {
  return (
    <div className="job-input">
      <textarea
        placeholder="Paste the job description here..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
