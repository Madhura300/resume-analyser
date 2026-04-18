import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function Dropzone({ onFileRead }) {
  const onDrop = useCallback(async (files) => {
    const file = files[0]
    if (!file) return
    try {
      if (file.type === 'application/pdf') {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
        let text = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page    = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map(s => s.str).join(' ') + '\n'
        }
        if (text.trim().length === 0) {
          alert('This PDF appears to be image-based. Please upload a DOCX or TXT version.')
          return
        }
        onFileRead(text, file.name)
      } else if (file.name.endsWith('.docx')) {
        const mammoth     = await import('mammoth')
        const arrayBuffer = await file.arrayBuffer()
        const result      = await mammoth.extractRawText({ arrayBuffer })
        onFileRead(result.value, file.name)
      } else {
        const text = await file.text()
        onFileRead(text, file.name)
      }
    } catch (err) {
      console.error('File read error:', err)
      alert('Error reading file. Please try a .txt or .docx version.')
    }
  }, [onFileRead])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  })

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <div className="drop-icon">⬆</div>
      {isDragActive
        ? <p>Drop it here</p>
        : <>
            <p>Drag & drop your resume</p>
            <span>PDF · DOCX · TXT</span>
          </>
      }
    </div>
  )
}
