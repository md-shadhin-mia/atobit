import type { Messages } from "@langchain/langgraph";
import { getHabitCoachAgent } from "@/lib/chat/agent";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

function extractText(content: unknown): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .map((block) => {
                if (typeof block === "string") return block;
                if (block && typeof block === "object" && "text" in block) {
                    return String((block as { text: unknown }).text ?? "");
                }
                return "";
            })
            .join("");
    }
    return "";
}

export async function POST(req: Request) {
    let messages: ChatMessage[];
    try {
        const body = await req.json();
        messages = Array.isArray(body?.messages) ? body.messages : [];
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
        async start(controller) {
            try {
                const agent = getHabitCoachAgent();
                const stream = await agent.stream(
                    { messages: messages as Messages },
                    { streamMode: "messages" }
                );

                for await (const [token, metadata] of stream) {
                    if (metadata?.langgraph_node !== "model") continue;

                    const text = extractText(token.content);
                    if (text.length > 0) {
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`)
                        );
                    }
                }

                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
                );
                controller.close();
            } catch (error) {
                controller.enqueue(
                    encoder.encode(
                        `data: ${JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                        })}\n\n`
                    )
                );
                controller.close();
            }
        },
    });

    return new Response(readable, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
