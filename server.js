// need deno installed, then `deno run --allow-net --allow-read  --allow-write server.js`
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";

const PORT = 8091;
const SNIPPETS_DIR = "./snippets";
const API_KEY = ; // add apikey or code to load it

// Ensure the snippets directory exists
await ensureDir(SNIPPETS_DIR);

const handler = async (req: Request): Promise<Response> => {
  const authHeader = req.headers.get("Authorization");
  
  // Check if the Authorization header is present and matches the Bearer token
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (token !== API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method === "POST" && req.headers.get("content-type") === "text/plain") {
    const body = new TextDecoder().decode(await req.arrayBuffer());
    const fileName = `${SNIPPETS_DIR}/snippet-${Date.now()}.txt`;

    try {
      await Deno.writeTextFile(fileName, body);
      return new Response("Snippet saved!", { status: 200 });
    } catch (error) {
      console.error("Error writing file:", error);
      return new Response("Error saving snippet.", { status: 500 });
    }
  }
  
  return new Response("Invalid request.", { status: 400 });
};

console.log(`HTTP server is running on http://localhost:${PORT}/`);
await Deno.serve({ port: PORT }, handler);
