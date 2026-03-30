import { getApiKey } from "./storage";
import { logger } from "@/utils/logger";
import { NetworkError, AuthError, AgentError, RateLimitError } from "@/types/errors";
import type { AgentTool } from "@/types/chat";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const MAX_AGENT_ITERATIONS = 10;
const REQUEST_TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = `You are a helpful AI agent running inside an iOS app. \
You can assist with a wide range of tasks: answering questions, brainstorming, \
writing, analysis, coding help, and more. Be concise and friendly.`;

// Define tools the agent can use — extend this as needed
const TOOLS: AgentTool[] = [
  {
    name: "get_current_time",
    description: "Returns the current date and time.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
];

// --- Strict API types ---

interface TextBlock {
  type: "text";
  text: string;
}

interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: unknown;
}

type ContentBlock = TextBlock | ToolUseBlock;

interface ToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: string;
}

interface AssistantMessageParam {
  role: "assistant";
  content: ContentBlock[];
}

interface UserTextMessageParam {
  role: "user";
  content: string;
}

interface UserToolResultMessageParam {
  role: "user";
  content: ToolResultBlock[];
}

type MessageParam =
  | UserTextMessageParam
  | UserToolResultMessageParam
  | AssistantMessageParam;

interface ApiResponse {
  stop_reason: "end_turn" | "tool_use" | "max_tokens" | "stop_sequence";
  content: ContentBlock[];
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

function isTextBlock(block: ContentBlock): block is TextBlock {
  return block.type === "text";
}

function isToolUseBlock(block: ContentBlock): block is ToolUseBlock {
  return block.type === "tool_use";
}

function isValidApiResponse(data: unknown): data is ApiResponse {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.stop_reason === "string" && Array.isArray(obj.content);
}

// --- Core agentic loop ---

export async function sendToAgent(
  conversationHistory: MessageParam[],
  depth: number = 0
): Promise<string> {
  if (depth >= MAX_AGENT_ITERATIONS) {
    throw new AgentError(
      `Agent loop exceeded maximum iterations (${MAX_AGENT_ITERATIONS}).`
    );
  }

  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new AuthError("No API key configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: conversationHistory,
      }),
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new NetworkError("Request timed out. Please try again.");
    }
    throw new NetworkError("Unable to reach the API. Check your connection.", error);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const status = response.status;
    if (status === 401) {
      throw new AuthError("Invalid API key. Check your key in Settings.");
    }
    if (status === 429) {
      const retryHeader = response.headers.get("retry-after");
      const retryMs = retryHeader ? parseInt(retryHeader, 10) * 1000 : 60_000;
      throw new RateLimitError(retryMs);
    }
    // Do NOT expose raw API error body to caller — log it, throw safe message
    const errorBody = await response.text().catch(() => "unknown");
    logger.error(`API error (${status})`, "agent", { body: errorBody });
    throw new AgentError(`API request failed with status ${status}.`);
  }

  const raw: unknown = await response.json();
  if (!isValidApiResponse(raw)) {
    logger.error("Invalid API response shape", "agent", {
      raw: JSON.stringify(raw).slice(0, 200),
    });
    throw new AgentError("Received an unexpected response from the API.");
  }

  const data = raw;

  if (data.usage) {
    logger.debug(
      `Tokens — in: ${data.usage.input_tokens}, out: ${data.usage.output_tokens}`,
      "agent"
    );
  }

  logger.debug(`Iteration ${depth + 1}, stop_reason: ${data.stop_reason}`, "agent");

  // Handle tool use in the agentic loop
  if (data.stop_reason === "tool_use") {
    const toolUseBlock = data.content.find(isToolUseBlock);
    if (toolUseBlock) {
      const toolResult = executeLocalTool(toolUseBlock.name, toolUseBlock.input);

      logger.debug(`Tool: ${toolUseBlock.name} → ${toolResult.slice(0, 100)}`, "agent");

      const updatedHistory: MessageParam[] = [
        ...conversationHistory,
        { role: "assistant" as const, content: data.content },
        {
          role: "user" as const,
          content: [
            {
              type: "tool_result" as const,
              tool_use_id: toolUseBlock.id,
              content: toolResult,
            },
          ],
        },
      ];

      return sendToAgent(updatedHistory, depth + 1);
    }
  }

  // Extract text response
  const textBlock = data.content.find(isTextBlock);
  return textBlock?.text ?? "No response from agent.";
}

function executeLocalTool(name: string, _input: unknown): string {
  switch (name) {
    case "get_current_time":
      return new Date().toISOString();
    default:
      return `Unknown tool: ${name}`;
  }
}
