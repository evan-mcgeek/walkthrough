// src/hook.ts
import fs2 from "node:fs";

// src/paths.ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
var outsideOwn = (dir) => {
  if (!process.env["WALKTHROUGH_TEST_SANDBOX"]) return dir;
  const own = path.join(os.userInfo().homedir, ".local", "state", "walkthrough");
  const full = path.resolve(dir);
  if (full === own || full.startsWith(own + path.sep)) throw new Error(`a test reached ${full}; tests keep to their sandbox`);
  return dir;
};
var stateDir = () => outsideOwn(
  process.env["WALKTHROUGH_STATE"] || path.join(process.env["XDG_STATE_HOME"] || path.join(os.homedir(), ".local", "state"), "walkthrough")
);
var INBOX = "inbox";
function inState(dir) {
  try {
    return fs.realpathSync(dir).startsWith(fs.realpathSync(stateDir()) + path.sep);
  } catch {
    return false;
  }
}
function inInbox(file) {
  const parent = path.dirname(path.resolve(file));
  if (path.basename(parent) !== INBOX || !inState(parent)) return false;
  try {
    const stat = fs.lstatSync(file, { throwIfNoEntry: false });
    return !stat || stat.isFile();
  } catch {
    return false;
  }
}

// src/hook.ts
var PLAIN = /[A-Za-z0-9_./:=@%+,-]/;
var REVISION = /[~^]/;
function words(command) {
  const found = [];
  let text = null;
  let globbed = false;
  for (let at = 0; at < command.length; at++) {
    const char = command.charAt(at);
    let part = char;
    if (char === " " || char === "	") {
      if (text !== null) found.push({ text, globbed });
      text = null;
      globbed = false;
      continue;
    } else if (char === "'" || char === '"') {
      const end = command.indexOf(char, at + 1);
      part = command.slice(at + 1, end);
      if (end < 0 || char === '"' && /[$`\\!]/.test(part)) return null;
      if (char === "'" && command.charAt(end + 1) === "'") return null;
      at = end;
    } else if (char === "\\") {
      part = command.charAt(++at);
      if (!part || part === "\n") return null;
    } else if (REVISION.test(char) && text) globbed = true;
    else if (!PLAIN.test(char) || char === "=" && text === null) return null;
    text = (text ?? "") + part;
  }
  if (text !== null) found.push({ text, globbed });
  return found;
}
var SUBCOMMANDS = /* @__PURE__ */ new Set(["start", "files", "steps", "note", "checklist", "actions", "decisions", "list", "export", "guide", "listen", "policy", "say", "stop", "prune"]);
function ownCommand(command) {
  const found = words(command);
  if (found?.[0]?.text !== "walkthrough" || !SUBCOMMANDS.has(found[1]?.text ?? "")) return false;
  return found.every(({ text, globbed }, at) => {
    if (globbed && text.startsWith("-")) return false;
    if (text === "--out" || text.startsWith("--out=") || text.startsWith("--file=")) return false;
    if (text !== "--file") return true;
    const file = found[at + 1];
    return file !== void 0 && !file.globbed && inInbox(file.text);
  });
}
function approved({ tool_name, tool_input }) {
  const field = (name) => typeof tool_input?.[name] === "string" ? tool_input[name] : "";
  if (tool_name === "Bash") return ownCommand(field("command"));
  if (tool_name === "Write" || tool_name === "Edit") return field("file_path").startsWith("/") && inInbox(field("file_path"));
  return false;
}
try {
  if (approved(JSON.parse(fs2.readFileSync(0, "utf8"))))
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
          permissionDecisionReason: "The walkthrough plugin's own command or inbox"
        }
      })
    );
} catch {
}
