import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });

  try {
    const { submission } = req.body || {};
    if (!submission) return res.status(400).json({ error: 'Submission is required' });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6',
      instructions: `You are the assessment analytics engine for an Aptitude & Reasoning platform. Analyze one Jotform submission using the supplied question metadata and selected answers.

Return ONLY valid JSON with these fields:
{
  candidateName, rollNumber, score, totalQuestions, percentage, correctCount, incorrectCount,
  strengths: string[], weaknesses: string[], recommendations: string[],
  topicPerformance: [{topic, correct, total, percentage, status}]
}

Rules:
1. If a verified Jotform score exists, use it exactly.
2. If no score exists, solve the supplied multiple-choice questions yourself and calculate the score only when the question text and selected answer are sufficient. Do not guess ambiguous questions. If an item cannot be reliably scored, exclude it from the calculated total and explain that in a recommendation.
3. Group questions into the actual syllabus topics represented by the test. Use the test title and question wording to identify topics.
4. topicPerformance percentages must be based only on reliably scored questions in that topic.
5. Strengths and weaknesses must come from the observed topic performance, not generic advice.
6. Never invent candidate details or submission answers.`,
      input: JSON.stringify(submission)
    });

    const text = response.output_text;
    let result;
    try { result = JSON.parse(text); } catch { result = { rawAnalysis: text }; }
    return res.status(200).json(result);
  } catch (error) {
    console.error('AI analysis error:', error?.message || error);
    return res.status(500).json({
      error: 'AI analysis failed',
      details: error?.message || 'Unknown OpenAI error'
    });
  }
}