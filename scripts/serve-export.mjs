/** Serve the production export at the same base path as GitHub Pages. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const base = "/Judeverse/";
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (pathname === "/" || pathname === "/Judeverse") {
      response.writeHead(302, { Location: base }).end();
      return;
    }
    if (!pathname.startsWith(base)) throw new Error("Not found");
    let target = resolve(root, pathname.slice(base.length));
    if (target !== resolve(root) && !target.startsWith(resolve(root) + sep))
      throw new Error("Not found");
    if ((await stat(target)).isDirectory())
      target = resolve(target, "index.html");
    const body = await readFile(target);
    response.writeHead(200, {
      "Content-Type": mime[extname(target)] || "application/octet-stream",
      "Content-Length": body.length,
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
}).listen(port, "0.0.0.0", () =>
  console.log(`Static export listening on port ${port} at ${base}`),
);
