import Prism from "./prism.ts";

// Prism grammars are plain nested objects, so they are read through one loose type.
const grammars = Prism.languages as Record<string, any>;

const FLOW_TAGS = "IF|ELSEIF|ELSE|EACH|FOR|CONTENT|HTML|FALLBACK|NO_LAZY|NO_SSR";

// A tag runs to its `>`. A `{...}` inside it may hold one level of nested braces.
const TAG_BODY = String.raw`(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*`;

export const expression = {
  pattern: /\{(?:[^{}]|\{[^{}]*\})*\}/,
  inside: {
    punctuation: /^\{|\}$/,
    rest: grammars.typescript,
  },
};

// `={expr}` on an attribute. The `=` is part of the punctuation.
const attrExpression = {
  pattern: /=\s*\{(?:[^{}]|\{[^{}]*\})*\}/,
  inside: {
    punctuation: /^=\s*\{|\}$/,
    rest: grammars.typescript,
  },
};

function attributes(): Record<string, unknown> {
  return {
    "event-attr": {
      pattern: /(?<=\s)on(?::[a-z][\w-]*|[a-z]+)(?=\s*=\s*\{)/,
      inside: { "event-prefix": /^on:/ },
    },
    "bind-attr": /(?<=\s)bind-[a-z][a-z-]*(?=\s*=\s*\{)/,
    "animate-attr": /(?<=\s)animate(?=\s*(?:=|\/?>|\s|$))/,
    "flow-attr": /(?<=\s)(?:as|index|key|from|to|step)(?=\s*=)/,
    attrExpression,
    expression,
    "attr-value": { pattern: /"[^"]*"|'[^']*'/, greedy: true },
    "attr-name": /[\w:-]+/,
  };
}

// The name token comes first, so the attribute patterns never read it.
function tagInside(nameType: string, namePattern: RegExp): Record<string, unknown> {
  return {
    [nameType]: namePattern,
    punctuation: /^<\/?|\/?>$/,
    ...attributes(),
  };
}

export const flowTag = {
  pattern: new RegExp(`<\\/?(?:${FLOW_TAGS})(?=[\\s/>])${TAG_BODY}>`),
  greedy: true,
  inside: tagInside("flow-name", /(?<=^<\/?)[A-Z_]+/),
};

export const componentTag = {
  pattern: new RegExp(`<\\/?(?!(?:${FLOW_TAGS})(?=[\\s/>]))[A-Z]${TAG_BODY}>`),
  greedy: true,
  inside: tagInside("component-name", /(?<=^<\/?)[A-Z][\w]*/),
};

export const htmlTag = {
  pattern: new RegExp(`<\\/?[a-z][\\w-]*${TAG_BODY}>`),
  greedy: true,
  inside: tagInside("tag", /(?<=^<\/?)[a-z][\w-]*/),
};
