from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Load HuggingFace zero-shot classifier
print("Loading HuggingFace model... (first time takes a minute)")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print("Model loaded!")

# ─── Stop words ───────────────────────────────────────────
STOP_WORDS = set([
    'the','a','an','and','or','but','in','on','at','to','for',
    'of','with','by','from','is','are','was','were','be','been',
    'have','has','had','do','does','did','will','would','could',
    'should','may','might','shall','can','need','this','that',
    'these','those','it','its','we','our','your','their','my',
    'job','title','location','remote','you','looking','ideal',
    'candidate','basic','side','work','build','manage','ensure',
    'smooth','closely','years','experience','applications','strong',
    'ability','willingness','equivalent','related','practical'
])

# ─── Helpers ──────────────────────────────────────────────
def extract_keywords(text):
    doc = nlp(text.lower())
    keywords = []
    for token in doc:
        if (not token.is_stop and
            not token.is_punct and
            not token.is_space and
            len(token.text) > 2 and
            token.text not in STOP_WORDS):
            keywords.append(token.lemma_)
    return list(set(keywords))

def analyse_match(resume_text, job_text):
    resume_keywords = set(extract_keywords(resume_text))
    job_keywords    = extract_keywords(job_text)
    unique_job      = list(set(job_keywords))

    matched = [k for k in unique_job if k in resume_keywords]
    missing = [k for k in unique_job if k not in resume_keywords]
    score   = round((len(matched) / len(unique_job)) * 100) if unique_job else 0

    return matched, missing, score, len(unique_job)

def generate_suggestions(missing, matched, resume_text):
    suggestions = []

    if not missing:
        return [{ "type": "success", "text": "Excellent! Your resume covers all key terms." }]

    match_rate = round((len(matched) / (len(matched) + len(missing))) * 100) if (matched or missing) else 0

    # Score based advice
    if match_rate < 30:
        suggestions.append({
            "type": "warning",
            "text": "Your resume may not pass ATS screening. Consider tailoring it specifically for this role."
        })
    elif match_rate < 60:
        suggestions.append({
            "type": "info",
            "text": "Decent base! A few targeted edits can significantly boost your match rate."
        })

    # Use HuggingFace to classify missing keywords into categories
    if missing:
        sample = missing[:10]  # classify top 10 missing
        labels = ["technical skill", "soft skill", "action verb", "domain knowledge"]

        tech_missing  = []
        soft_missing  = []
        verb_missing  = []

        for word in sample:
            try:
                result = classifier(word, labels)
                top    = result["labels"][0]
                if top == "technical skill":
                    tech_missing.append(word)
                elif top == "soft skill":
                    soft_missing.append(word)
                elif top == "action verb":
                    verb_missing.append(word)
            except:
                pass

        if tech_missing:
            suggestions.append({
                "type": "tech",
                "text": f"This job requires {', '.join(tech_missing)} — if you have experience with any of these, add them to your resume."
            })
        if soft_missing:
            suggestions.append({
                "type": "soft",
                "text": f"The job emphasises {', '.join(soft_missing)}. Reflect these in your summary section."
            })
        if verb_missing:
            suggestions.append({
                "type": "verb",
                "text": f"Strengthen your bullet points with: {', '.join(verb_missing[:4])}."
            })

    if len(missing) > 10:
        suggestions.append({
            "type": "info",
            "text": f"{len(missing)} job keywords are missing. Mirror the job's exact language where honest and relevant."
        })

    if not suggestions:
        suggestions.append({
            "type": "info",
            "text": "Your resume is close! Naturally incorporate the missing keywords above."
        })

    return suggestions

# ─── Routes ───────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({ "status": "ok" })

@app.route("/analyse", methods=["POST"])
def analyse():
    data        = request.get_json()
    resume_text = data.get("resumeText", "")
    job_text    = data.get("jobText", "")

    if not resume_text or not job_text:
        return jsonify({ "error": "Both resume and job description are required" }), 400

    matched, missing, score, total = analyse_match(resume_text, job_text)
    suggestions = generate_suggestions(missing, matched, resume_text)

    return jsonify({
        "matched":       matched,
        "missing":       missing,
        "score":         score,
        "totalKeywords": total,
        "suggestions":   suggestions
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)