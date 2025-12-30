import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/lib/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      // model: "gpt-4o-mini",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content:
            "User Notes/Symptoms: " +
            notes +
            ", Depending on User Notes/symptoms, please suggest list of doctors, return object in json format only",
        },
      ],
    });

    const rawResponse = completion.choices[0].message.content || "";
    console.log("AI-RawResponse", rawResponse);
    const res = rawResponse.trim().replace("```json`", "").replace("```", "");
    const JSONRep = JSON.parse(res);
    console.log("AI-Doctors", JSONRep);

    return NextResponse.json(JSONRep);
  } catch (err: any) {
    console.log("Error in suggesting doctors:", err.message);
    return NextResponse.json(err);
  }
}
