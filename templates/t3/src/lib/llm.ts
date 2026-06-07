/**
 * Generic, provider-agnostic LLM call used by the BYOK demo.
 *
 * Targets the widely-supported OpenAI-compatible `/v1/chat/completions` shape so
 * it works with many providers (OpenAI, OpenRouter, Together, local servers,
 * etc.) just by changing the base URL.
 */

export interface LlmCallOptions {
  apiKey: string;
  prompt: string;
  baseUrl?: string;
  model?: string;
}

export async function callLlm({
  apiKey,
  prompt,
  baseUrl = "https://api.openai.com/v1",
  model = "gpt-4o-mini",
}: LlmCallOptions): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 256,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}). ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "(empty response)";
}
