import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, generateObject, CoreMessage } from "ai";
import { config } from "../../config/google.config.js";
import chalk from "chalk";
import { z } from "zod";

// Type definitions
interface ToolCall {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

interface ToolResult {
  toolCallId: string;
  toolName: string;
  result: unknown;
}

interface StreamResult {
  content: string;
  finishReason: string | undefined;
  usage: Record<string, number> | undefined;
  toolCalls: ToolCall[];
  toolResults: ToolResult[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps: any[] | undefined;
}

type OnChunkCallback = (chunk: string) => void;
type OnToolCallCallback = (toolCall: ToolCall) => void;

// Default configuration values
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_MAX_STEPS = 5;

export class AIService {
  private model: ReturnType<ReturnType<typeof createGoogleGenerativeAI>>;

  constructor() {
    if (!config.googleGenerativeAIApiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    const google = createGoogleGenerativeAI({
      apiKey: config.googleGenerativeAIApiKey,
    });

    this.model = google(config.botbyteModel);
  }

  /**
   * Send a message and get streaming response
   * @param messages - Array of message objects {role, content}
   * @param onChunk - Callback for each text chunk
   * @param tools - Optional tools object
   * @param onToolCall - Callback for tool calls
   * @returns Full response with content, tool calls, and usage
   */
  async sendMessage(
    messages: CoreMessage[],
    onChunk?: OnChunkCallback,
    tools?: Record<string, unknown>,
    onToolCall?: OnToolCallCallback | null
  ): Promise<StreamResult> {
    try {
      const result = streamText({
        model: this.model,
        messages: messages,
        temperature: DEFAULT_TEMPERATURE,
        maxOutputTokens: DEFAULT_MAX_TOKENS,
        ...(tools && Object.keys(tools).length > 0
          ? {
              tools: tools as Parameters<typeof streamText>[0]["tools"],
              maxSteps: DEFAULT_MAX_STEPS,
            }
          : {}),
      });

      if (tools && Object.keys(tools).length > 0) {
        console.log(
          chalk.gray(`[DEBUG] Tools enabled: ${Object.keys(tools).join(", ")}`)
        );
      }

      let fullResponse = "";

      // Stream text chunks
      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
      }

      // IMPORTANT: Await the result to get access to steps, toolCalls, etc.
      const fullResult = await result;

      const toolCalls: ToolCall[] = [];
      const toolResults: ToolResult[] = [];

      // Collect tool calls from all steps (if they exist)
      const steps = await fullResult.steps;
      if (steps && Array.isArray(steps)) {
        for (const step of steps) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const stepToolCalls = (step as any).toolCalls;
          if (stepToolCalls && stepToolCalls.length > 0) {
            for (const toolCall of stepToolCalls) {
              const formattedToolCall: ToolCall = {
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
                args: toolCall.input || toolCall.args || {},
              };
              toolCalls.push(formattedToolCall);
              if (onToolCall) {
                onToolCall(formattedToolCall);
              }
            }
          }

          // Collect tool results
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const stepToolResults = (step as any).toolResults;
          if (stepToolResults && stepToolResults.length > 0) {
            toolResults.push(...stepToolResults);
          }
        }
      }

      const finishReason = await fullResult.finishReason;
      const usage = await fullResult.usage;

      return {
        content: fullResponse,
        finishReason,
        usage: usage as Record<string, number> | undefined,
        toolCalls,
        toolResults,
        steps,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(chalk.red("AI Service Error:"), errorMessage);
      if (error instanceof Error) {
        console.error(chalk.red("Full error:"), error);
      }
      throw error;
    }
  }

  /**
   * Get a non-streaming response
   * @param messages - Array of message objects
   * @param tools - Optional tools
   * @returns Response text
   */
  async getMessage(
    messages: CoreMessage[],
    tools?: Record<string, unknown>
  ): Promise<string> {
    const result = await this.sendMessage(messages, undefined, tools);
    return result.content;
  }

  /**
   * Generate structured output using a Zod schema
   * @param schema - Zod schema for the expected output
   * @param prompt - Prompt for generation
   * @returns Parsed object matching the schema
   */
  async generateStructured<T extends z.ZodTypeAny>(
    schema: T,
    prompt: string
  ): Promise<z.infer<T>> {
    try {
      const result = await generateObject({
        model: this.model,
        schema: schema,
        prompt: prompt,
      });

      return result.object as z.infer<T>;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(chalk.red("AI Structured Generation Error:"), errorMessage);
      throw error;
    }
  }
}