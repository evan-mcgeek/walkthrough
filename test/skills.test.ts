import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const SKILLS = path.resolve(import.meta.dirname, '..', 'plugin', 'skills');
const skill = (name: string) => fs.readFileSync(path.join(SKILLS, name, 'SKILL.md'), 'utf8');
const SHARED = '\n## Walking through\n';
const shared = (text: string) => (text.includes(SHARED) ? text.slice(text.indexOf(SHARED)) : '');

// A plugin skill reading a shared file asks the person each time, so each skill carries the shared procedure itself.
describe('the skills', () => {
  test('/walkthrough and /walkthrough:pr share their procedure from "Walking through" on, word for word', () => {
    const own = skill('walkthrough');
    const requested = skill('pr');

    expect(shared(own)).toContain('## Listening for the page');
    expect(shared(requested)).toBe(shared(own));
  });

  test('only /walkthrough:pr starts a pull request, and each reads only its own part of the policy', () => {
    expect(skill('walkthrough')).not.toContain('--pr <number>');
    expect(skill('walkthrough')).toContain('"Shared rules" and "My change"');
    expect(skill('pr')).toContain('--pr <number>');
    expect(skill('pr')).toContain('"Shared rules" and "Someone else\'s change"');
  });

  test('/walkthrough:init holds the policy interview and the voice offer, and the review skills send the person there', () => {
    const init = skill('init');

    for (const text of [
      'walkthrough policy init',
      'walkthrough policy save --file <file>',
      '"Your [AI] comments go out under your name; the voice plugin makes them read like you. Want it?"',
      '"Write the comments that go out in my voice, from my VOICE.md."',
      '"Never offer the voice plugin."',
      '`claude plugin marketplace add evan-mcgeek/skills`',
      '`claude plugin install voice@evan-mcgeek-skills`',
    ])
      expect(init).toContain(text);
    for (const name of ['walkthrough', 'pr']) {
      expect(skill(name)).not.toContain('walkthrough policy init');
      expect(skill(name)).toContain('invoke `/walkthrough:init`');
    }
  });

  test('the policy template has the parts the skills name', () => {
    const template = fs.readFileSync(path.join(SKILLS, 'walkthrough', 'REVIEW.md'), 'utf8');
    const parts = [...template.matchAll(/^## (.+)$/gm)].map(match => match[1]);

    expect(parts).toEqual(['Shared rules', 'My change', "Someone else's change"]);
  });
});
