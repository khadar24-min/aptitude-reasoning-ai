const TESTS = [
  { day: 0, title: 'Aptitude & Reasoning Mock Test', formId: '262574105301043' },
  { day: 1, title: 'Number System & Percentage', formId: '262584389690069' },
  { day: 2, title: 'Profit & Loss, Ratio & Proportion, Discounts', formId: '262583785245064' },
  { day: 3, title: 'Partnership & Interest', formId: '262583763359066' },
  { day: 4, title: 'Time & Work, Pipes & Cisterns', formId: '262584010232042' },
  { day: 5, title: 'Time & Distance, Trains, Boats & Streams', formId: '262583998705071' },
  { day: 6, title: 'Averages, Ages, Mixtures & Allegations', formId: '262593847661066' },
  { day: 7, title: 'Mensuration & Probability', formId: '262584333992063' },
  { day: 8, title: 'Permutations & Combinations, Data Interpretation', formId: '262584559384068' },
  { day: 9, title: 'Series, Coding-Decoding, Analogy & Directions', formId: '262584448472063' },
  { day: 10, title: 'Ranking, Syllogisms & Seating Arrangement', formId: '262593423132049' }
];

function textValue(value) {
  if (value == null) return '';
  if (typeof value === 'object') return Object.values(value).filter(Boolean).join(' ');
  return String(value);
}

function normalizeSubmission(submission, test, questions) {
  const answers = submission.answers || {};
  const values = Object.values(answers).map((a) => ({
    name: a.name || a.text || a.label || '',
    answer: a.answer ?? a.answerValue ?? a.prettyFormat ?? ''
  }));
  const find = (pattern) => values.find((v) => pattern.test(v.name))?.answer;
  const name = textValue(find(/candidate\s*name|full\s*name/i)) || 'Unknown candidate';
  const rollNumber = textValue(find(/roll\s*(number|no\.?)/i)) || '—';
  const scoreRaw = find(/^(score|total\s*score|quiz\s*score|points|form\s*calculation|calculation)/i) ?? find(/score|points|calculation/i);
  const percentageRaw = find(/percentage|percent|accuracy/i);
  const score = Number.parseFloat(textValue(scoreRaw).replace('%',''));
  const percentage = Number.parseFloat(textValue(percentageRaw).replace('%',''));
  return {
    id: submission.id,
    testDay: test.day,
    testTitle: test.title,
    formId: test.formId,
    createdAt: submission.created_at,
    name,
    rollNumber,
    score: Number.isFinite(score) ? score : null,
    percentage: Number.isFinite(percentage) ? percentage : null,
    answers: values,
    questions
  };
}

async function fetchFormSubmissions(formId, apiKey) {
  const url = `https://api.jotform.com/form/${encodeURIComponent(formId)}/submissions?apiKey=${encodeURIComponent(apiKey)}&limit=100&orderby=created_at,DESC`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.responseCode >= 400) throw new Error(`Jotform form ${formId} request failed`);
  return data.content || [];
}

async function fetchFormQuestions(formId, apiKey) {
  const url = `https://api.jotform.com/form/${encodeURIComponent(formId)}/questions?apiKey=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  const content = data.content || {};
  return Object.values(content).map((q) => ({
    id: q.qid || q.id || '',
    name: q.name || '',
    text: q.text || q.label || '',
    type: q.type || '',
    options: q.options || null
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.JOTFORM_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'JOTFORM_API_KEY is not configured' });

  try {
    const requestedDay = req.query?.day == null || req.query.day === '' ? null : Number(req.query.day);
    const selectedTests = Number.isInteger(requestedDay) ? TESTS.filter((test) => test.day === requestedDay) : TESTS;
    if (!selectedTests.length) return res.status(400).json({ error: 'Unknown test day' });

    const results = await Promise.all(selectedTests.map(async (test) => {
      const [raw, questions] = await Promise.all([
        fetchFormSubmissions(test.formId, apiKey),
        fetchFormQuestions(test.formId, apiKey)
      ]);
      return raw.map((submission) => normalizeSubmission(submission, test, questions));
    }));

    const submissions = results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json({
      submissions,
      tests: TESTS.map(({ day, title, formId }) => ({ day, title, formId })),
      total: submissions.length,
      scoringNote: 'Scores are read from Jotform quiz/calculation fields when present. The dashboard never invents a numeric score.'
    });
  } catch (error) {
    return res.status(502).json({ error: 'Unable to load Jotform submissions', details: error.message });
  }
}