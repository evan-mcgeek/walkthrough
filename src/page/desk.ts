// The Opening's desk scene, as the design draws it (docs/design/screens.html, "Opening a review"); its CSS colours it from the tokens.
const SCENE = `<svg class="desk6" viewBox="0 -20 344 192" width="344" height="192" role="img" aria-label="The AI at its desk, reading the change"><defs><clipPath id="scr6"><rect x="32" y="30" width="152" height="92" rx="3"/></clipPath></defs><path class="stand" d="M100 130h16l4 16h-24z"/><line class="dk" x1="84" y1="148" x2="132" y2="148"/><rect class="mon" x="24" y="22" width="168" height="108" rx="9"/><g clip-path="url(#scr6)"><g class="cd"><rect class="bh" x="33" y="133.5" width="150" height="10.5" rx="2"/><rect class="sn" x="36" y="38" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="37.75" width="70" height="3.5" rx="1.75"/><rect class="sn" x="36" y="47" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="46.75" width="92" height="3.5" rx="1.75"/><rect class="sn" x="36" y="56" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="55.75" width="64" height="3.5" rx="1.75"/><rect class="sn" x="36" y="65" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="74" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="73.75" width="84" height="3.5" rx="1.75"/><rect class="sn" x="36" y="83" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="82.75" width="58" height="3.5" rx="1.75"/><rect class="sn" x="36" y="92" width="8" height="3" rx="1.5"/><rect class="sl" x="70" y="91.75" width="76" height="3.5" rx="1.75"/><rect class="sn" x="36" y="101" width="8" height="3" rx="1.5"/><rect class="sl" x="70" y="100.75" width="40" height="3.5" rx="1.75"/><rect class="sn" x="36" y="110" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="109.75" width="22" height="3.5" rx="1.75"/><rect class="sn" x="36" y="119" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="128" width="8" height="3" rx="1.5"/><rect class="sl sd" x="61" y="127.75" width="88" height="3.5" rx="1.75"/><rect class="sn" x="36" y="137" width="8" height="3" rx="1.5"/><rect class="sl sd" x="61" y="136.75" width="96" height="3.5" rx="1.75"/><rect class="sn" x="36" y="146" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="145.75" width="60" height="3.5" rx="1.75"/><rect class="sn" x="36" y="155" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="154.75" width="18" height="3.5" rx="1.75"/><rect class="sn" x="36" y="164" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="173" width="8" height="3" rx="1.5"/><rect class="sl sa" x="52" y="172.75" width="74" height="3.5" rx="1.75"/><rect class="sn" x="36" y="182" width="8" height="3" rx="1.5"/><rect class="sl sa" x="61" y="181.75" width="90" height="3.5" rx="1.75"/><rect class="sn" x="36" y="191" width="8" height="3" rx="1.5"/><rect class="sl sa" x="61" y="190.75" width="66" height="3.5" rx="1.75"/><rect class="sn" x="36" y="200" width="8" height="3" rx="1.5"/><rect class="sl sa" x="61" y="199.75" width="82" height="3.5" rx="1.75"/><rect class="sn" x="36" y="209" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="208.75" width="20" height="3.5" rx="1.75"/><rect class="sn" x="36" y="218" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="227" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="226.75" width="62" height="3.5" rx="1.75"/><rect class="sn" x="36" y="236" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="235.75" width="86" height="3.5" rx="1.75"/><rect class="sn" x="36" y="245" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="244.75" width="54" height="3.5" rx="1.75"/><rect class="sn" x="36" y="254" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="253.75" width="16" height="3.5" rx="1.75"/><rect class="sn" x="36" y="263" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="272" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="271.75" width="72" height="3.5" rx="1.75"/><rect class="sn" x="36" y="281" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="280.75" width="48" height="3.5" rx="1.75"/><g class="cb"><rect class="cbr" x="160" y="132" width="20" height="13" rx="3.5"/><text class="cbt" x="170" y="141.4" text-anchor="middle">AI</text></g><g class="ck"><circle class="ckc" cx="172" cy="184" r="7"/><path class="ckp" d="M168.6 184.2l2.3 2.3 4-4.3"/></g></g></g><rect class="rb" x="214" y="98" width="64" height="70" rx="18"/><g class="rh"><line class="ant" x1="246" y1="40" x2="246" y2="29"/><circle class="ink" cx="246" cy="27" r="3.6"/><rect class="ink" x="210" y="40" width="72" height="60" rx="17"/><g class="re"><rect class="eye" x="220" y="58" width="9" height="13" rx="4.5"/><rect class="eye" x="241" y="58" width="9" height="13" rx="4.5"/></g><g class="rhap"><path class="hap" d="M220 68q4.5-8 9 0"/><path class="hap" d="M241 68q4.5-8 9 0"/></g><ellipse class="rmo" cx="236" cy="86" rx="5" ry="4"/><path class="rsm" d="M229 84q6 6 13 0"/></g><rect class="kb" x="146" y="141" width="62" height="7" rx="2.5"/><line class="dk" x1="8" y1="148" x2="312" y2="148"/><rect class="under" x="0" y="149" width="320" height="23"/><rect class="ink m1" x="158" y="131" width="17" height="13" rx="6.5"/><rect class="ink m2" x="182" y="131" width="17" height="13" rx="6.5"/><g class="bub b1"><path class="bb" d="M258 -18h74a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-66l-7 7v-7h-1a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z"/><text class="bt6" x="295.0" y="-2" text-anchor="middle">Wait, what?!</text></g><g class="bub b2"><path class="bb" d="M258 -18h40a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-32l-7 7v-7h-1a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z"/><text class="bt6" x="278.0" y="-2" text-anchor="middle">Hmm…</text></g><g class="bub b3"><path class="bb" d="M258 -18h36a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-28l-7 7v-7h-1a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z"/><text class="bt6" x="276.0" y="-2" text-anchor="middle">Nice.</text></g></svg>`;

