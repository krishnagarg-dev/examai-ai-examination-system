import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("examai-token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const backendResponse = await fetch(
      "http://127.0.0.1:5000/auth/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const rawResponse = await backendResponse.text();

    let data: any;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      return NextResponse.json(
        { message: "Invalid response from authentication server." },
        { status: 502 },
      );
    }

    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    if (data.user?.role !== "student") {
      return NextResponse.json(
        { message: "Student access denied" },
        { status: 403 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Student verification error:", error);

    return NextResponse.json(
      { message: "Unable to verify authentication." },
      { status: 500 },
    );
  }
}