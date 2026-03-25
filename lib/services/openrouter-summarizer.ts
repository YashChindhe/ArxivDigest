import axios from 'axios';

export interface SummaryResult {
  coreContribution: string;
  methodology: string;
  keyResults: string;
  model: string;
  tokensUsed?: number;
}

/**
 * Generate a summary of research paper using OpenRouter (e.g., via Google Gemini Flash 1.5)
 */
export async function summarizePaper(
  paperText: string,
  title?: string
): Promise<SummaryResult> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!apiKey) {
      console.warn('OPENROUTER_API_KEY is not set. Falling back to mock summary.');
      return {
        coreContribution: `This research paper ${title ? `titled "${title}" ` : ''}explores novel approaches in its domain, emphasizing systematic performance enhancements and architectural refinements.`,
        methodology: "The paper employs a rigorous empirical methodology, conducting extensive ablation studies and comparative benchmarks against established state-of-the-art baselines to validate its hypothesis.",
        keyResults: "The results demonstrate a significant improvement over previous metrics (approximately $12$-$15\\%$), showing robustness across various testing scenarios and offering strong theoretical justification for the proposed changes.",
        model: 'Simulation Mode (No OpenRouter Key)',
      };
    }

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

    console.log('Sending request to OpenRouter with axios...');
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": "ArxivDigest",
        "Content-Type": "application/json"
      }
    });

    const data = response.data;
    const responseText = data.choices[0].message.content;

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in OpenRouter response');
    }

    const summary = JSON.parse(jsonMatch[0]);

    return {
      coreContribution: summary.coreContribution || '',
      methodology: summary.methodology || '',
      keyResults: summary.keyResults || '',
      model: data.model || 'google/gemini-flash-1.5 (OpenRouter)',
      tokensUsed: data.usage?.total_tokens,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('OpenRouter API error:', error.response?.status, error.response?.data);
      throw new Error(`OpenRouter API error: ${error.response?.status} ${error.response?.statusText} - ${JSON.stringify(error.response?.data)}`);
    }
    console.error('Error summarizing paper with OpenRouter:', error);
    throw new Error(
      `Failed to summarize paper with OpenRouter: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
