import { projects } from "../data/projects";

const siteUrl = "https://gabrielsoares.art.br";

const staticPages = [
  "",
  "about",
  "credits",
  "work",
];

const workPages = projects.map((project) => `work/${project.slug}`);

const pages = [...staticPages, ...workPages];

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((page) => {
    const url = page ? `${siteUrl}/${page}` : siteUrl;

    return `  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}