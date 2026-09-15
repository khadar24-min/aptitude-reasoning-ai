export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.JOTFORM_API_KEY;
  const formId = process.env.JOTFORM_FORM_ID || '262574105301043';
  if (!apiKey) return res.status(500).json({ error: 'JOTFORM_API_KEY is not configured' });

  try {
    const url = `https://api.jotform.com/form/${encodeURIComponent(formId)}/submissions?apiKey=${encodeURIComponent(apiKey)}&limit=50&orderby=created_at,DESC`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok || data.responseCode >= 400) return res.status(502).json({ error: 'Jotform API request failed', details: data });

    const submissions = (data.content || []).map((submission) => {
      const answers = submission.answers || {};
      const values = Object.values(answers).map((a) => ({ name: a.name || a.text || '', answer: a.answer ?? a.answerValue ?? '' }));
      const name = values.find(v => /candidate name|name/i.test(v.name))?.answer || 'Unknown candidate';
      const rollNumber = values.find(v => /roll number|roll no/i.test(v.name))?.answer || '—';
      return { id: submission.id, createdAt: submission.created_at, name: typeof name === 'object' ? Object.values(name).join(' ') : String(name), rollNumber: typeof rollNumber === 'object' ? Object.values(rollNumber).join(' ') : String(rollNumber), answers: values };
    });
    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load Jotform submissions', details: error.message });
  }
}