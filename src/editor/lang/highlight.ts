import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// The colours are the site's theme tokens, so light and dark mode follow the page.
export const lusiaHighlight = HighlightStyle.define([
  {
    tag: [t.keyword, t.operatorKeyword, t.modifier],
    color: "var(--tok-keyword)",
  },
  {
    tag: [t.string, t.special(t.string), t.regexp],
    color: "var(--tok-string)",
  },
  { tag: [t.number, t.bool, t.null, t.atom], color: "var(--tok-number)" },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: "var(--tok-function)",
  },
  { tag: t.tagName, color: "var(--tok-tag)" },
  { tag: [t.attributeName, t.propertyName], color: "var(--tok-attr)" },
  { tag: [t.className, t.typeName], color: "var(--tok-component)" },
  {
    tag: [t.punctuation, t.bracket, t.operator, t.separator, t.meta],
    color: "var(--tok-punct)",
  },
  {
    tag: [t.comment, t.lineComment, t.blockComment],
    color: "var(--tok-comment)",
    fontStyle: "italic",
  },
]);

export const lusiaHighlighting = syntaxHighlighting(lusiaHighlight);
