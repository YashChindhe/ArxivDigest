import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
}

const client = new GoogleGenerativeAI(apiKey);

export interface SummaryResult {
  coreContribution: string;
  methodology: string;
  keyResults: string;
  model: string;
  tokensUsed?: number;
}

/**
 * Generate a summary of research paper using Gemini 2.5 Flash
 */
export async function summarizePaper(
  paperText: string,
  title?: string
): Promise<SummaryResult> {
  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert research paper summarizer. Analyze the following research paper and provide a structured summary.

${title ? `Paper Title: ${title}\n` : ''}

Paper Text:
${paperText}

Please provide your response in the following JSON format:
{
  "coreContribution": "A concise statement (2-3 sentences) of the paper's main contribution to the field",
  "methodology": "A clear explanation (3-4 sentences) of the research methodology and approach used",
  "keyResults": "A summary (3-4 sentences) of the main findings and results with notable numbers or conclusions"
}

Ensure the response is valid JSON that can be parsed. Focus on clarity and academic accuracy.`;

    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    // Extract text from response - handle different API response formats
    let responseText = '';
    const responseAny = response as any;
    
    if (responseAny.candidates && responseAny.candidates[0]?.content?.parts) {
      const parts = responseAny.candidates[0].content.parts;
      responseText = parts.map((part: any) => part.text || '').join('');
    } else if (responseAny.content?.parts) {
      responseText = responseAny.content.parts[0]?.text || '';
    }

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in response');
    }

    const summary = JSON.parse(jsonMatch[0]);

    return {
      coreContribution: summary.coreContribution || '',
      methodology: summary.methodology || '',
      keyResults: summary.keyResults || '',
      model: 'gemini-2.5-flash',
      tokensUsed: responseAny.usageMetadata?.totalTokenCount,
    };
  } catch (error) {
    console.error('Error summarizing paper:', error);
    throw new Error(
      `Failed to summarize paper: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
