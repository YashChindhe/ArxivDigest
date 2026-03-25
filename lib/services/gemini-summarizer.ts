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
 * Generate a summary of research paper using Gemini 1.5 Flash
 */
export async function summarizePaper(
  paperText: string,
  title?: string
): Promise<SummaryResult> {
  try {
    // Using gemini-1.5-flash as it has the 1M token context window requested
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert research paper summarizer. Analyze the following research paper and provide a structured summary.
    
Focus on academic accuracy and clarity. Use LaTeX notation for any mathematical formulas (e.g., $E=mc^2$ or $$a^2 + b^2 = c^2$$).

${title ? `Paper Title: ${title}\n` : ''}

Paper Text:
${paperText}

Please provide your response in the following JSON format:
{
  "coreContribution": "A concise statement (2-3 sentences) of the paper's main contribution to the field",
  "methodology": "A clear explanation (3-4 sentences) of the research methodology and approach used",
  "keyResults": "A summary (3-4 sentences) of the main findings and results with notable numbers or conclusions"
}

Ensure the response is valid JSON that can be parsed. Do not include any text outside the JSON block.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

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
      model: 'gemini-1.5-flash',
      tokensUsed: result.response.usageMetadata?.totalTokenCount,
    };
  } catch (error) {
    console.error('Error summarizing paper:', error);
    throw new Error(
      `Failed to summarize paper: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
