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

  test('the policy template has the parts the skills name', () => {
    const template = fs.readFileSync(path.join(SKILLS, 'walkthrough', 'REVIEW.md'), 'utf8');
    const parts = [...template.matchAll(/^## (.+)$/gm)].map(match => match[1]);

    expect(parts).toEqual(['Shared rules', 'My change', "Someone else's change"]);
  });
});
