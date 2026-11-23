// src/words.ts
var plural = (count, word) => `${String(count)} ${word}${count === 1 ? "" : "s"}`;
var MAX_TEXT = 4e3;
function tooLong(fields) {
  const long = Object.values(fields).find((value) => typeof value === "string" && value.length > MAX_TEXT);
  return long === void 0 ? null : `That text is ${String(long.length)} characters long; the most it can be is ${String(MAX_TEXT)}.`;
}

// src/page/icons.ts
var round = { fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round" };
var line = (d, width = 1.7) => ["path", { d, ...round, "stroke-width": width }];
var ring = (extra = {}) => ["circle", { cx: 8, cy: 8, r: 6.2, fill: "none", stroke: "currentColor", "stroke-width": 1.6, ...extra }];
var block = (x, y, width, height, opacity = 1) => ["rect", { x, y, width, height, rx: 1, fill: "currentColor", ...opacity < 1 && { opacity } }];
var ICONS = {
  /** Queue and step states. */
  unread: [ring()],
  read: [ring(), ["path", { d: "M8 1.8a6.2 6.2 0 0 1 0 12.4z", fill: "currentColor" }]],
  // The tick is cut out of the disc in the canvas colour.
  decided: [
    ["circle", { cx: 8, cy: 8, r: 7, fill: "currentColor" }],
    ["path", { d: "M4.8 8.2l2.1 2.1 4.3-4.6", ...round, "stroke-width": 1.8, class: "knockout" }]
  ],
  reopened: [line("M13 8a5 5 0 1 1-1.6-3.7"), line("M11.8 1.8v3h-3")],
  folded: [block(2, 3, 12, 3), block(2, 8, 12, 2, 0.55), block(2, 12, 12, 2, 0.3)],
  message: [line("M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z", 1.5)],
  /** Checklist statuses. */
  met: [ring(), line("M5 8.2l2 2 4-4.3")],
  "not-met": [ring(), line("M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8")],
  partly: [ring(), line("M5 8h6")],
  unchecked: [ring({ "stroke-dasharray": "2.4 2.2" })],
  /** Notices and session. */
  warn: [
    ["path", { d: "M8 2l6.5 11.5h-13z", ...round, "stroke-width": 1.5 }],
    line("M8 6.5v3.2", 1.6),
    ["circle", { cx: 8, cy: 11.6, r: 0.9, fill: "currentColor" }]
  ],
  unlink: [line("M6.5 9.5l-1.8 1.8a2 2 0 0 1-2.8-2.8L3.7 6.7M9.5 6.5l1.8-1.8a2 2 0 0 1 2.8 2.8l-1.8 1.8M5 3V1.5M3 5H1.5M11 13v1.5M13 11h1.5", 1.5)],
  offline: [line("M2 6a9 9 0 0 1 12 0M4.3 8.5a5.6 5.6 0 0 1 7.4 0M6.6 11a2.2 2.2 0 0 1 2.8 0M2.5 2.5l11 11", 1.5)],
  ask: [
    ring({ "stroke-width": 1.5 }),
    line("M6.3 6.3a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.3", 1.5),
    ["circle", { cx: 8, cy: 11.4, r: 0.9, fill: "currentColor" }]
  ],
  spinner: [
    ["circle", { cx: 8, cy: 8, r: 6, fill: "none", stroke: "currentColor", "stroke-opacity": 0.25, "stroke-width": 2 }],
    line("M8 2a6 6 0 0 1 6 6", 2)
  ],
  /** Files and controls. */
  file: [["path", { d: "M4 1.8h5l3 3v9.4H4z M9 1.8v3h3", ...round, "stroke-width": 1.5 }]],
  more: [3.5, 8, 12.5].map((cx) => ["circle", { cx, cy: 8, r: 1.4, fill: "currentColor" }]),
  "chevron-right": [line("M6 4l4 4-4 4")],
  "chevron-down": [line("M4 6l4 4 4-4")],
  previous: [line("M10 3.5L5.5 8l4.5 4.5")],
  next: [line("M6 3.5L10.5 8 6 12.5")],
  /** The brand's walked W: the last stroke, still to go, is lighter. */
  mark: [
    ["path", { d: "M1.6 3.2L4.6 12.8L8 5.6L11.4 12.8", ...round, "stroke-width": 2.3 }],
    ["path", { d: "M11.4 12.8L14.4 3.2", ...round, "stroke-width": 2.3, opacity: 0.4 }]
  ],
  /** Layouts. */
  "layout-queue": [block(1, 2, 5, 12), block(7.3, 2, 7.7, 12, 0.5)],
  "layout-three": [block(1, 2, 3.5, 12), block(5.8, 2, 5, 12, 0.5), block(12, 2, 3, 12)],
  "layout-split": [block(1, 2, 6.3, 12, 0.5), block(8.7, 2, 6.3, 12)],
  "layout-panel": [block(1, 2, 3.5, 12), block(5.8, 2, 9.2, 7.5, 0.5), block(5.8, 10.7, 9.2, 3.3)]
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
  box.className = "banner attention";
  box.replaceChildren(...message === null ? [] : [icon("warn"), el("span", {}, message)]);
  box.hidden = message === null;
  if (message === null) document.body.classList.remove("unreachable");
}
function showUnreachable({ name, reopen, retry }) {
  const box = region("alert");
  box.className = "banner attention";
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
  header.querySelector(".header-end")?.remove();
  const banner = region("alert");
  banner.className = "banner";
  banner.replaceChildren(el("span", { className: "banner-text" }, el("strong", {}, "The list has stopped."), " You can close this tab."));
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
  if (!one.steps) return el("span", { className: "list-progress" }, "Preparing");
  const bar = el(
    "span",
    { className: "list-bar" },
    ...one.segments.map((state) => {
      const segment = el("span", { className: "segment" }, ...state === "decided" ? [el("span", { className: "segment-fill" })] : []);
      segment.dataset["state"] = state;
      return segment;
    })
  );
  bar.setAttribute("aria-hidden", "true");
  return el("span", { className: "list-progress" }, bar, `${String(one.decided)} of ${plural(one.steps, "step")} decided, ${String(one.read)} read`);
}
function row(one) {
  const name = el("button", { type: "button", className: "list-open", onclick: () => void open(one) }, one.name);
  name.dataset["key"] = `open:${one.id}`;
  return el(
    "tr",
    {},
    // The id is what walkthrough prune takes to remove this one.
    el("td", {}, name, el("code", { className: "list-id" }, one.id)),
    el("td", {}, progress(one)),
    el("td", { className: "muted" }, el("time", { dateTime: one.last, title: new Date(one.last).toLocaleString() }, ago(one.last)))
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
  const head = el("tr", {}, ...["Walkthrough", "Progress", "Last activity"].map((name) => el("th", { scope: "col" }, name)));
  main.replaceChildren(
    el("h1", { className: "list-title" }, "Walkthroughs"),
    el("p", { className: "muted list-sub" }, "In this repository"),
    page.walkthroughs.length ? el("table", { className: "walkthroughs" }, el("thead", {}, head), el("tbody", {}, ...page.walkthroughs.map(row))) : el("p", { className: "list-empty" }, "This repo has no walkthroughs; run /walkthrough to start one.")
  );
  if (focused !== void 0) document.querySelector(`[data-key="${CSS.escape(focused)}"]`)?.focus();
}
var load = async () => {
  const answer = await fetch("data/list.json");
  if (!answer.ok) throw new Error(String(answer.status));
  return answer.text();
};
shown = await load();
render(JSON.parse(shown));
var poller = setInterval(() => {
  load().then((text) => {
    if (text !== shown) render(JSON.parse(shown = text));
    else for (const time of main.querySelectorAll("time")) time.textContent = ago(time.dateTime);
  }).catch(() => {
    showUnreachable(PAGE);
  });
}, 5e3);
