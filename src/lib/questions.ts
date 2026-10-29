const QUESTION_START =
  /^(what|how|why|when|where|which|who|can|could|does|do|did|is|are|was|were|should|will|would)\b/i;

function cleanHeading(text: string): string {
  return text.replace(/\s+/g, ' ').trim().replace(/[.。]+$/g, '');
}

function lowerFirst(value: string): string {
  const firstWord = value.split(/\s+/)[0] ?? '';
  if (/^[A-Z0-9][A-Z0-9.+-]*$/.test(firstWord) || /\d/.test(firstWord.charAt(0))) {
    return value;
  }
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/** Keep an author-written label, and add a question mark when it is not one yet. */
export function ensureQuestion(label: string): string {
  const clean = cleanHeading(label);
  if (!clean) return clean;
  if (/[?？]$/.test(label.trim())) return label.replace(/\s+/g, ' ').trim();
  if (QUESTION_START.test(clean)) return `${clean}?`;
  return `${clean}?`;
}

/**
 * Turn a heading into a right-rail question.
 * Explicit frontmatter wins; this is the fallback for every other heading.
 */
export function headingToQuestion(text: string): string {
  const clean = cleanHeading(text);
  if (!clean) return clean;
  if (/[?？]$/.test(text.trim())) return text.replace(/\s+/g, ' ').trim();
  if (QUESTION_START.test(clean)) return `${clean}?`;

  if (/^conclusions?$/i.test(clean)) return 'What should you take away?';
  if (/^faq$/i.test(clean) || /frequently asked/i.test(clean)) {
    return 'What are the common questions?';
  }

  const price = clean.match(/^(.*?)\s+pric(?:e|ing)$/i);
  if (price) {
    const subject = price[1].trim();
    return subject ? `What does ${subject} cost?` : 'What does it cost?';
  }

  if (/^build(?:ing)?\b/i.test(clean)) {
    const rest = clean
      .replace(/^building\b/i, 'build')
      .replace(/\bShipping\b/g, 'ship')
      .replace(/\bBuilding\b/g, 'build')
      .replace(/\bUsing\b/g, 'use');
    return `How do I ${lowerFirst(rest)}?`;
  }

  if (/^us(?:e|ing)\b/i.test(clean)) {
    const rest = clean.replace(/^using\b/i, 'use');
    return `How do I ${lowerFirst(rest)}?`;
  }

  if (/^access\b/i.test(clean)) {
    return `How do I ${lowerFirst(clean)}?`;
  }

  const numbered = clean.match(/^\d+\.\s+(.*)$/);
  if (numbered?.[1]) {
    const rest = cleanHeading(numbered[1]);
    if (QUESTION_START.test(rest) || /[?？]$/.test(rest)) return headingToQuestion(rest);
    return `How do I ${lowerFirst(rest)}?`;
  }

  if (/^from\b/i.test(clean)) {
    return `How do you go ${lowerFirst(clean)}?`;
  }

  return `What is ${lowerFirst(clean)}?`;
}

function norm(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

export function labelForHeading(
  heading: { slug: string; text: string },
  nav?: Record<string, string>,
): string {
  if (nav) {
    const direct = nav[heading.slug] ?? nav[heading.text];
    if (direct) return ensureQuestion(direct);

    const headingNorm = norm(heading.text);
    const match = Object.entries(nav).find(([key]) => norm(key) === headingNorm || key === heading.slug);
    if (match?.[1]) return ensureQuestion(match[1]);
  }

  return headingToQuestion(heading.text);
}
