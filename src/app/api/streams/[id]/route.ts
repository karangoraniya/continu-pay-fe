import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Stream from "@/models/Stream";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const stream = await Stream.findOne({ streamId: params.id });
  if (!stream) {
    return NextResponse.json({ error: "Stream not found" }, { status: 404 });
  }

  return NextResponse.json(stream);
}
