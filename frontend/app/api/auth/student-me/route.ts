import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000";

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get("examai-token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(
      data,
      { status: response.status },
    );
  } catch (error) {
    console.error(
      "Student me API error:",
      error,
    );

    return NextResponse.json(
      { message: "Failed to fetch student profile" },
      { status: 500 },
    );
  }
}