"use client";

import { useState } from "react";

export default function Home() {
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFiles([]);

    // Validate GitHub URL
    if (!githubUrl || !githubUrl.includes("github.com")) {
      setError("Please enter a valid GitHub URL.");
      setLoading(false);
      return;
    }

    // Check if the URL points to a folder (contains '/tree/')
    if (!githubUrl.includes("/tree/")) {
      setError(
        "Please enter a URL that points to a folder (e.g., https://github.com/username/repo/tree/main/folder)."
      );
      setLoading(false);
      return;
    }

    try {
      const url = new URL(githubUrl);
      const [, user, repository, , reference, ...folderPath] =
        url.pathname.split("/");
      const folder = folderPath.join("/");

      const apiUrl = `https://api.github.com/repos/${user}/${repository}/contents/${folder}?ref=${reference}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch folder contents");
      }

      const data = await response.json();
      setFiles(data.filter((item) => item.type === "file"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (file) => {
    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(file.download_url)}`
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(`Failed to download file: ${file.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#194219] flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          GitHub Folder Downloader
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="Paste GitHub.com folder URL"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Fetching Files..." : "Fetch Files"}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>

      {files.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Files in Folder
          </h2>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-gray-700">{file.name}</span>
                <button
                  onClick={() => downloadFile(file)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
