import { NextResponse } from "next/server";
import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub token from .env.local

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return NextResponse.json(
      { error: "File URL is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileUrl
          .split("/")
          .pop()}"`,
      },
    });
  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      {
        error:
          "Failed to download the file. Please check the URL and try again.",
      },
      { status: 500 }
    );
  }
}
