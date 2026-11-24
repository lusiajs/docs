import { searchPages, type SearchEntry } from "./build.ts";
import { matchToken, mergeRanges, toParts, type Field, type Part, type Range } from "./fuzzy.ts";

// One line in the palette. A result links to its section. A recent or suggested term fills the box.
export interface Row {
  index: number;
  icon: string;
  title: Part[];
  summary: Part[];
  section: string;
  href: string;
  term?: string;
}

export interface Group {
  label: string;
  rows: Row[];
}

export const suggestedTerms = ["variable", "animate", "EACH", "bind-value", "playground"];

const TITLE_WEIGHT = 3;
const SUMMARY_WEIGHT = 1.5;
const KEYWORD_WEIGHT = 1;
const ROWS_PER_PAGE = 12;
const NO_HREF = "#";

interface Scored {
  entry: SearchEntry;
  score: number;
}

// Every query word must match somewhere in an entry, or the entry is left out.
export function groupsFor(index: SearchEntry[], typed: string, recent: string[]): Group[] {
  const terms = typed.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return numbered(idleGroups(recent));
  const found = searchGroups(index, terms);
  return numbered(found.length > 0 ? found : [suggestionGroup()]);
}

export function countRows(groups: Group[]): number {
  return groups.reduce((total, group) => total + group.rows.length, 0);
}

export function rowCounts(groups: Group[]): number[] {
  return groups.map((group) => group.rows.length);
}

export function idleGroups(recent: string[]): Group[] {
  const groups: Group[] = [];
  if (recent.length > 0) {
    groups.push({
      label: "Recent",
      rows: recent.map((term) => termRow(term, "history")),
    });
  }
  groups.push(suggestionGroup());
  return groups;
}

function suggestionGroup(): Group {
  return {
    label: "Suggestions",
    rows: suggestedTerms.map((term) => termRow(term, "lightbulb")),
  };
}

function termRow(term: string, icon: string): Row {
  return {
    index: 0,
    icon,
    title: [{ text: term, hit: false }],
    summary: [],
    section: "",
    href: NO_HREF,
    term,
  };
}

function searchGroups(index: SearchEntry[], terms: string[]): Group[] {
  const scored = index.flatMap((entry) => {
    const score = scoreEntry(entry, terms);
    return score > 0 ? [{ entry, score }] : [];
  });
  scored.sort(byScoreThenShortTitle);
  return searchPages
    .map((page) => ({
      label: page,
      rows: scored
        .filter((item) => item.entry.page === page)
        .slice(0, ROWS_PER_PAGE)
        .map((item) => entryRow(item.entry, terms)),
    }))
    .filter((group) => group.rows.length > 0);
}

// A shorter title ranks higher when the scores tie, so "variable()" comes before "variable.compute()".
function byScoreThenShortTitle(a: Scored, b: Scored): number {
  return b.score - a.score || a.entry.title.text.length - b.entry.title.text.length;
}

function scoreEntry(entry: SearchEntry, terms: string[]): number {
  let total = 0;
  for (const term of terms) {
    const best = Math.max(
      weighted(entry.title, term, TITLE_WEIGHT),
      weighted(entry.summary, term, SUMMARY_WEIGHT),
      weighted(entry.keywords, term, KEYWORD_WEIGHT),
    );
    if (best === 0) return 0;
    total += best;
  }
  return total;
}

function weighted(target: Field, term: string, weight: number): number {
  return (matchToken(target, term)?.score ?? 0) * weight;
}

function entryRow(entry: SearchEntry, terms: string[]): Row {
  return {
    index: 0,
    icon: entry.icon,
    title: highlight(entry.title, terms),
    summary: highlight(entry.summary, terms),
    section: entry.section,
    href: entry.href,
  };
}

function highlight(target: Field, terms: string[]): Part[] {
  const ranges: Range[] = [];
  for (const term of terms) {
    const hit = matchToken(target, term);
    if (hit) ranges.push(...hit.ranges);
  }
  return toParts(target.text, mergeRanges(ranges));
}

// Gives every row its position in the flat list. The keyboard moves through that list.
function numbered(groups: Group[]): Group[] {
  let index = 0;
  for (const group of groups) {
    for (const row of group.rows) row.index = index++;
  }
  return groups;
}
