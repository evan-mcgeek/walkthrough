// src/words.ts
var plural = (count, word) => `${String(count)} ${word}${count === 1 ? "" : "s"}`;
var MAX_TEXT = 4e3;
function tooLong(fields) {
  const long = Object.values(fields).find((value) => typeof value === "string" && value.length > MAX_TEXT);
  return long === void 0 ? null : `That text is ${String(long.length)} characters long; the most it can be is ${String(MAX_TEXT)}.`;
}

// src/page/dom.ts
function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}
function region(id) {
  const found = document.getElementById(id);
  if (!found) throw new Error(`the page has no #${id}`);
  return found;
}
var token = location.pathname.split("/")[2] ?? "";
function showAlert(message) {
  const box = region("alert");
  box.textContent = message;
  box.hidden = message === null;
}
var unreachable = ({ name, reopen }) => `Could not reach the ${name}. ${reopen}`;
async function post(page, route, body) {
  const problem = tooLong(body);
  if (problem) {
    showAlert(problem);
    return null;
  }
  try {
    const answer = await fetch(`/${route}?token=${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    if (answer.ok) {
      showAlert(null);
      return answer;
    }
    const said = await answer.json().catch(() => ({}));
    showAlert(typeof said.error === "string" ? said.error : `The ${page.name} could not do that (${String(answer.status)}).`);
    return null;
  } catch {
    showAlert(unreachable(page));
    return null;
  }
}

// src/page/list.ts
var header = region("header");
var main = region("main");
var PAGE = { name: "list", reopen: "Run walkthrough list again to reopen it." };
var post2 = (route, body) => post(PAGE, route, body);
async function open(one) {
  const answer = await post2("open", { id: one.id });
  if (answer) location.assign((await answer.json()).url);
}
async function stop() {
  if (!await post2("stop", {})) return;
  clearInterval(poller);
  header.replaceChildren(el("h1", {}, "Walkthroughs"));
  main.replaceChildren(el("p", { className: "notice" }, "The list has stopped. You can close this tab."));
}
function row(one) {
  const progress = `${String(one.decided)} of ${plural(one.steps, "step")} decided, ${String(one.read)} read`;
  const last = new Date(one.last);
  return el(
    "tr",
    {},
    el("td", {}, el("button", { type: "button", className: "quiet", onclick: () => void open(one) }, one.name)),
    // What walkthrough prune takes to remove this one.
    el("td", {}, el("code", {}, one.id)),
    el("td", {}, one.steps ? progress : "Preparing"),
    el("td", {}, el("time", { dateTime: one.last }, last.toLocaleString()))
  );
}
var shown = "";
function render(list) {
  shown = JSON.stringify(list);
  header.replaceChildren(
    el("div", { className: "title" }, el("h1", {}, "Walkthroughs")),
    el("div", { className: "actions" }, el("button", { type: "button", className: "quiet", onclick: () => void stop() }, "Stop"))
  );
  if (!list.length) {
    main.replaceChildren(el("p", { className: "notice" }, "This repo has no walkthroughs; run /walkthrough to start one."));
    return;
  }
  const head = el("tr", {}, ...["Walkthrough", "Id", "Progress", "Last activity"].map((name) => el("th", { scope: "col" }, name)));
  main.replaceChildren(el("table", { className: "walkthroughs" }, el("thead", {}, head), el("tbody", {}, ...list.map(row))));
}
var load = async () => {
  const answer = await fetch("data/list.json");
  if (!answer.ok) throw new Error(String(answer.status));
  return answer.text();
};
render(JSON.parse(await load()));
var poller = setInterval(() => {
  load().then((text) => {
    if (text !== shown) render(JSON.parse(text));
  }).catch(() => {
    showAlert(unreachable(PAGE));
  });
}, 5e3);
