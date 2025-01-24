import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GitHub Folder Downloader - Download Files from GitHub Repositories",
  description:
    "Easily download files and folders from GitHub repositories. Enter a GitHub folder URL and download files directly.",
  author: "Your Name",
  keywords: [
    "GitHub folder downloader",
    "download GitHub files",
    "GitHub repository download",
    "GitHub folder download tool",
    "GitHub file downloader",
  ],
  openGraph: {
    title: "GitHub Folder Downloader - Download Files from GitHub Repositories",
    description:
      "Easily download files and folders from GitHub repositories. Enter a GitHub folder URL and download files directly.",
    type: "website",
    url: "https://githubdownloaderfree.vercel.app/", // Replace with your app's URL
    images: [
      {
        url: "https://githubdownloaderfree.vercel.app/og-image.png", // Replace with your app's OpenGraph image URL
        width: 1200,
        height: 630,
        alt: "GitHub Folder Downloader",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
