import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ examId: string }> },
) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { message: "BACKEND_URL is not configured" },
        { status: 500 },
      );
    }

    const { examId } = await params;

    const cookieStore = await cookies();
    const authToken = cookieStore.get("examai-token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/exams/${examId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const rawResponse = await response.text();

    let data: unknown;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      data = {
        message: rawResponse || "Invalid backend response",
      };
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("GET /api/exams/[examId] error:", error);

    return NextResponse.json(
      { message: "Failed to fetch examination" },
      { status: 500 },
    );
  }
}