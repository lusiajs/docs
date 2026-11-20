import type { ApiEntry, ApiMember } from "../../reference/api.ts";

export interface MemberRow {
  name: string;
  summary: string;
  depth: number;
}

// Signatures longer than this wrap their parameters, one per line.
const WRAP_AT = 60;
const OPENERS = "([{<";
const CLOSERS = ")]}>";

// Every kind in the list once, in the order it first appears.
export function kindsOf(entries: ApiEntry[]): string[] {
  return [...new Set(entries.map((entry) => entry.kind))];
}

// Nested members become rows with a depth, so the table can indent them.
export function flattenMembers(members: ApiMember[] = [], depth = 0): MemberRow[] {
  return members.flatMap((member) => [
    { name: member.name, summary: member.summary, depth },
    ...flattenMembers(member.members, depth + 1),
  ]);
}

// The lower-case text the filter matches: the name, the summary and every member name.
export function searchText(entry: ApiEntry): string {
  const memberNames = flattenMembers(entry.members).map((row) => row.name);
  return [entry.name, entry.summary, ...memberNames].join(" ").toLowerCase();
}

// An entry shows when its text has the query and, if any kind is picked, its kind is one of them.
export function matchesFilter(
  item: { kind: string; search: string },
  query: string,
  kinds: ReadonlySet<string>,
): boolean {
  const kindMatches = kinds.size === 0 || kinds.has(item.kind);
  return kindMatches && item.search.includes(query.trim().toLowerCase());
}

export function languageOf(entry: ApiEntry): string {
  return entry.kind === "function" ? "typescript" : "lusia";
}

// Puts each parameter on its own line when the signature is long. Short signatures stay on one line.
export function wrapSignature(signature: string): string {
  if (signature.length <= WRAP_AT) return signature;
  const list = splitParameters(signature);
  if (!list || list.params.length < 2) return signature;
  const lines = list.params.map((param) => `  ${param}`).join(",\n");
  return `${list.head}(\n${lines}\n)${list.tail}`;
}

interface ParameterList {
  head: string;
  params: string[];
  tail: string;
}

// Splits the first parameter list at its top-level commas. Arrows (=>) do not count as brackets.
function splitParameters(signature: string): ParameterList | undefined {
  const open = signature.indexOf("(");
  if (open < 0) return undefined;
  const params: string[] = [];
  let depth = 0;
  let start = open + 1;
  for (let i = open; i < signature.length; i++) {
    const char = signature[i]!;
    if (char === "=" && signature[i + 1] === ">") {
      i++;
    } else if (OPENERS.includes(char)) {
      depth++;
    } else if (CLOSERS.includes(char)) {
      depth--;
      if (depth === 0) {
        params.push(signature.slice(start, i).trim());
        return { head: signature.slice(0, open), params, tail: signature.slice(i + 1) };
      }
    } else if (char === "," && depth === 1) {
      params.push(signature.slice(start, i).trim());
      start = i + 1;
    }
  }
  return undefined;
}