// The same robot after the session, from the boards "After End session" and "The session isn't running": screen off, waving or asleep.
const DESK = `<path class="stand" d="M100 130h16l4 16h-24z"/><line class="dk" x1="84" y1="148" x2="132" y2="148"/><rect class="mon" x="24" y="22" width="168" height="108" rx="9"/><rect class="off" x="32" y="30" width="152" height="92" rx="3"/><rect class="rb" x="214" y="98" width="64" height="70" rx="18"/>`;
const HEAD = `<line class="ant" x1="246" y1="40" x2="246" y2="29"/><circle class="ink" cx="246" cy="27" r="3.6"/><rect class="ink" x="210" y="40" width="72" height="60" rx="17"/>`;
const FRONT = `<rect class="kb" x="146" y="141" width="62" height="7" rx="2.5"/><line class="dk" x1="8" y1="148" x2="312" y2="148"/><rect class="under" x="0" y="149" width="344" height="23"/><rect class="ink" x="170" y="131" width="17" height="13" rx="6.5"/>`;
const FACES = {
  happy: `<path class="hap" d="M220 66q4.5-8 9 0"/><path class="hap" d="M241 66q4.5-8 9 0"/><path class="smile" d="M229 82q6 6 13 0"/>`,
  plain: `<rect class="eye" x="222" y="58" width="9" height="13" rx="4.5"/><rect class="eye" x="243" y="58" width="9" height="13" rx="4.5"/><path class="smile" d="M231 84q5 3.5 10 0"/>`,
};
const robot = (inner: string) => `<svg class="desk6 bye6" viewBox="0 -20 344 192" width="344" height="192" aria-hidden="true">${DESK}${inner}</svg>`;
const waving = (face: keyof typeof FACES) =>
  robot(`<g>${HEAD}<g>${FACES[face]}</g></g>${FRONT}<g class="wave"><rect class="ink" x="292" y="56" width="17" height="21" rx="8"/></g>`);
const ASLEEP = robot(
  `<g class="nod">${HEAD}<g><path class="hap" d="M220 66h9"/><path class="hap" d="M241 66h9"/></g><g class="zz"><text class="z1" x="284" y="34">z</text><text class="z2" x="296" y="20">z</text></g></g>${FRONT}<rect class="ink" x="196" y="131" width="17" height="13" rx="6.5"/>`,
);

/** The robot waving once, happy when something went out, or asleep while the session isn't running. */
export const byeScene = (mood: 'happy' | 'plain' | 'asleep') => scene(mood === 'asleep' ? ASLEEP : waving(mood));

export const deskScene = () => scene(SCENE);

/** A scene in its box, which pauses it while the tab is hidden or the box is offscreen; `stop` lets it go. */
function scene(markup: string): { box: HTMLElement; stop: () => void } {
  const box = document.createElement('div');
  box.className = 'desk-scene';
  box.innerHTML = markup;
  let offscreen = false;
  const pause = () => box.classList.toggle('rdpause', document.hidden || offscreen);
  const seen = new IntersectionObserver(([entry]) => {
    offscreen = !entry?.isIntersecting;
    pause();
  });
  seen.observe(box);
  document.addEventListener('visibilitychange', pause);
  pause();
  return {
    box,
    stop: () => {
      seen.disconnect();
      document.removeEventListener('visibilitychange', pause);
      box.remove();
    },
  };
}
