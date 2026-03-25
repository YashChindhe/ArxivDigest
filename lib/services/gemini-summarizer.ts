import { GoogleGenerativeAI } from '@google/generative-ai';

let client: GoogleGenerativeAI | null = null;

function getClient() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!client) {
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

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
    const aiClient = getClient();
    
    // Fallback if no API key is provided for demonstration purposes
    if (!aiClient) {
      return {
        coreContribution: `This research paper ${title ? `titled "${title}" ` : ''}explores novel approaches in its domain, emphasizing systematic performance enhancements and architectural refinements.`,
        methodology: "The paper employs a rigorous empirical methodology, conducting extensive ablation studies and comparative benchmarks against established state-of-the-art baselines to validate its hypothesis.",
        keyResults: "The results demonstrate a significant improvement over previous metrics (approximately $12$-$15\\%$), showing robustness across various testing scenarios and offering strong theoretical justification for the proposed changes.",
        model: 'Simulation Mode (No API Key)',
      };
    }

    // Using gemini-1.5-flash as it has the 1M token context window requested
    const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
