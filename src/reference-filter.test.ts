import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { initReferenceFilter } from "./reference-filter.ts";

interface CardSpec {
  id: string;
  kind: string;
  group: string;
  search: string;
}

const CARDS: CardSpec[] = [
  { id: "variable", kind: "function", group: "function", search: "variable() creates a value" },
  { id: "when", kind: "value", group: "value", search: "when attach timing" },
];

let controller: AbortController;

beforeEach(() => {
  document.body.innerHTML = "";
  controller = new AbortController();
});

afterEach(() => {
  controller.abort();
  document.body.innerHTML = "";
});

describe("reference filter", () => {
  test("applies on init when the cards are there", () => {
    const root = setup();
    initReferenceFilter(root, controller.signal);

    expect(count(root).textContent).toBe("2 entries");
    expect(card(root, "variable").hidden).toBe(false);
    expect(card(root, "when").hidden).toBe(false);
    expect(link(root, "variable").hidden).toBe(false);
    expect(empty(root).hidden).toBe(true);
  });

  test("shows a card that mounts after init", async () => {
    const root = setup();
    initReferenceFilter(root, controller.signal);
    appendCard(root, { id: "each", kind: "markup", group: "markup", search: "each loops" });

    await nextFrame();

    expect(card(root, "each").hidden).toBe(false);
    expect(link(root, "each").hidden).toBe(false);
    expect(group(root, "markup").hidden).toBe(false);
    expect(count(root).textContent).toBe("3 entries");
  });

  test("applies the filter it already has to a card that mounts late", async () => {
    const root = setup();
    initReferenceFilter(root, controller.signal);
    typeFilter(root, "loops");
    appendCard(root, { id: "each", kind: "markup", group: "markup", search: "each loops" });

    await nextFrame();

    expect(card(root, "each").hidden).toBe(false);
    expect(card(root, "variable").hidden).toBe(true);
    expect(count(root).textContent).toBe("1 of 3 entries");
    expect(empty(root).hidden).toBe(true);
  });

  test("filters by text", () => {
    const root = setup();
    initReferenceFilter(root, controller.signal);
    typeFilter(root, " ATTACH ");

    expect(card(root, "when").hidden).toBe(false);
    expect(card(root, "variable").hidden).toBe(true);
    expect(link(root, "variable").hidden).toBe(true);
    expect(group(root, "function").hidden).toBe(true);
    expect(indexGroup(root, "function").hidden).toBe(true);
    expect(count(root).textContent).toBe("1 of 2 entries");
    expect(empty(root).hidden).toBe(true);
  });

  test("picks one kind, then shows every kind when clicked again", () => {
    const root = setup();
    initReferenceFilter(root, controller.signal);
    const button = kindButton(root, "value");

    click(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(card(root, "when").hidden).toBe(false);
    expect(card(root, "variable").hidden).toBe(true);
    expect(group(root, "function").hidden).toBe(true);
    expect(count(root).textContent).toBe("1 of 2 entries");

    click(button);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(card(root, "when").hidden).toBe(false);
    expect(card(root, "variable").hidden).toBe(false);
    expect(count(root).textContent).toBe("2 entries");
  });

  test("clears the text and the picked kinds", () => {
    const root = setup();
    initReferenceFilter(root, controller.signal);
    typeFilter(root, "attach");
    click(kindButton(root, "value"));
    const button = kindButton(root, "value");

    click(root.querySelector<HTMLElement>("[data-ref-clear]")!);

    expect(input(root).value).toBe("");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(card(root, "variable").hidden).toBe(false);
    expect(card(root, "when").hidden).toBe(false);
    expect(count(root).textContent).toBe("2 entries");
  });

  test("shows the empty state only when cards exist and none match", () => {
    const root = setup();
    initReferenceFilter(root, controller.signal);
    typeFilter(root, "nothing matches this");

    expect(card(root, "variable").hidden).toBe(true);
    expect(card(root, "when").hidden).toBe(true);
    expect(empty(root).hidden).toBe(false);
    expect(count(root).textContent).toBe("0 of 2 entries");

    typeFilter(root, "");
    expect(empty(root).hidden).toBe(true);
  });

  test("leaves the groups visible and the empty state hidden until cards mount", () => {
    const root = setup([]);
    initReferenceFilter(root, controller.signal);

    expect(empty(root).hidden).toBe(true);
    expect(group(root, "function").hidden).toBe(false);
    expect(indexGroup(root, "function").hidden).toBe(false);
    expect(count(root).textContent).toBe("");
  });
});

function setup(cards: CardSpec[] = CARDS): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = `
    <aside id="sidebar">
      <div class="nav-group" data-index-group="function">
        <a href="/reference#variable" data-ref-link="variable">variable()</a>
      </div>
      <div class="nav-group" data-index-group="value">
        <a href="/reference#when" data-ref-link="when">WHEN</a>
      </div>
      <div class="nav-group" data-index-group="markup">
        <a href="/reference#each" data-ref-link="each">EACH</a>
      </div>
    </aside>
    <label><input id="ref-filter" type="search" /></label>
    <button type="button" data-ref-kind="function" aria-pressed="false">function</button>
    <button type="button" data-ref-kind="value" aria-pressed="false">value</button>
    <p data-ref-count></p>
    <div data-ref-empty hidden>
      <p>Nothing matches your filter.</p>
      <button type="button" data-ref-clear>Clear filters</button>
    </div>
    <section data-ref-group="function"></section>
    <section data-ref-group="value"></section>
    <section data-ref-group="markup"></section>
  `;
  for (const spec of cards) {
    root.querySelector(`[data-ref-group="${spec.group}"]`)!.append(cardElement(spec));
  }
  document.body.append(root);
  return root;
}

