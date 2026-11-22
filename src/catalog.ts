import type { Component } from "lusiajs";
import IntroFlow from "./demos/guide/IntroFlow.lusia";
import introFlowSource from "./demos/guide/IntroFlow.lusia?raw";
import introFlowDataSource from "./demos/guide/intro-flow.ts?raw";
import ProjectTree from "./demos/guide/ProjectTree.lusia";
import projectTreeSource from "./demos/guide/ProjectTree.lusia?raw";
import ReactivityFlow from "./demos/guide/ReactivityFlow.lusia";
import reactivityFlowSource from "./demos/guide/ReactivityFlow.lusia?raw";
import reactivityFlowDataSource from "./demos/guide/reactivity-flow.ts?raw";
import EventsFlow from "./demos/guide/EventsFlow.lusia";
import eventsFlowSource from "./demos/guide/EventsFlow.lusia?raw";
import eventsFlowDataSource from "./demos/guide/events-flow.ts?raw";
import ConditionFlow from "./demos/guide/ConditionFlow.lusia";
import conditionFlowSource from "./demos/guide/ConditionFlow.lusia?raw";
import conditionFlowDataSource from "./demos/guide/condition-flow.ts?raw";
import ComponentsFlow from "./demos/guide/ComponentsFlow.lusia";
import componentsFlowSource from "./demos/guide/ComponentsFlow.lusia?raw";
import componentsFlowDataSource from "./demos/guide/components-flow.ts?raw";
import guideCardSource from "./demos/guide/Card.lusia?raw";
import StylingFlow from "./demos/guide/StylingFlow.lusia";
import stylingFlowSource from "./demos/guide/StylingFlow.lusia?raw";
import stylingFlowDataSource from "./demos/guide/styling-flow.ts?raw";
import MotionFlow from "./demos/guide/MotionFlow.lusia";
import motionFlowSource from "./demos/guide/MotionFlow.lusia?raw";
import motionFlowDataSource from "./demos/guide/motion-flow.ts?raw";
import domFlowSource from "./components/guide/DomFlow.lusia?raw";
import domNodeSource from "./components/guide/DomNode.lusia?raw";
import { templateFiles } from "./demos/guide/project-files.ts";
import projectFilesSource from "./demos/guide/project-files.ts?raw";
import ScriptBlock from "./demos/basics/ScriptBlock.lusia";
import scriptBlockSource from "./demos/basics/ScriptBlock.lusia?raw";
import Compute from "./demos/reactivity/Compute.lusia";
import computeSource from "./demos/reactivity/Compute.lusia?raw";
import BindProp from "./demos/events/BindProp.lusia";
import bindPropSource from "./demos/events/BindProp.lusia?raw";
import OnName from "./demos/events/OnName.lusia";
import onNameSource from "./demos/events/OnName.lusia?raw";
import Listen from "./demos/events/Listen.lusia";
import listenSource from "./demos/events/Listen.lusia?raw";
import ClickOutside from "./demos/events/ClickOutside.lusia";
import clickOutsideSource from "./demos/events/ClickOutside.lusia?raw";
import KeepRunning from "./demos/events/KeepRunning.lusia";
import keepRunningSource from "./demos/events/KeepRunning.lusia?raw";
import ElseifDemo from "./demos/flow/ElseifDemo.lusia";
import elseifDemoSource from "./demos/flow/ElseifDemo.lusia?raw";
import ElseDemo from "./demos/flow/ElseDemo.lusia";
import elseDemoSource from "./demos/flow/ElseDemo.lusia?raw";
import DetachDemo from "./demos/components/DetachDemo.lusia";
import detachDemoSource from "./demos/components/DetachDemo.lusia?raw";
import NolazyDemo from "./demos/components/NolazyDemo.lusia";
import nolazyDemoSource from "./demos/components/NolazyDemo.lusia?raw";
import NolazyBadge from "./demos/components/NolazyBadge.lusia";
import nolazyBadgeSource from "./demos/components/NolazyBadge.lusia?raw";
import MoodHappy from "./demos/components/MoodHappy.lusia";
import moodHappySource from "./demos/components/MoodHappy.lusia?raw";
import ScopedRules from "./demos/styling/ScopedRules.lusia";
import scopedRulesSource from "./demos/styling/ScopedRules.lusia?raw";
import ScopedChild from "./demos/styling/ScopedChild.lusia";
import scopedChildSource from "./demos/styling/ScopedChild.lusia?raw";
import GlobalBlock from "./demos/styling/GlobalBlock.lusia";
import globalBlockSource from "./demos/styling/GlobalBlock.lusia?raw";
import InlineGlobal from "./demos/styling/InlineGlobal.lusia";
import inlineGlobalSource from "./demos/styling/InlineGlobal.lusia?raw";
import ScreenSizes from "./demos/styling/ScreenSizes.lusia";
import screenSizesSource from "./demos/styling/ScreenSizes.lusia?raw";
import SetConfigDemo from "./demos/motion/SetConfigDemo.lusia";
import setConfigDemoSource from "./demos/motion/SetConfigDemo.lusia?raw";
import HoverArea from "./demos/motion/HoverArea.lusia";
import hoverAreaSource from "./demos/motion/HoverArea.lusia?raw";
import Turn from "./demos/motion/Turn.lusia";
import turnSource from "./demos/motion/Turn.lusia?raw";
import Interpolate from "./demos/motion/Interpolate.lusia";
import interpolateSource from "./demos/motion/Interpolate.lusia?raw";
import ConfigDemo from "./demos/motion/ConfigDemo.lusia";
import configDemoSource from "./demos/motion/ConfigDemo.lusia?raw";
import Attributes from "./demos/basics/Attributes.lusia";
import attributesSource from "./demos/basics/Attributes.lusia?raw";
import BindElement from "./demos/basics/BindElement.lusia";
import bindElementSource from "./demos/basics/BindElement.lusia?raw";
import BindFields from "./demos/basics/BindFields.lusia";
import bindFieldsSource from "./demos/basics/BindFields.lusia?raw";
import Events from "./demos/basics/Events.lusia";
import eventsSource from "./demos/basics/Events.lusia?raw";
import Markdown from "./demos/basics/Markdown.lusia";
import markdownSource from "./demos/basics/Markdown.lusia?raw";
import OnAttach from "./demos/basics/OnAttach.lusia";
import onAttachSource from "./demos/basics/OnAttach.lusia?raw";
import Text from "./demos/basics/Text.lusia";
import textSource from "./demos/basics/Text.lusia?raw";
import Attach from "./demos/components/Attach.lusia";
import attachSource from "./demos/components/Attach.lusia?raw";
import Lifecycle from "./demos/components/Lifecycle.lusia";
import lifecycleSource from "./demos/components/Lifecycle.lusia?raw";
import lifecycleBoxSource from "./demos/components/LifecycleBox.lusia?raw";
import lifecycleCountSource from "./demos/components/lifecycle-count.ts?raw";
import detachBoxSource from "./demos/components/DetachBox.lusia?raw";
import OnDetach from "./demos/components/OnDetach.lusia";
import onDetachSource from "./demos/components/OnDetach.lusia?raw";
import BindChild from "./demos/components/BindChild.lusia";
import bindChildSource from "./demos/components/BindChild.lusia?raw";
import cardSource from "./demos/components/Card.lusia?raw";
import Children from "./demos/components/Children.lusia";
import childrenSource from "./demos/components/Children.lusia?raw";
import attachChipSource from "./demos/components/Chip.lusia?raw";
import commentSource from "./demos/components/Comment.lusia?raw";
import CommentThread from "./demos/components/CommentThread.lusia";
import commentThreadSource from "./demos/components/CommentThread.lusia?raw";
import Components from "./demos/components/Components.lusia";
import componentsSource from "./demos/components/Components.lusia?raw";
import fieldSource from "./demos/components/Field.lusia?raw";
import FileTree from "./demos/components/FileTree.lusia";
import fileTreeSource from "./demos/components/FileTree.lusia?raw";
import folderSource from "./demos/components/Folder.lusia?raw";
import lazyChartSource from "./demos/components/LazyChart.lusia?raw";
import LazyDemo from "./demos/components/LazyDemo.lusia";
import lazyDemoSource from "./demos/components/LazyDemo.lusia?raw";
import Props from "./demos/components/Props.lusia";
import propsSource from "./demos/components/Props.lusia?raw";
import badgeSource from "./demos/components/badge.lusia?raw";
import EachDemo from "./demos/flow/EachDemo.lusia";
import eachSource from "./demos/flow/EachDemo.lusia?raw";
import ForDemo from "./demos/flow/ForDemo.lusia";
import forSource from "./demos/flow/ForDemo.lusia?raw";
import IfDemo from "./demos/flow/IfDemo.lusia";
import ifSource from "./demos/flow/IfDemo.lusia?raw";
import lusiaConfigSource from "./config-files/lusia.config.ts?raw";
import lusiaConfigJsonSource from "./config-files/lusia.config.json?raw";
import AttachList from "./demos/motion/AttachList.lusia";
import attachListSource from "./demos/motion/AttachList.lusia?raw";
import Both from "./demos/motion/Both.lusia";
import bothSource from "./demos/motion/Both.lusia?raw";
import boxSource from "./demos/motion/Box.lusia?raw";
import Control from "./demos/motion/Control.lusia";
import controlSource from "./demos/motion/Control.lusia?raw";
import Easing from "./demos/motion/Easing.lusia";
import easingSource from "./demos/motion/Easing.lusia?raw";
import Enter from "./demos/motion/Enter.lusia";
import enterSource from "./demos/motion/Enter.lusia?raw";
import FollowScroll from "./demos/motion/FollowScroll.lusia";
import followScrollSource from "./demos/motion/FollowScroll.lusia?raw";
import HoverDelay from "./demos/motion/HoverDelay.lusia";
import hoverDelaySource from "./demos/motion/HoverDelay.lusia?raw";
import HoverInOut from "./demos/motion/HoverInOut.lusia";
import hoverInOutSource from "./demos/motion/HoverInOut.lusia?raw";
import KeyframeDefault from "./demos/motion/KeyframeDefault.lusia";
import keyframeDefaultSource from "./demos/motion/KeyframeDefault.lusia?raw";
import Keys from "./demos/motion/Keys.lusia";
import keysSource from "./demos/motion/Keys.lusia?raw";
import LayoutCard from "./demos/motion/LayoutCard.lusia";
import layoutCardSource from "./demos/motion/LayoutCard.lusia?raw";
import LayoutCorners from "./demos/motion/LayoutCorners.lusia";
import layoutCornersSource from "./demos/motion/LayoutCorners.lusia?raw";
import LayoutList from "./demos/motion/LayoutList.lusia";
import layoutListSource from "./demos/motion/LayoutList.lusia?raw";
import Leave from "./demos/motion/Leave.lusia";
import leaveSource from "./demos/motion/Leave.lusia?raw";
import LeaveList from "./demos/motion/LeaveList.lusia";
import leaveListSource from "./demos/motion/LeaveList.lusia?raw";
import Loops from "./demos/motion/Loops.lusia";
import loopsSource from "./demos/motion/Loops.lusia?raw";
import MidwayMode from "./demos/motion/MidwayMode.lusia";
import midwayModeSource from "./demos/motion/MidwayMode.lusia?raw";
import PinnedScroll from "./demos/motion/PinnedScroll.lusia";
import pinnedScrollSource from "./demos/motion/PinnedScroll.lusia?raw";
import popSource from "./demos/motion/Pop.lusia?raw";
import Presets from "./demos/motion/Presets.lusia";
import presetsSource from "./demos/motion/Presets.lusia?raw";
import Reveal from "./demos/motion/Reveal.lusia";
import revealSource from "./demos/motion/Reveal.lusia?raw";
import ScrollCenterLeave from "./demos/motion/ScrollCenterLeave.lusia";
import scrollCenterLeaveSource from "./demos/motion/ScrollCenterLeave.lusia?raw";
import ScrollDefault from "./demos/motion/ScrollDefault.lusia";
import scrollDefaultSource from "./demos/motion/ScrollDefault.lusia?raw";
import ScrollEffects from "./demos/motion/ScrollEffects.lusia";
import scrollEffectsSource from "./demos/motion/ScrollEffects.lusia?raw";
import ScrollEnterCenter from "./demos/motion/ScrollEnterCenter.lusia";
import scrollEnterCenterSource from "./demos/motion/ScrollEnterCenter.lusia?raw";
import ScrollLines from "./demos/motion/ScrollLines.lusia";
import scrollLinesSource from "./demos/motion/ScrollLines.lusia?raw";
import ScrollPartFollow from "./demos/motion/ScrollPartFollow.lusia";
import scrollPartFollowSource from "./demos/motion/ScrollPartFollow.lusia?raw";
import ScrollPresets from "./demos/motion/ScrollPresets.lusia";
import scrollPresetsSource from "./demos/motion/ScrollPresets.lusia?raw";
import ScrollTouchPoints from "./demos/motion/ScrollTouchPoints.lusia";
import scrollTouchPointsSource from "./demos/motion/ScrollTouchPoints.lusia?raw";
import ScrollTwo from "./demos/motion/ScrollTwo.lusia";
import scrollTwoSource from "./demos/motion/ScrollTwo.lusia?raw";
import shrinkSource from "./demos/motion/Shrink.lusia?raw";
import SpinAway from "./demos/motion/SpinAway.lusia";
import spinAwaySource from "./demos/motion/SpinAway.lusia?raw";
import VariableTrigger from "./demos/motion/VariableTrigger.lusia";
import variableTriggerSource from "./demos/motion/VariableTrigger.lusia?raw";
import scrollReadoutSource from "./demos/motion/scroll-readout.ts?raw";
import AutoRun from "./demos/reactivity/AutoRun.lusia";
import autoRunSource from "./demos/reactivity/AutoRun.lusia?raw";
import Batch from "./demos/reactivity/Batch.lusia";
import batchSource from "./demos/reactivity/Batch.lusia?raw";
import SharedReader from "./demos/reactivity/SharedReader.lusia";
import sharedReaderSource from "./demos/reactivity/SharedReader.lusia?raw";
import SharedWriter from "./demos/reactivity/SharedWriter.lusia";
import sharedWriterSource from "./demos/reactivity/SharedWriter.lusia?raw";
import UpdateBefore from "./demos/reactivity/UpdateBefore.lusia";
import updateBeforeSource from "./demos/reactivity/UpdateBefore.lusia?raw";
import Variable from "./demos/reactivity/Variable.lusia";
import variableDemoSource from "./demos/reactivity/Variable.lusia?raw";
import Watch from "./demos/reactivity/Watch.lusia";
import watchSource from "./demos/reactivity/Watch.lusia?raw";
import GlobalStyles from "./demos/styling/GlobalStyles.lusia";
import globalStylesSource from "./demos/styling/GlobalStyles.lusia?raw";
import Scss from "./demos/styling/Scss.lusia";
import scssSource from "./demos/styling/Scss.lusia?raw";
import styleChildSource from "./demos/styling/StyleChild.lusia?raw";
import StyleParent from "./demos/styling/StyleParent.lusia";
import styleParentSource from "./demos/styling/StyleParent.lusia?raw";
import themeSource from "./styles/_theme.scss?raw";
import variableSource from "./variable.ts?raw";

