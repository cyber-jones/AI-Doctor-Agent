import db from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();
  const user = await currentUser();

  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(SessionChatTable)
      // @ts-ignore
      .values({
        sessionId: sessionId,
        notes: notes,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdOn: new Date().toISOString(),
        selectedDoctor: selectedDoctor,
      }) // @ts-ignore
      .returning({ SessionChatTable });

    return NextResponse.json(result[0]?.SessionChatTable);
  } catch (err: any) {
    NextResponse.json(err);
    // return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  try {
    const result = await db
      .select()
      .from(SessionChatTable)
      // @ts-ignore
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(result[0]);
  } catch (err: any) {
    NextResponse.json(err);
  }
}
