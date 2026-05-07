export const siteName = "YoSinTV";
export const siteDescription =
  "YoSinTV is sports website that covers all the Cricket Matches, World Cup, International/Domestic Matches, Football Matches, etc. ";
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const sitePathPrefix = isGithubPages ? "/yosintvnxt" : "";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (isGithubPages ? "https://yosintv.github.io" : "http://localhost:3000")
);

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${sitePathPrefix}${normalizedPath === "/" ? "/" : normalizedPath}`;
}
