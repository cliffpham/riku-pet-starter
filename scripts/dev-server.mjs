import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const preferredPort = Number(process.env.PORT ?? 5173);
const host = "127.0.0.1";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const getFilePath = (urlPath) => {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const filePath = resolve(root, `.${requestedPath}`);

  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    return null;
  }

  return filePath;
};

const serve = (request, response) => {
  const filePath = getFilePath(request.url ?? "/");

  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const contentType = mimeTypes[extname(filePath)] ?? "application/octet-stream";
  response.writeHead(200, { "content-type": contentType });
  createReadStream(filePath).pipe(response);
};

const listen = (port) =>
  new Promise((resolveListen, rejectListen) => {
    const server = createServer(serve);

    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolveListen(null);
        return;
      }

      rejectListen(error);
    });

    server.listen(port, host, () => resolveListen({ port, server }));
  });

let started = false;

for (let port = preferredPort; port < preferredPort + 20; port += 1) {
  const result = await listen(port);
  if (result) {
    console.log(`Riku Pet Starter: http://${host}:${result.port}`);
    started = true;
    break;
  }
}

if (!started) {
  throw new Error(`No available port found from ${preferredPort} to ${preferredPort + 19}.`);
}