function appendCard(root: HTMLElement, spec: CardSpec): void {
  const link = document.createElement("a");
  link.href = `/reference#${spec.id}`;
  link.dataset.refLink = spec.id;
  root.querySelector(`[data-index-group="${spec.group}"]`)!.append(link);
  root.querySelector(`[data-ref-group="${spec.group}"]`)!.append(cardElement(spec));
}

function cardElement(spec: CardSpec): HTMLElement {
  const article = document.createElement("article");
  article.id = spec.id;
  article.dataset.refEntry = "";
  article.dataset.kind = spec.kind;
  article.dataset.group = spec.group;
  article.dataset.search = spec.search;
  return article;
}

function input(root: HTMLElement): HTMLInputElement {
  return root.querySelector<HTMLInputElement>("#ref-filter")!;
}

function kindButton(root: HTMLElement, kind: string): HTMLButtonElement {
  return root.querySelector<HTMLButtonElement>(`[data-ref-kind="${kind}"]`)!;
}

function count(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>("[data-ref-count]")!;
}

function empty(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>("[data-ref-empty]")!;
}

function card(root: HTMLElement, id: string): HTMLElement {
  return root.querySelector<HTMLElement>(`[data-ref-entry]#${id}`)!;
}

function link(root: HTMLElement, id: string): HTMLElement {
  return root.querySelector<HTMLElement>(`[data-ref-link="${id}"]`)!;
}

function group(root: HTMLElement, kind: string): HTMLElement {
  return root.querySelector<HTMLElement>(`[data-ref-group="${kind}"]`)!;
}

function indexGroup(root: HTMLElement, kind: string): HTMLElement {
  return root.querySelector<HTMLElement>(`[data-index-group="${kind}"]`)!;
}

function typeFilter(root: HTMLElement, value: string): void {
  const field = input(root);
  field.value = value;
  field.dispatchEvent(new Event("input"));
}

function click(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

// The filter waits one animation frame before it re-reads the cards.
function nextFrame(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 50));
}
