import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    if (data.user?.role !== "teacher") {
      return NextResponse.json(
        {
          message:
            "This account is not authorized for the teacher portal.",
        },
        {
          status: 403,
        },
      );
    }

    const response = NextResponse.json({
      message: data.message,
      user: data.user,
    });

    response.cookies.set("examai-token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Teacher login route error:", error);

    return NextResponse.json(
      {
        message: "Unable to connect to authentication server.",
      },
      {
        status: 500,
      },
    );
  }
}