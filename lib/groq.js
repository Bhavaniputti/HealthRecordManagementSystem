const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

export async function groqChat({ messages, model = DEFAULT_MODEL, temperature = 0.3, stream = false }) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model, messages, temperature, stream }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  if (stream) return response;

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function analyzeReport(reportText) {

  const prompt = `

You are an advanced medical AI assistant.

Analyze the medical report carefully.

IMPORTANT RULES:
- Detect ALL abnormal values.
- Compare values with normal ranges.
- Mark values as high, low, or critical.
- Extract blood sugar, glucose, hemoglobin, cholesterol, WBC, RBC, thyroid, BP, creatinine, platelets and all lab values if present.
- Never leave abnormal_values empty if abnormal findings exist.
- If text is unclear, still try best-effort extraction.

MEDICAL REPORT:
${reportText}

Return ONLY valid JSON.

{
  "summary": "2-3 sentence summary",

  "key_findings": [
    "finding 1",
    "finding 2"
  ],

  "medications": [
    "medicine 1"
  ],

  "abnormal_values": [
    {
      "name": "Hemoglobin",
      "value": "9.5",
      "normal_range": "12-16",
      "status": "low"
    }
  ],

  "recommendations": [
    "recommendation 1"
  ],

  "patient_explanation": "Simple explanation for patient",

  "report_type": "lab"
}

`;

  const content =
    await groqChat({

      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],

      temperature: 0.1,
    });

  try {

    const cleaned =
      content
        .replace(
          /```json\n?/g,
          ''
        )
        .replace(
          /```\n?/g,
          ''
        )
        .trim();

    return JSON.parse(
      cleaned
    );

  } catch {

    return {

      summary:
        content.slice(
          0,
          300
        ),

      key_findings: [],

      medications: [],

      abnormal_values: [],

      recommendations: [],

      patient_explanation:
        'Analysis completed. Please review the summary above.',

      report_type:
        'general',
    };
  }
}
export async function extractPrescriptionData(text) {
  const prompt = `Extract medicine information from this prescription text. Return only valid JSON.

Text: ${text}

Return:
{
  "medicines": [{"name": "...", "dosage": "...", "frequency": "...", "duration": "...", "instructions": "..."}],
  "doctor": "doctor name if found",
  "date": "date if found",
  "patient": "patient name if found"
}`;

  const content = await groqChat({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
  });

  try {
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { medicines: [], doctor: '', date: '', patient: '' };
  }
}

export async function streamChatResponse({ messages, onChunk, onDone }) {
  const response = await groqChat({ messages, stream: true, temperature: 0.5 });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

    for (const line of lines) {
      const data = line.replace('data: ', '');
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          onChunk(content);
        }
      } catch {}
    }
  }

  onDone(fullContent);
}
