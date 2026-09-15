import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });

  try {
    const { submission } = req.body || {};
    if (!submission) return res.status(400).json({ error: 'Submission is required' });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      instructions: `You are the assessment analytics engine for an Aptitude & Reasoning Mock Test. Analyze the supplied Jotform submission for the creator only. Return valid JSON with: candidateName, rollNumber, score, totalQuestions, percentage, correctCount, incorrectCount, strengths (array), weaknesses (array), recommendations (array), topicPerformance (array of objects with topic and status). Do not invent answers or scores. If score data is absent, calculate it only when the submission contains enough answer-key information.`,
      input: JSON.stringify(submission)
    });

    const text = response.output_text;
    let result;
    try { result = JSON.parse(text); } catch { result = { rawAnalysis: text }; }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'AI analysis failed', details: error.message });
  }
}