// The page server: one detached process per walkthrough, on loopback only, behind a private token in the page address.
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedFiles, fileAt } from './change';
import { readJson, writeJson } from './json-files';
import { previewType } from './preview';
import { alive, psStart } from './processes';
import { decide, markRead, walkthroughView } from './decisions';
import { listView } from './list';
import { ask, reply, sessionView } from './session';
import { readWalkthrough } from './walkthrough';

type ServerRecord = { pid: number; started: string; url: string };
type Answer = { status: number; body?: unknown; after?: () => void };
type Route = (body: Record<string, unknown>) => Answer | Promise<Answer>;

const MAX_BODY_BYTES = 256 * 1024;
// A server no page has polled for this long was forgotten, so it stops itself.
const IDLE_MS = 30 * 60 * 1000;
export const PAGE = path.join(import.meta.dirname, 'page');
const STYLE = { file: 'style.css', type: 'text/css; charset=utf-8' };
const PAGE_FILES: Record<string, { file: string; type: string }> = {
  '': { file: 'index.html', type: 'text/html; charset=utf-8' },
  'app.js': { file: 'app.js', type: 'text/javascript; charset=utf-8' },
  'style.css': STYLE,
};
const LIST_FILES: Record<string, { file: string; type: string }> = {
  '': { file: 'list.html', type: 'text/html; charset=utf-8' },
  'list.js': { file: 'list.js', type: 'text/javascript; charset=utf-8' },
  'style.css': STYLE,
};
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
// The page loads and calls nothing but this server, and no other page can frame it or learn its address.
const SECURITY_HEADERS = {
  'content-security-policy':
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'cross-origin-resource-policy': 'same-origin',
};

const recordFile = (dir: string) => path.join(dir, 'server.json');
const readRecord = (dir: string) => readJson<ServerRecord | null>(recordFile(dir), null);

function pageToken(dir: string): string {
  const file = path.join(dir, 'token');
  try {
    const kept = fs.readFileSync(file, 'utf8').trim();
    if (/^[0-9a-f]{48}$/.test(kept)) return kept;
  } catch {
    // The first start of this walkthrough.
  }
  const token = crypto.randomBytes(24).toString('hex');
  fs.writeFileSync(file, `${token}\n`, { mode: 0o600 });
  return token;
}

export function serverRunning(dir: string): boolean {
  const record = readRecord(dir);
  return !!record && alive(record);
}

const sleep = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export async function ensureServer(dir: string, list = false): Promise<string> {
  const running = readRecord(dir);
  if (running && alive(running)) return running.url;
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const log = fs.openSync(path.join(dir, 'server.log'), 'a', 0o600);
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), 'serve', dir, ...(list ? ['--list'] : [])], {
    detached: true,
    stdio: ['ignore', log, log],
  });
  child.unref();
  fs.closeSync(log);
  for (const end = Date.now() + 10_000; Date.now() < end; await sleep(50)) {
    const record = readRecord(dir);
    if (record && record.pid === child.pid) return record.url;
  }
  throw new Error(`the page server did not start; see ${path.join(dir, 'server.log')}`);
}

export async function stopServer(dir: string): Promise<boolean> {
  const record = readRecord(dir);
  if (!record || !alive(record)) {
    fs.rmSync(recordFile(dir), { force: true });
    return false;
  }
  process.kill(record.pid, 'SIGTERM');
  for (const end = Date.now() + 8000; Date.now() < end && alive(record); ) await sleep(50);
  if (alive(record)) process.kill(record.pid, 'SIGKILL');
  fs.rmSync(recordFile(dir), { force: true });
  return true;
}

export function serve(dir: string, list = false): void {
  const token = pageToken(dir);
  const stop: Route = () => ({ status: 200, body: { stopped: true }, after: shutDown });
  const routes: Record<string, Route> = list
    ? { '/open': ({ id }) => open(dir, id), '/stop': stop }
    : {
        '/decide': fields => answered(decide(dir, fields)),
        '/read': ({ step }) => answered(markRead(dir, step)),
        '/ask': fields => answered(ask(dir, fields)),
        '/reply': ({ to, text }) => answered(reply(dir, to, text)),
        '/stop': stop,
      };
  let seen = Date.now();
  const server = http.createServer((req, res) => {
    // The page polls, so a request under its private address means a page is still open.
    if (req.url?.startsWith(`/s/${token}/`)) seen = Date.now();
    try {
      gate(req, res, { dir, list, token, port: String((server.address() as AddressInfo).port), routes });
    } catch (error) {
      failRequest(res, error);
    }
  });
  const shutDown = () => {
    if (readRecord(dir)?.pid === process.pid) fs.rmSync(recordFile(dir), { force: true });
    process.exit(0);
  };
  process.on('SIGTERM', shutDown);
  process.on('SIGINT', shutDown);
  process.on('uncaughtException', logged);
  const idleMs = Number(process.env['WALKTHROUGH_IDLE_MS']) || IDLE_MS;
  setInterval(() => {
    if (Date.now() - seen > idleMs) shutDown();
  }, Math.min(idleMs / 4, 60_000));
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address() as AddressInfo;
    const record: ServerRecord = {
      pid: process.pid,
      started: psStart(process.pid),
      url: `http://127.0.0.1:${String(port)}/s/${token}/`,
    };
    writeJson(recordFile(dir), record);
  });
}

