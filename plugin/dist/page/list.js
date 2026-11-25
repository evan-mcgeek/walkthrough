// src/words.ts
var MAX_TEXT = 4e3;
function tooLong(fields) {
  const long = Object.values(fields).find((value) => typeof value === "string" && value.length > MAX_TEXT);
  return long === void 0 ? null : `That text is ${String(long.length)} characters long; the most it can be is ${String(MAX_TEXT)}.`;
}

// src/page/icons.ts
var round = { fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round" };
var line = (d, width = 1.7) => ["path", { d, ...round, "stroke-width": width }];
var ring = (extra = {}) => ["circle", { cx: 8, cy: 8, r: 6.2, fill: "none", stroke: "currentColor", "stroke-width": 1.6, ...extra }];
var ICONS = {
  /** The brand's walked W: the last stroke, still to go, is lighter. */
  mark: [
    ["path", { d: "M1.6 3.2L4.6 12.8L8 5.6L11.4 12.8", ...round, "stroke-width": 2.3 }],
    ["path", { d: "M11.4 12.8L14.4 3.2", ...round, "stroke-width": 2.3, opacity: 0.4 }]
  ],
  sidebar: [
    ["rect", { x: 1.5, y: 2.5, width: 13, height: 11, rx: 2, fill: "none", stroke: "currentColor", "stroke-width": 1.4 }],
    ["rect", { x: 2.6, y: 3.6, width: 3.4, height: 8.8, rx: 0.8, fill: "currentColor" }]
  ],
  /** The one spinner: the dashed ring with its turning arc, while the AI works. */
  spinner: [
    ring({ "stroke-opacity": 0.45, "stroke-dasharray": "2.4 2.2" }),
    line("M8 1.8a6.2 6.2 0 0 1 6.2 6.2", 1.9)
  ],
  more: [3.5, 8, 12.5].map((cx) => ["circle", { cx, cy: 8, r: 1.4, fill: "currentColor" }]),
  message: [line("M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z", 1.5)],
  own: [
    ["circle", { cx: 8, cy: 5.6, r: 2.6, fill: "none", stroke: "currentColor", "stroke-width": 1.5 }],
    line("M3 13.5c.8-2.4 2.7-3.6 5-3.6s4.2 1.2 5 3.6", 1.5)
  ],
  summary: [line("M3 3.5h10M3 8h10M3 12.5h6", 1.6)],
  /** A file not viewed yet; `met` doubles as a viewed one. */
  ring: [ring()],
  met: [ring(), line("M5 8.2l2 2 4-4.3")],
  "not-met": [ring(), line("M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8")],
  partly: [ring(), line("M5 8h6")],
  unchecked: [ring({ "stroke-dasharray": "2.4 2.2" })],
  eye: [
    ["path", { d: "M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z", ...round, "stroke-width": 1.4 }],
    ["circle", { cx: 8, cy: 8, r: 2, fill: "currentColor" }]
  ],
  ask: [
    ring({ "stroke-width": 1.5 }),
    line("M6.3 6.3a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.3", 1.5),
    ["circle", { cx: 8, cy: 11.4, r: 0.9, fill: "currentColor" }]
  ],
  edit: [line("M10.5 2.8l2.7 2.7-7.4 7.4-3.2.5.5-3.2z", 1.4)],
  trash: [line("M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5", 1.4)],
  "chevron-right": [line("M6 4l4 4-4 4")],
  previous: [line("M10 3.5L5.5 8l4.5 4.5")],
  next: [line("M6 3.5L10.5 8 6 12.5")],
  up: [line("M4 10l4-4 4 4")],
  warn: [
    ["path", { d: "M8 2l6.5 11.5h-13z", ...round, "stroke-width": 1.5 }],
    line("M8 6.5v3.2", 1.6),
    ["circle", { cx: 8, cy: 11.6, r: 0.9, fill: "currentColor" }]
  ],
  offline: [line("M2 6a9 9 0 0 1 12 0M4.3 8.5a5.6 5.6 0 0 1 7.4 0M6.6 11a2.2 2.2 0 0 1 2.8 0M2.5 2.5l11 11", 1.5)],
  file: [["path", { d: "M4 1.8h5l3 3v9.4H4z M9 1.8v3h3", ...round, "stroke-width": 1.5 }]]
};
var SVG = "http://www.w3.org/2000/svg";
function icon(name, label) {
  const svg = document.createElementNS(SVG, "svg");
  for (const [key, value] of Object.entries({ viewBox: "0 0 16 16", width: 16, height: 16, focusable: "false" }))
    svg.setAttribute(key, String(value));
  svg.classList.add("icon", `icon-${name}`);
  if (label) {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", label);
  } else svg.setAttribute("aria-hidden", "true");
  for (const [tag, attributes] of ICONS[name]) {
    const shape = document.createElementNS(SVG, tag);
    for (const [key, value] of Object.entries(attributes)) shape.setAttribute(key, String(value));
    svg.append(shape);
  }
  return svg;
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
  box.replaceChildren(...message === null ? [] : [icon("warn"), el("span", {}, message)]);
  box.hidden = message === null;
  document.body.classList.remove("unreachable");
}
function showUnreachable({ name, reopen, retry }) {
  if (document.body.classList.contains("unreachable")) return;
  const box = region("alert");
  box.replaceChildren(
    icon("offline"),
    el("span", { className: "banner-text" }, el("strong", {}, `Could not reach the ${name}.`), ` ${reopen}`),
    ...retry ? [el("button", { type: "button", className: "btn small", onclick: retry }, "Retry now")] : []
  );
  box.hidden = false;
  document.body.classList.add("unreachable");
}
var send = (route, body) => fetch(`/${route}?token=${token}`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body)
});
async function post(page, route, body) {
  const problem = tooLong(body);
  if (problem) {
    showAlert(problem);
    return null;
  }
  try {
    const answer = await send(route, body);
    if (answer.ok) {
      showAlert(null);
      return answer;
    }
    const said = await answer.json().catch(() => ({}));
    showAlert(typeof said.error === "string" ? said.error : `The ${page.name} could not do that (${String(answer.status)}).`);
    return null;
  } catch {
    showUnreachable(page);
    return null;
  }
}

