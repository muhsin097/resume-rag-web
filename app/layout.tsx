import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bold geometric/rounded sans for headings -- pairs with the logo's own
// wordmark (also a bold rounded geometric face), while body text stays on
// the more neutral Geist for readability.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const SITE_URL = "https://ceasetoresume.online";
const DESCRIPTION =
  "Tailor your resume to any job in seconds. Cease to Resume retrieves the facts from your real experience that match a job description and rewrites them in its language -- an ATS-friendly, keyword-matched resume with nothing invented.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cease to Resume -- AI Resume Tailoring, Grounded in Your Real Experience",
    template: "%s | Cease to Resume",
  },
  description: DESCRIPTION,
  keywords: [
    "resume builder",
    "AI resume tailoring",
    "ATS resume optimizer",
    "resume keyword matching",
    "tailored resume generator",
    "job application tool",
    "resume for job description",
    "AI resume writer",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Cease to Resume",
    title: "Cease to Resume -- AI Resume Tailoring, Grounded in Your Real Experience",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cease to Resume -- AI Resume Tailoring, Grounded in Your Real Experience",
    description: DESCRIPTION,
  },
};

// Site-wide identity graph -- lets search engines resolve "Cease to Resume"
// as a known entity (helps with knowledge-panel eligibility and brand
// search) independent of whichever page someone lands on.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cease to Resume",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  description: DESCRIPTION,
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cease to Resume",
  url: SITE_URL,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
