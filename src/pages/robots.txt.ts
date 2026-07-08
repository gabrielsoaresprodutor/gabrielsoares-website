const siteUrl = "https://gabrielsoares.art.br";

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap-index.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}