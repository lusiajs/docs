import { scriptItems, type CompletionItemData, type ScriptItem } from "./completion-data.ts";
import { completionsAt, type CompletionResult } from "./completions.ts";
import { childProps, type EditorFile } from "./files.ts";
import { planLuciaImport } from "./auto-import.ts";
import { expressionEnd } from "./format-expressions.ts";
import { localItems, receiverAt, variableMemberItems, variableNames } from "./locals.ts";
import { regionAt } from "./regions.ts";
import { scriptSection } from "./sections.ts";

/** Everything the editor offers at `offset`: API names, markup items, file names, variable members. */
export function editorCompletions(
  text: string,
  offset: number,
  fileName: string,
  files: readonly EditorFile[],
): CompletionResult[] {
  if (fileName.endsWith(".ts")) return typescriptCompletions(text, offset);
  const script = scriptText(text);
  if (isVariableMember(script, text, offset)) return variableMemberItems();
  const base = completionsAt(text, offset, (component) => {
    return childProps(files, fileName, text, component) ?? [];
  });
  return [...base, ...localResults(text, offset, script, base)];
}

/** A .ts file is all script: API names with their imports, and the names in the file. */
function typescriptCompletions(text: string, offset: number): CompletionResult[] {
  if (isVariableMember(text, text, offset)) return variableMemberItems();
  const base = scriptItems().map((item) => withImportEdit(item, text));
  return [...base, ...localItems(text, takenLabels(base))];
}

function isVariableMember(script: string, text: string, offset: number): boolean {
  const receiver = receiverAt(text, offset);
  return receiver !== undefined && variableNames(script).has(receiver);
}

/** Names of this file, offered in script and in `{...}` expressions. */
function localResults(
  text: string,
  offset: number,
  script: string,
  base: readonly CompletionItemData[],
): CompletionItemData[] {
  if (!inCode(text, offset)) return [];
  return localItems(script, takenLabels(base));
}

function takenLabels(items: readonly CompletionItemData[]): Set<string> {
  return new Set(items.map((item) => item.label));
}

function inCode(text: string, offset: number): boolean {
  return regionAt(text, offset).kind === "script" || inExpression(text, offset);
}

function inExpression(text: string, offset: number): boolean {
  if (offset <= 0) return false;
  const open = text.lastIndexOf("{", offset - 1);
  if (open === -1) return false;
  const end = expressionEnd(text, open);
  return end === -1 || end >= offset;
}

function scriptText(text: string): string {
  const section = scriptSection(text);
  return section ? text.slice(section.contentStart, section.contentEnd) : "";
}

function withImportEdit(item: ScriptItem, text: string): CompletionResult {
  const { importName, ...data } = item;
  const edit = importName ? planLuciaImport(text, importName) : undefined;
  return edit ? { ...data, importEdit: edit } : data;
}
