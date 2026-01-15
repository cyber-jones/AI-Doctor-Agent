import db from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { REPORT_GEN_PROMPT } from "@/lib/list";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sessionId, sessionDetail, messages } = await req.json();

  try {
    const userInput =
      "AI Doctor Agent Info:" +
      JSON.stringify(sessionDetail) +
      ", Conversation:" +
      JSON.stringify(messages);
    const completion = await openai.chat.completions.create({
    //   model: "google/gemini-2.0-flash-exp:free",
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    const rawResponse = completion.choices[0].message.content || "";
    console.log("AI-RawResponse", rawResponse);
    const res = rawResponse.trim().replace("```json`", "").replace("```", "");
    const JSONRep = JSON.parse(res);
    console.log("AI-Doctors-Summary", JSONRep);

    const result = await db
      .update(SessionChatTable)
      .set({ report: JSONRep })
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(result);
  } catch (err: any) {
    console.log("Error report generation:", err.message);
    return NextResponse.json(err);
  }
}
