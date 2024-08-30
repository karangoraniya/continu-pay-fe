import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

import Stream from "@/models/Stream";

export async function POST(request: NextRequest) {
  console.log("Received POST request to /api/streams");
  try {
    await dbConnect();
    console.log("Connected to database");

    const body = await request.json();
    console.log("Received stream data:", body);

    const stream = new Stream(body);
    console.log("Created new Stream instance");

    const savedStream = await stream.save();
    console.log("Stream saved to database:", savedStream);

    return NextResponse.json(
      { success: true, data: savedStream },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/streams:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  console.log("Received GET request to /api/streams");
  try {
    await dbConnect();
    console.log("Connected to database");

    const streams = await Stream.find({});
    console.log(`Found ${streams.length} streams`);

    return NextResponse.json({ success: true, data: streams });
  } catch (error: any) {
    console.error("Error in GET /api/streams:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
