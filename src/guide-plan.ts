import type { ApiGroup } from "lusiajs/api";

// A named sub-group inside a group. Its entries are api ids, in learning order.
export interface GuideSubgroup {
  id: string;
  label: string;
  entries: string[];
}

// A group of the Guide, in learning order. Entries that sit directly in the group come first, then the sub-groups.
export interface GuideGroup {
  group: ApiGroup;
  label: string;
  icon: string;
  color: string;
  entries?: string[];
  subgroups?: GuideSubgroup[];
}

// The Guide's learning path. Reference types come last in the group they belong to. The Guide leaves them out.
export const guidePlan: GuideGroup[] = [
  {
    group: "basics",
    label: "Start",
    icon: "school",
    color: "var(--pink)",
    entries: ["start-project", "script", "expr"],
  },
  {
    group: "reactivity",
    label: "Variables",
    icon: "bolt",
    color: "var(--lavender)",
    entries: [
      "variable",
      "variable-compute",
      "variable-auto-run",
      "variable-watch",
      "variable-instance-on-update",
      "variable-type",
      "computed-variable-type",
    ],
  },
  {
    group: "events",
    label: "Events and input",
    icon: "ads_click",
    color: "var(--rose)",
    entries: ["event", "bind-value", "bind-prop", "bind-element"],
  },
  {
    group: "flow",
    label: "Flow",
    icon: "alt_route",
    color: "var(--lemon)",
    entries: ["if", "elseif", "else", "each", "for"],
  },
  {
    group: "components",
    label: "Components",
    icon: "widgets",
    color: "var(--mint)",
    entries: [
      "component-tag",
      "props",
      "content",
      "attach",
      "detach",
      "on-attach",
      "on-detach",
      "fallback",
      "nolazy",
      "recursive-components",
      "html",
      "component",
      "instance",
      "props-type",
    ],
  },
  {
    group: "styling",
    label: "Styling",
    icon: "palette",
    color: "var(--sky)",
    entries: ["style", "style-scoped", "style-global", "scoped", "global", "inline-global"],
  },
  {
    group: "motion",
    label: "Motion",
    icon: "animation",
    color: "var(--peach)",
    subgroups: [
      {
        id: "first-animation",
        label: "First animation",
        entries: ["animate", "animate-type", "animate-more"],
      },
      {
        id: "timing",
        label: "Timing and easing",
        entries: ["ease", "preset", "set-animate-default", "keyframes-type", "animate-item"],
      },
      {
        id: "configuration",
        label: "Configuration",
        entries: ["config"],
      },
      {
        id: "triggers",
        label: "Triggers",
        entries: ["when", "hover-area", "controller", "animate-space"],
      },
      {
        id: "scroll",
        label: "Scroll",
        entries: ["scroll-at", "edge"],
      },
      {
        id: "layout",
        label: "Layout",
        entries: ["layout"],
      },
      {
        id: "advanced",
        label: "Advanced",
        entries: ["midway", "turn", "interpolate"],
      },
    ],
  },
];
