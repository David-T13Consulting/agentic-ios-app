export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AgentTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}