// A source file shown in a code panel. The text is imported at build time.
export interface SourceFile {
  path: string;
  text: string;
}

// One live demo: its anchor id, its heading and caption, the components mounted into it, and the source files shown beside it.
export interface Demo {
  id: string;
  title: string;
  caption: string;
  components: Component[];
  sources: SourceFile[];
}

// A small table shown under the entry's bullets. Cells are plain text.
export interface CatalogTable {
  head: string[];
  rows: string[][];
}

export interface CatalogEntry {
  icon: string;
  demos?: Demo[];
  table?: CatalogTable;
  files?: SourceFile[];
}

// The DomFlow visuals mount these two files, so each visual lists them.
const domFlowSources: SourceFile[] = [
  { path: "src/components/guide/DomFlow.lusia", text: domFlowSource },
  { path: "src/components/guide/DomNode.lusia", text: domNodeSource },
];

const screensConfigSource = `import { defineConfig } from "lusiajs/config";

export default defineConfig({
  screens: { PHONE: 0, TABLET: 700, DESKTOP: 1200 },
});`;

// Keyed by the api entry id. Entries without a demo show no live card.
export const catalog: Record<string, CatalogEntry> = {
  "reactivity-overview": {
    icon: "bolt",
    demos: [
      {
        id: "reactivity-overview-flow",
        title: "Step by step",
        caption: "A variable is read in the markup. Each click writes it, and only the text changes.",
        components: [ReactivityFlow],
        sources: [
          { path: "src/demos/guide/ReactivityFlow.lusia", text: reactivityFlowSource },
          { path: "src/demos/guide/reactivity-flow.ts", text: reactivityFlowDataSource },
          ...domFlowSources,
        ],
      },
    ],
  },
  "events-overview": {
    icon: "ads_click",
    demos: [
      {
        id: "events-overview-flow",
        title: "Step by step",
        caption: "A click runs swap(). The new name reaches the text that reads it.",
        components: [EventsFlow],
        sources: [
          { path: "src/demos/guide/EventsFlow.lusia", text: eventsFlowSource },
          { path: "src/demos/guide/events-flow.ts", text: eventsFlowDataSource },
          ...domFlowSources,
        ],
      },
    ],
  },
  "flow-overview": {
    icon: "alt_route",
    demos: [
      {
        id: "flow-overview-flow",
        title: "Step by step",
        caption: "IF shows one branch. A click makes the condition true, and the other branch leaves.",
        components: [ConditionFlow],
        sources: [
          { path: "src/demos/guide/ConditionFlow.lusia", text: conditionFlowSource },
          { path: "src/demos/guide/condition-flow.ts", text: conditionFlowDataSource },
          ...domFlowSources,
        ],
      },
    ],
  },
  "components-overview": {
    icon: "widgets",
    demos: [
      {
        id: "components-overview-flow",
        title: "Step by step",
        caption: "Each component tag places one Card in the DOM.",
        components: [ComponentsFlow],
        sources: [
          { path: "src/demos/guide/ComponentsFlow.lusia", text: componentsFlowSource },
          { path: "src/demos/guide/components-flow.ts", text: componentsFlowDataSource },
          { path: "src/demos/guide/Card.lusia", text: guideCardSource },
          ...domFlowSources,
        ],
      },
    ],
  },
  "styling-overview": {
    icon: "palette",
    demos: [
      {
        id: "styling-overview-flow",
        title: "Step by step",
        caption: "The same nodes stay in place. Each style rule changes only the nodes it matches.",
        components: [StylingFlow],
        sources: [
          { path: "src/demos/guide/StylingFlow.lusia", text: stylingFlowSource },
          { path: "src/demos/guide/styling-flow.ts", text: stylingFlowDataSource },
          ...domFlowSources,
        ],
      },
    ],
  },
  "motion-overview": {
    icon: "animation",
    demos: [
      {
        id: "motion-overview-flow",
        title: "Step by step",
        caption: "The p fades in when it attaches, and fades out before it is removed.",
        components: [MotionFlow],
        sources: [
          { path: "src/demos/guide/MotionFlow.lusia", text: motionFlowSource },
          { path: "src/demos/guide/motion-flow.ts", text: motionFlowDataSource },
          ...domFlowSources,
        ],
      },
    ],
  },
  "lusia-intro": {
    icon: "info",
    demos: [
      {
        id: "intro-flow",
        title: "From file to DOM",
        caption: "Lusia compiles the file. Its markup becomes DOM nodes, and a click changes only the text.",
        components: [IntroFlow],
        sources: [
          { path: "src/demos/guide/IntroFlow.lusia", text: introFlowSource },
          { path: "src/demos/guide/intro-flow.ts", text: introFlowDataSource },
          ...domFlowSources,
        ],
      },
    ],
    table: {
      head: ["Section", "What it holds"],
      rows: [
        ["<script>", "TypeScript: imports, variables, functions and props"],
        ["Markup", "HTML with {expr}, events, IF, EACH and components"],
        ["<style>", "CSS for this component"],
      ],
    },
  },
  "start-project": {
    icon: "rocket_launch",
    demos: [
      {
        id: "start-project-tree",
        title: "Files after bun create",
        caption: "The files the CLI writes for a new app. Press Create again to watch them appear, and click a file to read it.",
        components: [ProjectTree],
        sources: [
          { path: "src/demos/guide/ProjectTree.lusia", text: projectTreeSource },
          { path: "src/demos/guide/project-files.ts", text: projectFilesSource },
          ...templateFiles.map((file) => ({ path: "my-app/" + file.path, text: file.text })),
        ],
      },
    ],
  },
  expr: {
    icon: "text_fields",
    demos: [
      {
        id: "expr-text",
        title: "Text",
        caption: "Curly braces put a variable or an expression into the text.",
        components: [Text],
        sources: [
          {
            path: "src/demos/basics/Text.lusia",
            text: textSource,
          },
        ],
      },
      {
        id: "expr-attributes",
        title: "Attributes",
        caption: "An attribute takes a value too. A null value removes it.",
        components: [Attributes],
        sources: [
          {
            path: "src/demos/basics/Attributes.lusia",
            text: attributesSource,
          },
        ],
      },
    ],
  },
  variable: {
    icon: "data_object",
    demos: [
      {
        id: "variable-derived",
        title: "Derived variable",
        caption: "A derived variable updates when the variables it reads update.",
        components: [Variable],
        sources: [
          {
            path: "src/demos/reactivity/Variable.lusia",
            text: variableDemoSource,
          },
        ],
      },
      {
        id: "variable-batch",
        title: "Batch",
        caption: "Several writes in one handler update the page once per click.",
        components: [Batch],
        sources: [
          {
            path: "src/demos/reactivity/Batch.lusia",
            text: batchSource,
          },
        ],
      },
      {
        id: "variable-shared",
        title: "Shared variable",
        caption: "One component writes a variable in variable.ts, and another reads it.",
        components: [SharedWriter, SharedReader],
        sources: [
          { path: "src/variable.ts", text: variableSource },
          {
            path: "src/demos/reactivity/SharedWriter.lusia",
            text: sharedWriterSource,
          },
          {
            path: "src/demos/reactivity/SharedReader.lusia",
            text: sharedReaderSource,
          },
        ],
      },
    ],
  },
  "variable-compute": {
    icon: "calculate",
    demos: [
      {
        id: "variable-compute-total",
        title: "Computed total",
        caption: "total is worked out from price and quantity. It updates when either one changes.",
        components: [Compute],
        sources: [{ path: "src/demos/reactivity/Compute.lusia", text: computeSource }],
      },
    ],
  },
  "variable-auto-run": {
    icon: "sync",
    table: {
      head: ["Form", "Finds what it reads", "Gets the values", "Use it when"],
      rows: [
        [
          "variable.autoRun(fn)",
          "Yes, on every run",
          "You read them inside fn",
          "The list of reads may change",
        ],
        [
          "variable.watch([a, b], fn)",
          "No, you list them",
          "You read them inside fn",
          "You know the exact list",
        ],
        [
          "count.onUpdate((now, before) => ...)",
          "One variable only",
          "now and before are passed in",
          "You need the old value of one variable",
        ],
      ],
    },
    demos: [
      {
        id: "variable-auto-run-peek",
        title: "Peek",
        caption: "peek() reads a variable without subscribing to it.",
        components: [AutoRun],
        sources: [
          {
            path: "src/demos/reactivity/AutoRun.lusia",
            text: autoRunSource,
          },
        ],
      },
    ],
  },
  "variable-watch": {
    icon: "visibility",
    demos: [
      {
        id: "variable-watch-listed",
        title: "Watch",
        caption: "variable.watch runs only when a listed variable updates.",
        components: [Watch],
        sources: [
          {
            path: "src/demos/reactivity/Watch.lusia",
            text: watchSource,
          },
        ],
      },
    ],
  },
  "variable-instance-on-update": {
    icon: "sync_alt",
    demos: [
      {
        id: "variable-instance-on-update-before",
        title: "Before and now",
        caption:
          "count.onUpdate gets the new and the old value. get() and set() read and write it.",
        components: [UpdateBefore],
        sources: [
          {
            path: "src/demos/reactivity/UpdateBefore.lusia",
            text: updateBeforeSource,
          },
        ],
      },
    ],
  },
  props: {
    icon: "input",
    demos: [
      {
        id: "props-tone",
        title: "Props",
        caption: "Pass values to a child as attributes. Each prop is a variable.",
        components: [Props],
        sources: [
          {
            path: "src/demos/components/Props.lusia",
            text: propsSource,
          },
          {
            path: "src/demos/components/badge.lusia",
            text: badgeSource,
          },
        ],
      },
    ],
  },
  fallback: {
    icon: "hourglass_top",
    demos: [
      {
        id: "lazy-chart",
        title: "Lazy component",
        caption: "The chart loads the first time it is shown. Its FALLBACK shows until it arrives.",
        components: [LazyDemo],
        sources: [
          {
            path: "src/demos/components/LazyDemo.lusia",
            text: lazyDemoSource,
          },
          {
            path: "src/demos/components/LazyChart.lusia",
            text: lazyChartSource,
          },
        ],
      },
    ],
  },
  lifecycle: {
    icon: "sync",
    table: {
      head: ["Step", "Who calls it", "When it runs", "Use it for"],
      rows: [
        ["attach()", "Your code", "Places the component on the page", "Mount a component by hand"],
        ["onAttach()", "The component", "After it is placed", "Listeners, timers, data loading"],
        ["onAttach() return", "Lusia", "When it is detached", "Undo what onAttach set up"],
        ["detach()", "Your code", "Plays the OUT animation, then removes it", "Unmount a component"],
        ["onDetach()", "The component", "When it leaves the page", "Final cleanup or counting"],
      ],
    },
    demos: [
      {
        id: "lifecycle-mount",
        title: "Mount and unmount",
        caption: "Mount places the box and runs onAttach. Unmount plays its OUT animation, then runs onDetach.",
        components: [Lifecycle],
        sources: [
          {
            path: "src/demos/components/Lifecycle.lusia",
            text: lifecycleSource,
          },
          {
            path: "src/demos/components/LifecycleBox.lusia",
            text: lifecycleBoxSource,
          },
          {
            path: "src/demos/components/lifecycle-count.ts",
            text: lifecycleCountSource,
          },
        ],
      },
    ],
  },
  attach: {
    icon: "link",
    demos: [
      {
        id: "attach-chip",
        title: "Attach by hand",
        caption: "Attach a component to any element, then detach it later.",
        components: [Attach],
        sources: [
          {
            path: "src/demos/components/Attach.lusia",
            text: attachSource,
          },
          {
            path: "src/demos/components/Chip.lusia",
            text: attachChipSource,
          },
        ],
      },
    ],
  },
  detach: {
    icon: "link_off",
    demos: [
      {
        id: "detach-wait",
        title: "Detach and wait",
        caption: "detach() resolves after the DETACH animation. The status changes only when the box is gone.",
        components: [DetachDemo],
        sources: [
          { path: "src/demos/components/DetachDemo.lusia", text: detachDemoSource },
          { path: "src/demos/components/MoodHappy.lusia", text: moodHappySource },
        ],
      },
    ],
  },
  "on-detach": {
    icon: "link_off",
    demos: [
      {
        id: "on-detach-box",
        title: "onDetach",
        caption: "onDetach(hook) runs when the component is removed from the page.",
        components: [OnDetach],
        sources: [
          {
            path: "src/demos/components/OnDetach.lusia",
            text: onDetachSource,
          },
          {
            path: "src/demos/components/DetachBox.lusia",
            text: detachBoxSource,
          },
        ],
      },
    ],
  },
  "variable-type": { icon: "data_object" },
  "computed-variable-type": { icon: "data_object" },
  component: { icon: "extension" },
  instance: { icon: "memory" },
  "props-type": { icon: "category" },
  script: {
    icon: "terminal",
    demos: [
      {
        id: "script-block",
        title: "Script block",
        caption: "The script holds the imports, the variables and the functions. The markup can call the functions.",
        components: [ScriptBlock],
        sources: [{ path: "src/demos/basics/ScriptBlock.lusia", text: scriptBlockSource }],
      },
    ],
  },
  "component-tag": {
    icon: "widgets",
    demos: [
      {
        id: "component-tag-badge",
        title: "Component tag",
        caption: "Use a child component as a tag. Its props stay reactive.",
        components: [Components],
        sources: [
          {
            path: "src/demos/components/Components.lusia",
            text: componentsSource,
          },
          {
            path: "src/demos/components/badge.lusia",
            text: badgeSource,
          },
        ],
      },
    ],
  },
  "recursive-components": {
    icon: "folder",
    demos: [
      {
        id: "recursive-files",
        title: "File tree",
        caption: "Folder.lusia places itself for each child folder. Click a folder to fold it.",
        components: [FileTree],
        sources: [
          {
            path: "src/demos/components/FileTree.lusia",
            text: fileTreeSource,
          },
          {
            path: "src/demos/components/Folder.lusia",
            text: folderSource,
          },
        ],
      },
      {
        id: "recursive-comments",
        title: "Nested comments",
        caption: "Each reply is a Comment inside a Comment. The depth prop stops it at 3.",
        components: [CommentThread],
        sources: [
          {
            path: "src/demos/components/CommentThread.lusia",
            text: commentThreadSource,
          },
          {
            path: "src/demos/components/Comment.lusia",
            text: commentSource,
          },
        ],
      },
    ],
  },
  html: {
    icon: "code",
    demos: [
      {
        id: "html-markdown",
        title: "Insert HTML",
        caption: "Type text on the left. The preview is HTML from the escaped text.",
        components: [Markdown],
        sources: [
          {
            path: "src/demos/basics/Markdown.lusia",
            text: markdownSource,
          },
        ],
      },
    ],
  },
  content: {
    icon: "view_agenda",
    demos: [
      {
        id: "content-children",
        title: "Children and CONTENT",
        caption: "Markup between a component's tags shows where its CONTENT is.",
        components: [Children],
        sources: [
          {
            path: "src/demos/components/Children.lusia",
            text: childrenSource,
          },
          {
            path: "src/demos/components/Card.lusia",
            text: cardSource,
          },
        ],
      },
    ],
  },
  nolazy: {
    icon: "push_pin",
    demos: [
      {
        id: "nolazy-badge",
        title: "Badge",
        caption: "NOLAZY keeps the badge in the page that imports it. It is never loaded later on its own.",
        components: [NolazyDemo],
        sources: [
          { path: "src/demos/components/NolazyDemo.lusia", text: nolazyDemoSource },
          { path: "src/demos/components/NolazyBadge.lusia", text: nolazyBadgeSource },
        ],
      },
    ],
  },
  "on-attach": {
    icon: "touch_app",
    demos: [
      {
        id: "on-attach-cleanup",
        title: "onAttach and cleanup",
        caption:
          "onAttach(hook) runs when the component is placed. A function it returns runs on detach.",
        components: [OnAttach],
        sources: [
          {
            path: "src/demos/basics/OnAttach.lusia",
            text: onAttachSource,
          },
        ],
      },
    ],
  },
  event: {
    icon: "ads_click",
    demos: [
      {
        id: "event-handlers",
        title: "Event handlers",
        caption: "A handler gets the event, so it can read the field's value.",
        components: [Events],
        sources: [
          {
            path: "src/demos/basics/Events.lusia",
            text: eventsSource,
          },
        ],
      },
    ],
  },
  "bind-value": {
    icon: "sync_alt",
    demos: [
      {
        id: "bind-fields",
        title: "Two-way bind-value",
        caption: "A field and a variable stay in sync, in both directions.",
        components: [BindFields],
        sources: [
          {
            path: "src/demos/basics/BindFields.lusia",
            text: bindFieldsSource,
          },
        ],
      },
      {
        id: "bind-child",
        title: "Bind a child's input",
        caption: "The child's input writes to the parent's variable through bind-value.",
        components: [BindChild],
        sources: [
          {
            path: "src/demos/components/BindChild.lusia",
            text: bindChildSource,
          },
          {
            path: "src/demos/components/Field.lusia",
            text: fieldSource,
          },
        ],
      },
    ],
  },
  "bind-element": {
    icon: "adjust",
    demos: [
      {
        id: "bind-element-ref",
        title: "Element reference",
        caption: "bind-element variables the real DOM element. It is cleared on unmount.",
        components: [BindElement],
        sources: [
          {
            path: "src/demos/basics/BindElement.lusia",
            text: bindElementSource,
          },
        ],
      },
    ],
  },
  if: {
    icon: "call_split",
    demos: [
      {
        id: "if-branches",
        title: "IF, ELSEIF and ELSE",
        caption: "Show one branch at a time. Each branch slides in and fades out.",
        components: [IfDemo],
        sources: [
          {
            path: "src/demos/flow/IfDemo.lusia",
            text: ifSource,
          },
        ],
      },
    ],
  },
  each: {
    icon: "view_list",
    demos: [
      {
        id: "each-rows",
        title: "Each",
        caption: "Repeat markup for each item. A removed row fades out first.",
        components: [EachDemo],
        sources: [
          {
            path: "src/demos/flow/EachDemo.lusia",
            text: eachSource,
          },
        ],
      },
    ],
  },
  for: {
    icon: "repeat",
    demos: [
      {
        id: "for-range",
        title: "Range",
        caption: "Repeat markup over a range of numbers. Bad input falls back to safe values.",
        components: [ForDemo],
        sources: [
          {
            path: "src/demos/flow/ForDemo.lusia",
            text: forSource,
          },
        ],
      },
    ],
  },
  preset: {
    icon: "auto_awesome",
    table: {
      head: ["Value", "What it does"],
      rows: [
        ["PRESET.FADE_IN", "Fades in from transparent."],
        ["PRESET.FADE_OUT", "Fades out to transparent."],
        ["PRESET.SLIDE_UP", "Comes up from below, moving up 24px into place while fading in."],
        ["PRESET.SLIDE_DOWN", "Comes down from above, moving down 24px into place while fading in."],
        ["PRESET.SLIDE_LEFT", "Comes in from the left, moving right 24px into place while fading in."],
        ["PRESET.SLIDE_RIGHT", "Comes in from the right, moving left 24px into place while fading in."],
        ["PRESET.POP_IN", "Grows from 80% size while fading in."],
        ["PRESET.POP_OUT", "Shrinks to 80% size while fading out."],
        ["PRESET.ZOOM_IN", "Grows from nothing to full size."],
        ["PRESET.ZOOM_OUT", "Shrinks from full size to nothing."],
        ["PRESET.FLIP_IN", "Turns into view around the vertical axis while fading in."],
        ["PRESET.FLIP_OUT", "Turns away around the vertical axis while fading out."],
        ["PRESET.BLUR_IN", "Comes into focus from a blur while fading in."],
        ["PRESET.BLUR_OUT", "Blurs out while fading out."],
        ["PRESET.DROP_IN", "Falls in from above and settles with a small bounce."],
        ["PRESET.BOUNCE_IN", "Grows in with a bounce, then settles."],
        ["PRESET.SHAKE", "Shakes sideways 10px, then settles."],
        ["PRESET.PULSE", "Grows to 110% and back."],
        ["PRESET.SPIN", "One full turn."],
        ["PRESET.WOBBLE", "Wobbles side to side, then settles."],
        ["PRESET.HEARTBEAT", "Beats twice, then settles."],
        ["PRESET.TADA", "Grows and wiggles, then settles."],
      ],
    },
    demos: [
      {
        id: "preset-gallery",
        title: "Presets",
        caption: "Hover a tile to play its preset.",
        components: [Presets],
        sources: [
          {
            path: "src/demos/motion/Presets.lusia",
            text: presetsSource,
          },
        ],
      },
    ],
  },
  "animate-item": { icon: "tune" },
  style: {
    icon: "code",
    demos: [
      {
        id: "style-scss",
        title: "Nested SCSS",
        caption: "Nested rules and a shared variable file, compiled for this component.",
        components: [Scss],
        sources: [
          {
            path: "src/demos/styling/Scss.lusia",
            text: scssSource,
          },
          { path: "src/styles/_theme.scss", text: themeSource },
        ],
      },
    ],
  },
  "style-scoped": {
    icon: "account_tree",
    demos: [
      {
        id: "style-scoped-tree",
        title: "Scoped and tree rules",
        caption: "A scoped rule stays in this component. A tree rule also reaches its children.",
        components: [StyleParent],
        sources: [
          {
            path: "src/demos/styling/StyleParent.lusia",
            text: styleParentSource,
          },
          {
            path: "src/demos/styling/StyleChild.lusia",
            text: styleChildSource,
          },
        ],
      },
    ],
  },
  "style-global": {
    icon: "public",
    demos: [
      {
        id: "style-global-rules",
        title: "Global rules",
        caption: "A global rule reaches any element, even outside the component.",
        components: [GlobalStyles],
        sources: [
          {
            path: "src/demos/styling/GlobalStyles.lusia",
            text: globalStylesSource,
          },
        ],
      },
    ],
  },
  animate: {
    icon: "animation",
    demos: [
      {
        id: "animate-enter",
        title: "Enter only",
        caption: "Plays once when attached. detach() removes the box at once.",
        components: [Enter],
        sources: [
          {
            path: "src/demos/motion/Enter.lusia",
            text: enterSource,
          },
          {
            path: "src/demos/motion/Box.lusia",
            text: boxSource,
          },
        ],
      },
      {
        id: "animate-leave",
        title: "Leave only",
        caption: "Plays when detached. detach() waits for it, then removes the box.",
        components: [Leave],
        sources: [
          {
            path: "src/demos/motion/Leave.lusia",
            text: leaveSource,
          },
          {
            path: "src/demos/motion/Shrink.lusia",
            text: shrinkSource,
          },
        ],
      },
      {
        id: "animate-leave-spin",
        title: "Show or hide the box",
        caption: "The box spins away in place. Its size and rotation stay whole until it is gone.",
        components: [SpinAway],
        sources: [
          {
            path: "src/demos/motion/SpinAway.lusia",
            text: spinAwaySource,
          },
        ],
      },
      {
        id: "animate-both",
        title: "Enter and leave",
        caption: "One item plays on attach and another on detach, in an array.",
        components: [Both],
        sources: [
          {
            path: "src/demos/motion/Both.lusia",
            text: bothSource,
          },
          {
            path: "src/demos/motion/Pop.lusia",
            text: popSource,
          },
        ],
      },
    ],
  },
  config: {
    icon: "tune",
    demos: [
      {
        id: "config-duration",
        title: "Project defaults",
        caption: "The first box has no duration, so it uses the value in lusia.config. The second sets its own.",
        components: [ConfigDemo],
        sources: [{ path: "src/demos/motion/ConfigDemo.lusia", text: configDemoSource }],
      },
    ],
    table: {
      head: ["Key", "Value", "Default", "What it does"],
      rows: [
        ["animate.duration", "number, ms", "300", "Length of one play"],
        ["animate.delay", "number, ms", "0", "Wait before each forward play"],
        [
          "animate.ease",
          '[style, direction], e.g. ["QUART", "INOUT"]',
          '["QUART", "INOUT"]',
          "Easing curve and direction",
        ],
        ["animate.keep", "true or false", "true", "Remove the inline styles when a play ends"],
        [
          "animate.midway.play",
          "TURN, FINISH, RESTART, SKIP, IGNORE",
          "TURN",
          "What a new play does while one runs",
        ],
        ["animate.midway.turn", "SUDDEN, SMOOTH, STOP", "SUDDEN", "How the motion turns around"],
        ["animate.midway.turnDuration", "number, ms", "200", "Length of the turn"],
        ["animate.midway.turnStyle", "easing style, e.g. CUBIC", "CUBIC", "Curve of the turn"],
        ["animate.midway.turnEase", "IN, OUT, INOUT", "INOUT", "Direction of the turn"],
        [
          "animate.view.margin",
          'number, or a CSS length such as "10%"',
          '"0px"',
          "How far inside the screen edge the view starts",
        ],
        [
          "animate.view.amount",
          "number, 0 to 1",
          "0.15",
          "Share of the element that must be visible",
        ],
        ["animate.view.reverse", "true or false", "false", "Play back out when it leaves the view"],
        ["animate.hover.inDelay", "number, ms", "0", "Wait after pointer enter before playing in"],
        [
          "animate.hover.outDelay",
          "number, ms",
          "0",
          "Wait after pointer leave before playing out",
        ],
        [
          "animate.hover.outDuration",
          "number, ms",
          "item duration",
          "Length of the play out. Used only when the item sets out",
        ],
        [
          "animate.scroll.start",
          "ENTER, CENTER, LEAVE, or { element, window }",
          "ENTER",
          "Where the progress starts",
        ],
        [
          "animate.scroll.end",
          "ENTER, CENTER, LEAVE, or { element, window }",
          "LEAVE",
          "Where the progress ends",
        ],
        ["animate.scroll.part", "[from, to], 0 to 1", "[0, 1]", "The part of the progress to play"],
        [
          "animate.attach.animateSpace",
          "true or false",
          "false",
          "Slide the siblings apart when an item attaches. false: they jump",
        ],
        [
          "animate.detach.animateSpace",
          "true or false",
          "false",
          "Slide the siblings into the freed space when an item detaches. false: they jump",
        ],
        [
          "animate.in",
          'preset name, e.g. "FADE_IN", or your own keyframes',
          "none",
          "Preset for items with no style, on attach and other triggers",
        ],
        [
          "animate.out",
          'preset name, e.g. "FADE_OUT", or your own keyframes',
          "none",
          "Preset for items with no style, on detach",
        ],
        ["outdir", "text", "dist", "Output folder for lusia build"],
        ["minify", "true or false", "true", "Minify the build"],
        [
          "routes",
          'list of paths, e.g. ["/guide"]',
          "none",
          "Routes that get their own index.html",
        ],
        ["dev.port", "number, 0 to 65535", "3000", "Dev server port. A change needs a restart"],
        ["lazy.mode", "smart, all, off", "smart", "Which imported components load later"],
        ["lazy.prefetch", "idle, view, none", "idle", "When split components start to download"],
        [
          "lint.rules",
          "rule name: off, warn, error",
          "each rule's own level",
          "Severity of each lint rule",
        ],
        [
          "format.indentScriptAndStyle",
          "true or false",
          "true",
          "Indent the code inside <script> and <style> by one level in lusia format",
        ],
      ],
    },
    files: [
      { path: "lusia.config.ts", text: lusiaConfigSource },
      { path: "lusia.config.json", text: lusiaConfigJsonSource },
    ],
  },
  "animate-space": {
    icon: "space_bar",
  },
  "animate-space-page": {
    icon: "space_bar",
    demos: [
      {
        id: "animate-space-attach",
        title: "Attach opens the space",
        caption:
          "A new row is added at the top. With animateSpace on, the rows below slide down to make room. Off, they jump.",
        components: [AttachList],
        sources: [
          {
            path: "src/demos/motion/AttachList.lusia",
            text: attachListSource,
          },
        ],
      },
      {
        id: "animate-leave-space",
        title: "Detach closes the space",
        caption:
          "A removed row fades out in place. With animateSpace on, the rows below slide up to close the gap. Off, they jump.",
        components: [LeaveList],
        sources: [
          {
            path: "src/demos/motion/LeaveList.lusia",
            text: leaveListSource,
          },
        ],
      },
    ],
  },
  "scroll-at": {
    icon: "vertical_align_center",
    demos: [
      {
        id: "scroll-default",
        title: "Whole time on screen",
        caption: "With no start or end, the card fades in for the whole time it is on screen.",
        components: [ScrollDefault],
        sources: [
          {
            path: "src/demos/motion/ScrollDefault.lusia",
            text: scrollDefaultSource,
          },
          {
            path: "src/demos/motion/scroll-readout.ts",
            text: scrollReadoutSource,
          },
        ],
      },
      {
        id: "scroll-enter-center",
        title: "Ends at the middle",
        caption: "The card finishes when it reaches the middle of the screen.",
        components: [ScrollEnterCenter],
        sources: [
          {
            path: "src/demos/motion/ScrollEnterCenter.lusia",
            text: scrollEnterCenterSource,
          },
        ],
      },
      {
        id: "scroll-center-leave",
        title: "Fades out at the top",
        caption: "The card fades out as it leaves the top of the screen.",
        components: [ScrollCenterLeave],
        sources: [
          {
            path: "src/demos/motion/ScrollCenterLeave.lusia",
            text: scrollCenterLeaveSource,
          },
        ],
      },
      {
        id: "scroll-presets",
        title: "Presets side by side",
        caption: "Four presets play side by side in one lane. The readout shows its progress.",
        components: [ScrollPresets],
        sources: [
          {
            path: "src/demos/motion/ScrollPresets.lusia",
            text: scrollPresetsSource,
          },
        ],
      },
      {
        id: "scroll-lines",
        title: "Start and end lines",
        caption: "The lines light up when the card's lines meet the screen's lines.",
        components: [ScrollLines],
        sources: [
          {
            path: "src/demos/motion/ScrollLines.lusia",
            text: scrollLinesSource,
          },
        ],
      },
      {
        id: "scroll-two-items",
        title: "Two items on one card",
        caption: "One item fades in, another blurs out. They set different properties.",
        components: [ScrollTwo],
        sources: [
          {
            path: "src/demos/motion/ScrollTwo.lusia",
            text: scrollTwoSource,
          },
        ],
      },
    ],
  },
  edge: {
    icon: "grid_on",
    demos: [
      {
        id: "scroll-touch-points",
        title: "Edges or numbers",
        caption: "{ element, window } takes EDGE members or numbers from 0 to 1.",
        components: [ScrollTouchPoints],
        sources: [
          {
            path: "src/demos/motion/ScrollTouchPoints.lusia",
            text: scrollTouchPointsSource,
          },
        ],
      },
      {
        id: "animate-follow-scroll",
        title: "Follow the scroll",
        caption: "The bar fills and the card turns as you scroll.",
        components: [FollowScroll],
        sources: [
          {
            path: "src/demos/motion/FollowScroll.lusia",
            text: followScrollSource,
          },
        ],
      },
      {
        id: "animate-pinned-scroll",
        title: "Pinned scroll",
        caption: "A tall section holds the box on screen while you scroll past it.",
        components: [PinnedScroll],
        sources: [
          {
            path: "src/demos/motion/PinnedScroll.lusia",
            text: pinnedScrollSource,
          },
        ],
      },
      {
        id: "scroll-part-follow",
        title: "Steps with part and follow",
        caption: "A pinned scene plays three steps, one slice of the section each.",
        components: [ScrollPartFollow],
        sources: [
          {
            path: "src/demos/motion/ScrollPartFollow.lusia",
            text: scrollPartFollowSource,
          },
        ],
      },
      {
        id: "scroll-effects",
        title: "Progress bar, parallax and colour",
        caption:
          "A page bar, two speeds of layer, and a card that turns, grows and changes colour.",
        components: [ScrollEffects],
        sources: [
          {
            path: "src/demos/motion/ScrollEffects.lusia",
            text: scrollEffectsSource,
          },
        ],
      },
    ],
  },
  when: {
    icon: "schedule",
    table: {
      head: ["Value", "What it does"],
      rows: [
        ["WHEN.ATTACH", "Plays 0 to 1 once when attached. The default."],
        ["WHEN.DETACH", "Plays its own keyframes on detach. Detach waits for it."],
        ["WHEN.VIEW", "Plays when at least 15% is visible. Once unless more.reverse is set."],
        ["WHEN.HOVER", "Plays 0 to 1 on pointer enter, 1 to 0 on leave."],
        ["WHEN.SCROLL", "Moves the animation with the element's place on the screen."],
        ["WHEN.MOVE", "Glides the element when its place changes."],
        ["WHEN.RESIZE", "Glides the element when its size changes."],
        ["WHEN.MOVE_OR_RESIZE", "Glides the element when its place or size changes."],
        ["WHEN.MANUAL", "No trigger. Only a controller plays it."],
      ],
    },
    demos: [
      {
        id: "animate-reveal",
        title: "Reveal on scroll",
        caption: "Each line plays once as it scrolls into view.",
        components: [Reveal],
        sources: [
          {
            path: "src/demos/motion/Reveal.lusia",
            text: revealSource,
          },
        ],
      },
      {
        id: "animate-hover-in-out",
        title: "Hover in and out",
        caption: "Plays in after a wait, and leaves with its own keys.",
        components: [HoverInOut],
        sources: [
          {
            path: "src/demos/motion/HoverInOut.lusia",
            text: hoverInOutSource,
          },
        ],
      },
      {
        id: "animate-hover-delay",
        title: "Hover with a delay out",
        caption: "The box stays lit for 300 ms after the pointer leaves.",
        components: [HoverDelay],
        sources: [
          {
            path: "src/demos/motion/HoverDelay.lusia",
            text: hoverDelaySource,
          },
        ],
      },
      {
        id: "animate-variable",
        title: "Variable as trigger",
        caption: "A variable plays the animation forward when true, and back when false.",
        components: [VariableTrigger],
        sources: [
          {
            path: "src/demos/motion/VariableTrigger.lusia",
            text: variableTriggerSource,
          },
        ],
      },
    ],
  },
  layout: {
    icon: "open_with",
    demos: [
      {
        id: "animate-layout-corners",
        title: "Move",
        caption: "No keyframes. The box glides when its place changes, from any cause.",
        components: [LayoutCorners],
        sources: [
          {
            path: "src/demos/motion/LayoutCorners.lusia",
            text: layoutCornersSource,
          },
        ],
      },
      {
        id: "animate-layout-list",
        title: "Reorder",
        caption: "Rows glide to their new place when the list reorders.",
        components: [LayoutList],
        sources: [
          {
            path: "src/demos/motion/LayoutList.lusia",
            text: layoutListSource,
          },
        ],
      },
      {
        id: "animate-layout-card",
        title: "Resize",
        caption: "A card grows and shrinks smoothly when its content opens.",
        components: [LayoutCard],
        sources: [
          {
            path: "src/demos/motion/LayoutCard.lusia",
            text: layoutCardSource,
          },
        ],
      },
    ],
  },
  scoped: {
    icon: "segment",
    demos: [
      {
        id: "scoped-block",
        title: "Scoped block",
        caption: "The @scoped rule stops at the child. The child card has no border, but its h2 still turns red.",
        components: [ScopedRules],
        sources: [
          { path: "src/demos/styling/ScopedRules.lusia", text: scopedRulesSource },
          { path: "src/demos/styling/ScopedChild.lusia", text: scopedChildSource },
        ],
      },
    ],
  },
  global: {
    icon: "language",
    demos: [
      {
        id: "global-block",
        title: "Global block",
        caption: "A rule in @global reaches the element by its class, even from a scoped style.",
        components: [GlobalBlock],
        sources: [{ path: "src/demos/styling/GlobalBlock.lusia", text: globalBlockSource }],
      },
    ],
  },
  "inline-global": {
    icon: "filter_center_focus",
    demos: [
      {
        id: "inline-global-link",
        title: "Global part of a selector",
        caption: "The link inside the card gets the color. The card itself stays scoped.",
        components: [InlineGlobal],
        sources: [{ path: "src/demos/styling/InlineGlobal.lusia", text: inlineGlobalSource }],
      },
    ],
  },
  "screen-sizes": {
    icon: "devices",
    demos: [
      {
        id: "screen-sizes-tiles",
        title: "Three ways",
        caption: "Resize the window. Each tile changes at the PHONE size, using SCREEN in markup, a style in an IF, or the screen() mixin.",
        components: [ScreenSizes],
        sources: [{ path: "src/demos/styling/ScreenSizes.lusia", text: screenSizesSource }],
      },
    ],
    files: [{ path: "lusia.config.ts", text: screensConfigSource }],
  },
  elseif: {
    icon: "call_split",
    demos: [
      {
        id: "elseif-grades",
        title: "Grade branches",
        caption: "The first true branch wins. Each button sets the score, and the matching grade shows.",
        components: [ElseifDemo],
        sources: [{ path: "src/demos/flow/ElseifDemo.lusia", text: elseifDemoSource }],
      },
    ],
  },
  else: {
    icon: "fork_right",
    demos: [
      {
        id: "else-login",
        title: "Fallback branch",
        caption: "ELSE shows when the IF condition is false. Toggle the button to switch between the two.",
        components: [ElseDemo],
        sources: [{ path: "src/demos/flow/ElseDemo.lusia", text: elseDemoSource }],
      },
    ],
  },
  "on-name": {
    icon: "touch_app",
    table: {
      head: ["Form", "Runs on", "What it does"],
      rows: [
        ["onclick={fn}", "DOM event only", "Runs on the DOM click event."],
        ["on:click={fn}", "DOM event", "The same click as onclick."],
        ["on:view={fn}", "EVENT.VIEW", "Runs when the element enters or leaves the screen."],
        ["on:scroll={fn}", "EVENT.SCROLL", "Runs with progress from 0 to 1. onscroll is the DOM scroll event."],
        ["on:size={fn}", "EVENT.SIZE", "Runs when the element changes size."],
        ["on:click-outside={fn}", "EVENT.CLICK_OUTSIDE", "Runs on a press outside the element, or Escape."],
      ],
    },
    demos: [
      {
        id: "on-name-view",
        title: "Click and view",
        caption: "on:click counts clicks. on:view sets the text when the box enters or leaves the screen. Scroll the page to see it change.",
        components: [OnName],
        sources: [{ path: "src/demos/events/OnName.lusia", text: onNameSource }],
      },
    ],
  },
  listen: {
    icon: "hearing",
    demos: [
      {
        id: "listen-card",
        title: "Listen in a component",
        caption: "listen() watches a DOM click and the EVENT.VIEW event on the card. Both stop when the component detaches.",
        components: [Listen],
        sources: [{ path: "src/demos/events/Listen.lusia", text: listenSource }],
      },
    ],
  },
  "event-value": {
    icon: "event",
    demos: [
      {
        id: "click-outside-menu",
        title: "Menu closes on an outside click",
        caption: "Press Menu to open it. A press outside the menu, or Escape, closes it.",
        components: [ClickOutside],
        sources: [{ path: "src/demos/events/ClickOutside.lusia", text: clickOutsideSource }],
      },
    ],
  },
  "keep-running": {
    icon: "sync",
    demos: [
      {
        id: "keep-running-count",
        title: "Listener that keeps running",
        caption: "keepRunning() keeps the listener alive after the component detaches. Stop watching ends it.",
        components: [KeepRunning],
        sources: [{ path: "src/demos/events/KeepRunning.lusia", text: keepRunningSource }],
      },
    ],
  },
  "bind-prop": {
    icon: "swap_horiz",
    demos: [
      {
        id: "bind-prop-checked",
        title: "Checkbox",
        caption: "bind-checked links the checked property and the variable. A check updates the variable.",
        components: [BindProp],
        sources: [{ path: "src/demos/events/BindProp.lusia", text: bindPropSource }],
      },
    ],
  },
  ease: {
    icon: "show_chart",
    table: {
      head: ["Value", "What it does"],
      rows: [
        ["EASE.STYLE.LINEAR", "Constant speed, no easing."],
        ["EASE.STYLE.QUAD", "Gentle curve, t squared."],
        ["EASE.STYLE.CUBIC", "Stronger curve, t cubed. Good for most UI."],
        ["EASE.STYLE.QUART", "Strong curve, t to the fourth."],
        ["EASE.STYLE.QUINT", "Very strong curve, t to the fifth."],
        ["EASE.STYLE.SINE", "Soft curve based on a sine wave."],
        ["EASE.STYLE.EXPO", "Very fast start, long settle."],
        ["EASE.STYLE.CIRC", "Round curve, based on a circle."],
        ["EASE.STYLE.BACK", "Pulls back, then overshoots."],
        ["EASE.STYLE.ELASTIC", "Springs around the end value."],
        ["EASE.STYLE.BOUNCE", "Bounces like a ball landing."],
        ["EASE.IN", "The style as it is: slow start, fast end."],
        ["EASE.OUT", "The style flipped: fast start, slow end."],
        ["EASE.INOUT", "Slow at both ends, fast in the middle."],
      ],
    },
    demos: [
      {
        id: "animate-easing",
        title: "Custom easing",
        caption: "Any function from 0 to 1 can be the curve.",
        components: [Easing],
        sources: [
          {
            path: "src/demos/motion/Easing.lusia",
            text: easingSource,
          },
        ],
      },
      {
        id: "animate-keyframe-default",
        title: "Keyframe default",
        caption: "default sets the style and ease for keys that do not set their own.",
        components: [KeyframeDefault],
        sources: [
          {
            path: "src/demos/motion/KeyframeDefault.lusia",
            text: keyframeDefaultSource,
          },
        ],
      },
      {
        id: "animate-keys",
        title: "Several keys",
        caption: "Three keys set the color and size. The loop goes back and forth.",
        components: [Keys],
        sources: [
          {
            path: "src/demos/motion/Keys.lusia",
            text: keysSource,
          },
        ],
      },
      {
        id: "animate-loops",
        title: "Loops",
        caption: "Two loops on one square, each at its own speed.",
        components: [Loops],
        sources: [
          {
            path: "src/demos/motion/Loops.lusia",
            text: loopsSource,
          },
        ],
      },
    ],
  },
  "set-config": {
    icon: "tune",
    demos: [
      {
        id: "set-config-duration",
        title: "Change the duration",
        caption: "setConfig() with SCOPE.GLOBAL changes the duration for the whole page. Reset sets 400 ms again.",
        components: [SetConfigDemo],
        sources: [{ path: "src/demos/motion/SetConfigDemo.lusia", text: setConfigDemoSource }],
      },
    ],
  },
  controller: {
    icon: "play_circle",
    demos: [
      {
        id: "animate-control",
        title: "Controller",
        caption: "Play, reverse or stop the animation from code.",
        components: [Control],
        sources: [
          {
            path: "src/demos/motion/Control.lusia",
            text: controlSource,
          },
        ],
      },
    ],
  },
  midway: {
    icon: "alt_route",
    demos: [
      {
        id: "animate-midway",
        title: "Midway: changing your mind",
        caption: "Hover in and out quickly. Each box turns its own way.",
        components: [MidwayMode],
        sources: [
          {
            path: "src/demos/motion/MidwayMode.lusia",
            text: midwayModeSource,
          },
        ],
      },
    ],
  },
  turn: {
    icon: "u_turn_left",
    demos: [
      {
        id: "turn-midway",
        title: "Sudden and smooth turns",
        caption: "Hover in and out while the box moves. SUDDEN jumps to the new direction, SMOOTH bends into it.",
        components: [Turn],
        sources: [{ path: "src/demos/motion/Turn.lusia", text: turnSource }],
      },
    ],
  },
  "animate-more": { icon: "more_horiz" },
  "animate-type": { icon: "movie" },
  "hover-area": {
    icon: "mouse",
    demos: [
      {
        id: "hover-area-boxes",
        title: "Two hover areas",
        caption: "The final box is checked at rest, so it can flicker when it grows. The element box follows the growth.",
        components: [HoverArea],
        sources: [{ path: "src/demos/motion/HoverArea.lusia", text: hoverAreaSource }],
      },
    ],
  },
  "keyframes-type": { icon: "timeline" },
  interpolate: {
    icon: "linear_scale",
    demos: [
      {
        id: "interpolate-bar",
        title: "Blend two values",
        caption: "interpolate() returns a function. Call it with t from 0 to 1 to get the blended width and color.",
        components: [Interpolate],
        sources: [{ path: "src/demos/motion/Interpolate.lusia", text: interpolateSource }],
      },
    ],
  },
};

// Every api entry needs an icon. A missing one throws, so the catalog test catches it at once.
export function entryIcon(id: string): string {
  const entry = catalog[id];
  if (!entry) throw new Error(`No catalog icon for api entry "${id}"`);
  return entry.icon;
}
