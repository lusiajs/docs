import { findComponentImport } from "./imports.ts";
import { parsePropDefs, type PropDef } from "./props.ts";

export interface EditorFile {
  name: string;
  code: string;
}

/** A place to move the cursor to. Line and column start at 1. */
export interface EditorJump {
  file: string;
  line: number;
  column: number;
}

/** The file that an import specifier in `fromName` points at, such as "../ui/Badge.lusia". */
export function findImportedFile(
  files: readonly EditorFile[],
  fromName: string,
  specifier: string,
): EditorFile | undefined {
  const wanted = resolveName(fromName, specifier);
  return files.find((file) => file.name === wanted);
}

/** Joins a specifier onto the folder of `fromName`, resolving "." and "..". */
export function resolveName(fromName: string, specifier: string): string {
  const parts = fromName.split("/").slice(0, -1);
  for (const part of specifier.split("/")) {
    if (part === "..") parts.pop();
    else if (part !== "." && part !== "") parts.push(part);
  }
  return parts.join("/");
}

/** The props of an imported component, read from the editor's files. Undefined when not found. */
export function childProps(
  files: readonly EditorFile[],
  fromName: string,
  text: string,
  componentName: string,
): PropDef[] | undefined {
  const found = findComponentImport(text, componentName);
  if (!found) return undefined;
  const target = findImportedFile(files, fromName, found.specifier);
  return target ? parsePropDefs(target.code) : undefined;
}
