import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ success: true, user_id: session.user.id });
}