const answered = (view: object | null): Answer => (view ? { status: 200, body: view } : { status: 400 });

async function open(repoDir: string, id: unknown): Promise<Answer> {
  const listed = listView(repoDir).find(one => one.id === id);
  return listed ? { status: 200, body: { url: await ensureServer(path.join(repoDir, listed.id)) } } : { status: 400 };
}

const logged = (error: unknown) => {
  console.error(`walkthrough server: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`);
};

function failRequest(res: http.ServerResponse, error: unknown): void {
  logged(error);
  if (res.headersSent) res.end();
  else res.writeHead(500, JSON_HEADERS).end(JSON.stringify({ error: 'walkthrough could not do that' }));
}

/** A changed file the page can preview, as it is at the head commit; the server runs in the repo the CLI started it in. */
function serveChangedFile(dir: string, file: string, res: http.ServerResponse): void {
  const walkthrough = readWalkthrough(dir);
  const type = previewType(file);
  const changed =
    walkthrough && type && changedFiles(process.cwd(), walkthrough.base, walkthrough.head).some(one => one.path === file);
  const content = changed ? fileAt(process.cwd(), walkthrough.head, file) : null;
  if (!type || !content) {
    res.writeHead(404).end();
    return;
  }
  // Opened on its own, a file from the change (an SVG, say) runs no script and has no origin.
  res
    .writeHead(200, {
      'content-type': type,
      'cache-control': 'no-store',
      'content-security-policy': "default-src 'none'; sandbox",
    })
    .end(content);
}

function serveFile(dir: string, list: boolean, what: string, query: URLSearchParams, res: http.ServerResponse): void {
  if (!list && what === 'file') {
    serveChangedFile(dir, query.get('path') ?? '', res);
    return;
  }
  const data: Record<string, () => unknown> = list
    ? { 'data/list.json': () => listView(dir) }
    : { 'data/walkthrough.json': () => walkthroughView(dir), 'data/session.json': () => sessionView(dir) };
  const view = Object.hasOwn(data, what) ? data[what] : undefined;
  if (view) {
    res.writeHead(200, JSON_HEADERS).end(JSON.stringify(view()));
    return;
  }
  const files = list ? LIST_FILES : PAGE_FILES;
  const known = Object.hasOwn(files, what) ? files[what] : undefined;
  if (!known) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': known.type, 'cache-control': 'no-store' });
  fs.createReadStream(path.join(PAGE, known.file)).pipe(res);
}

/** The request's JSON body, or null when it is not JSON; too large a body is answered 413 once it has all arrived. */
function readBody(req: http.IncomingMessage, res: http.ServerResponse, onBody: (body: unknown) => void): void {
  let size = 0;
  const chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => {
    size += chunk.length;
    if (size > MAX_BODY_BYTES * 256) req.destroy();
    else if (size <= MAX_BODY_BYTES) chunks.push(chunk);
  });
  req.on('end', () => {
    if (size > MAX_BODY_BYTES) {
      res.writeHead(413).end();
      return;
    }
    let body: unknown = null;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      // Not JSON: each route says what it makes of nothing.
    }
    onBody(body);
  });
}

type Gate = { dir: string; list: boolean; token: string; port: string; routes: Record<string, Route> };

function gate(req: http.IncomingMessage, res: http.ServerResponse, { dir, list, token, port, routes }: Gate): void {
  const prefix = `/s/${token}/`;
  const url = new URL(req.url ?? '', 'http://127.0.0.1');
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name, value);
  // Answered once the request has been read to its end, so the sender gets the answer and not a broken connection.
  const refuse = (code: number) => {
    const answer = () => res.writeHead(code).end();
    req.resume();
    if (req.complete) answer();
    else req.once('end', answer);
  };
  // Not another site's name pointed here (DNS rebinding), nor a request another site makes.
  const own = ['127.0.0.1', 'localhost'].map(host => `${host}:${port}`);
  const { host = '', origin } = req.headers;
  if (!own.includes(host) || (origin !== undefined && !own.includes(origin.replace(/^http:\/\//, '')))) {
    refuse(403);
    return;
  }
  if (req.method === 'GET' && url.pathname.startsWith(prefix)) {
    serveFile(dir, list, url.pathname.slice(prefix.length), url.searchParams, res);
    return;
  }
  const given = Buffer.from(url.searchParams.get('token') ?? '');
  const expected = Buffer.from(token);
  const authorized = given.length === expected.length && crypto.timingSafeEqual(given, expected);
  const route = Object.hasOwn(routes, url.pathname) ? routes[url.pathname] : undefined;
  if (req.method !== 'POST' || !authorized || !route) {
    refuse(404);
    return;
  }
  // A form on another site cannot send JSON without asking first, and that question is never answered.
  if (!/^application\/json\b/i.test(req.headers['content-type'] ?? '')) {
    refuse(415);
    return;
  }
  readBody(req, res, body => {
    const fields = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
    Promise.resolve()
      .then(() => route(fields))
      .then(({ status, body: said, after }) => {
        if (after) res.once('finish', after);
        if (said === undefined) res.writeHead(status).end();
        else res.writeHead(status, JSON_HEADERS).end(JSON.stringify(said));
      })
      .catch((error: unknown) => {
        failRequest(res, error);
      });
  });
}
