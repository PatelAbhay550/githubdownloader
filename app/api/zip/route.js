import { NextResponse } from "next/server";
import axios from "axios";
import { Zip } from "adm-zip";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub token from .env.local

export async function POST(request) {
  try {
    const { githubUrl } = await request.json();

    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL is required" },
        { status: 400 }
      );
    }

    // Validate GitHub URL
    if (!githubUrl.includes("github.com")) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    // Check if the URL points to a folder (contains '/tree/')
    if (!githubUrl.includes("/tree/")) {
      return NextResponse.json(
        {
          error:
            "Please enter a URL that points to a folder (e.g., https://github.com/username/repo/tree/main/folder).",
        },
        { status: 400 }
      );
    }

    // Extract owner, repo, and folder path from the GitHub URL
    const url = new URL(githubUrl);
    const [, owner, repo, , ...folderPath] = url.pathname.split("/");
    const folder = folderPath.join("/");

    if (!owner || !repo || !folder) {
      return NextResponse.json(
        { error: "Invalid GitHub folder URL" },
        { status: 400 }
      );
    }

    // Fetch the folder contents from GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!Array.isArray(response.data)) {
      return NextResponse.json(
        { error: "Invalid folder path" },
        { status: 400 }
      );
    }

    // Create a zip file
    const zip = new Zip();

    // Download and add each file to the zip
    for (const item of response.data) {
      if (item.type === "file") {
        try {
          const fileResponse = await axios.get(item.download_url, {
            responseType: "arraybuffer",
          });
          zip.addFile(item.name, fileResponse.data);
        } catch (error) {
          console.error(`Failed to download file: ${item.name}`, error.message);
          return NextResponse.json(
            {
              error: `Failed to download file: ${item.name}. Please check the URL and try again.`,
            },
            { status: 500 }
          );
        }
      }
    }

    // Generate the zip file
    const zipBuffer = zip.toBuffer();

    // Return the zip file as a response
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${folder}.zip"`,
      },
    });
  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      {
        error:
          "Failed to process the request. Please check the GitHub URL and try again.",
      },
      { status: 500 }
    );
  }
}