// src/page/appearance.ts
function showTheme(theme) {
  document.documentElement.dataset["theme"] = theme;
}
async function loadViewer() {
  try {
    const answer = await fetch("data/viewer.json");
    if (answer.ok) {
      const { theme } = await answer.json();
      showTheme(theme);
      return theme;
    }
  } catch {
  }
  return "system";
}

// src/page/list.ts
var TYPES = { comment: "Comment", approve: "Approve", "request-changes": "Request changes" };
var header = region("header");
var main = region("main");
var PAGE = { name: "list", reopen: "Run walkthrough list to reopen." };
var post2 = (route, body) => post(PAGE, route, body);
async function open(one) {
  const answer = await post2("open", { id: one.id });
  if (answer) location.assign((await answer.json()).url);
}
async function stop() {
  if (!await post2("stop", {})) return;
  clearInterval(poller);
  header.querySelector(".header-end")?.remove();
  const banner = region("alert");
  banner.className = "banner";
  banner.replaceChildren(el("span", { className: "banner-text" }, el("strong", {}, "List stopped."), " You can close this tab."));
  banner.hidden = false;
  main.classList.add("stopped");
  main.inert = true;
}
var UNITS = [
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60]
];
function ago(iso) {
  const seconds = (Date.parse(iso) - Date.now()) / 1e3;
  const format = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
  for (const [unit, size] of UNITS) if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  return format.format(0, "second");
}
function progress(one) {
  return el("span", { className: "list-progress" }, `${String(one.viewed)} / ${String(one.files)} files viewed`);
}
function row(one) {
  const name = el("button", { type: "button", className: "list-open", onclick: () => void open(one) }, one.name);
  name.dataset["key"] = `open:${one.id}`;
  return el(
    "tr",
    { role: "row" },
    // The id is what walkthrough prune takes to remove this one.
    el("td", { role: "cell" }, el("div", { className: "list-name" }, name), el("code", { className: "list-id" }, decodeURIComponent(one.id))),
    el("td", { role: "cell" }, progress(one)),
    el("td", { role: "cell" }, one.submitted ? TYPES[one.submitted] : ""),
    el("td", { role: "cell", className: "muted" }, el("time", { dateTime: one.last, title: new Date(one.last).toLocaleString() }, ago(one.last)))
  );
}
var shown = "";
function render(page) {
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement.dataset["key"] : void 0;
  header.replaceChildren(
    el("span", { className: "logo" }, icon("mark"), "Walkthrough"),
    el("span", { className: "session-label" }, page.repo),
    el("div", { className: "header-end" }, el("button", { type: "button", className: "btn small", onclick: () => void stop() }, "Stop"))
  );
  const head = el(
    "tr",
    { role: "row" },
    ...["Walkthrough", "Viewed", "Review", "Last activity"].map((name) => el("th", { scope: "col", role: "columnheader" }, name))
  );
  main.replaceChildren(
    el("h1", { className: "list-title" }, "Walkthroughs"),
    page.walkthroughs.length ? el(
      "table",
      { className: "walkthroughs", role: "table" },
      el("thead", { role: "rowgroup" }, head),
      el("tbody", { role: "rowgroup" }, ...page.walkthroughs.map(row))
    ) : el("p", { className: "list-empty" }, "No walkthroughs. Run /walkthrough.")
  );
  if (focused !== void 0) document.querySelector(`[data-key="${CSS.escape(focused)}"]`)?.focus();
}
var load = async () => {
  const answer = await fetch("data/list.json");
  if (!answer.ok) throw new Error(String(answer.status));
  return answer.text();
};
await loadViewer();
shown = await load();
render(JSON.parse(shown));
var poller = setInterval(() => {
  load().then((text) => {
    if (document.body.classList.contains("unreachable")) showAlert(null);
    if (text !== shown) render(JSON.parse(shown = text));
    else for (const time of main.querySelectorAll("time")) time.textContent = ago(time.dateTime);
  }).catch(() => {
    showUnreachable(PAGE);
  });
}, 5e3);
