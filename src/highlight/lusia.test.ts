import { describe, expect, test } from "bun:test";
// languages.ts loads the TypeScript and SCSS grammars and registers lusia, the same way the site does.
import Prism from "./languages.ts";

interface Piece {
  type: string;
  text: string;
}

type Tokens = (string | Prism.Token)[];

// Flattens Prism's nested tokens into typed pieces, so tests can look for one construct at a time.
function pieces(tokens: Tokens): Piece[] {
  return tokens.flatMap((token) => {
    if (typeof token === "string") return [];
    const nested = typeof token.content === "string" ? [] : pieces(asList(token.content));
    return [{ type: token.type, text: textOf(token) }, ...nested];
  });
}

function asList(content: Tokens | string | Prism.Token): Tokens {
  return Array.isArray(content) ? content : [content];
}

function textOf(token: string | Prism.Token): string {
  if (typeof token === "string") return token;
  return asList(token.content).map(textOf).join("");
}

function tokenize(source: string): Piece[] {
  return pieces(Prism.tokenize(source, Prism.languages.lusia!));
}

function hasPiece(list: Piece[], type: string, text: string): boolean {
  return list.some((piece) => piece.type === type && piece.text === text);
}

describe("lusia Prism grammar", () => {
  test("flow tags are their own token, separate from HTML tags", () => {
    const list = tokenize(
      `<IF {ready.value}>\n  <p>Hi</p>\n<ELSEIF {guest.value}>\n  <p>x</p>\n<ELSE>\n  <p>y</p>\n</IF>`,
    );
    expect(hasPiece(list, "flow-name", "IF")).toBe(true);
    expect(hasPiece(list, "flow-name", "ELSEIF")).toBe(true);
    expect(hasPiece(list, "flow-name", "ELSE")).toBe(true);
    expect(hasPiece(list, "tag", "p")).toBe(true);
  });

  test("ELSEIF and ELSE branches need no closing tag", () => {
    const list = tokenize(
      `<IF {score.value >= 90}>\n  <p>A</p>\n<ELSEIF {score.value >= 70}>\n  <p>C</p>\n<ELSE>\n  <p>Try again</p>\n</IF>`,
    );
    expect(hasPiece(list, "flow-name", "ELSEIF")).toBe(true);
    expect(hasPiece(list, "flow-name", "ELSE")).toBe(true);
    expect(hasPiece(list, "flow-name", "IF")).toBe(true);
    expect(hasPiece(list, "component-name", "ELSE")).toBe(false);
  });

  test("on:name attributes get an event prefix and name", () => {
    const list = tokenize(`<button on:click={save}>Save</button>`);
    expect(hasPiece(list, "event-prefix", "on:")).toBe(true);
    expect(hasPiece(list, "event-attr", "on:click")).toBe(true);
  });

  test("EVENT, SCREEN and EDGE names are constants", () => {
    const list = tokenize(
      `<script>\nlisten(EVENT.VIEW, SCREEN.X);\nconst more = { start: [EDGE.TOP, EDGE.BOTTOM] };\n</script>`,
    );
    expect(hasPiece(list, "constant", "EVENT.VIEW")).toBe(true);
    expect(hasPiece(list, "constant", "SCREEN.X")).toBe(true);
    expect(hasPiece(list, "constant", "EDGE.TOP")).toBe(true);
    expect(hasPiece(list, "constant", "EDGE.BOTTOM")).toBe(true);
  });

  test("EACH and FOR tags with their flow attributes", () => {
    const list = tokenize(
      `<EACH {todos} as={todo} index={i} key={todo.id}>\n</EACH>\n<FOR {n} from={0} to={5} step={1}>\n</FOR>`,
    );
    expect(hasPiece(list, "flow-name", "EACH")).toBe(true);
    expect(hasPiece(list, "flow-name", "FOR")).toBe(true);
    for (const name of ["as", "index", "key", "from", "to", "step"]) {
      expect(hasPiece(list, "flow-attr", name)).toBe(true);
    }
  });

  test("the braces of a flow tag are embedded TypeScript", () => {
    const list = tokenize(`<IF {mode.value === "member"}>x</IF>`);
    const expressions = list.filter((piece) => piece.type === "expression");
    expect(expressions.map((piece) => piece.text)).toContain(`{mode.value === "member"}`);
    expect(list.some((piece) => piece.type === "keyword" && piece.text === "const")).toBe(false);
  });

  test("event, bind-value, and animate attributes get their own tokens", () => {
    const list = tokenize(
      `<button onclick={save} class="x">Save</button>\n<input bind-value={name} bind-element={field} />\n<div animate={{ play: fade }}></div>`,
    );
    expect(hasPiece(list, "event-attr", "onclick")).toBe(true);
    expect(hasPiece(list, "bind-attr", "bind-value")).toBe(true);
    expect(hasPiece(list, "bind-attr", "bind-element")).toBe(true);
    expect(hasPiece(list, "animate-attr", "animate")).toBe(true);
    expect(hasPiece(list, "attr-name", "class")).toBe(true);
  });

  test("component tags are their own token", () => {
    const list = tokenize(`<FeatureCounter />\n<badge label={label} />`);
    expect(hasPiece(list, "component-name", "FeatureCounter")).toBe(true);
    expect(hasPiece(list, "tag", "badge")).toBe(true);
  });

  test("text expressions are embedded TypeScript", () => {
    const list = tokenize(`<p>Count: {count.value * 2}</p>`);
    expect(hasPiece(list, "expression", "{count.value * 2}")).toBe(true);
  });

  test("script blocks are TypeScript, not markup", () => {
    const list = tokenize(`<script>\nconst count = 1;\n</script>\n<p>{count}</p>`);
    expect(list.some((piece) => piece.type === "script")).toBe(true);
    expect(list.some((piece) => piece.type === "keyword" && piece.text === "const")).toBe(true);
  });
});
