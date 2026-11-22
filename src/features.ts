import flowSource from "./components/features/FlowDemo.lusia?raw";
import motionSource from "./components/features/MotionDemo.lusia?raw";
import scopedSource from "./components/features/ScopedDemo.lusia?raw";
import scrollSource from "./components/features/ScrollDemo.lusia?raw";
import terminalSource from "./components/features/TerminalMock.lusia?raw";
import treeSource from "./components/features/TreeNode.lusia?raw";
import updateSource from "./components/features/UpdateDemo.lusia?raw";

// The Home features, in scroll order. Each card shows one feature with its demo and code.
export const features = [
	{
		key: "motion",
		number: "01",
		tag: "Motion",
		title: "Motion is built in",
		benefit: "Pick a preset and a moment: load, hover, scroll or remove. One animate attribute does it.",
		icon: "motion_photos_auto",
		tone: "var(--sky)",
	},
	{
		key: "scroll",
		number: "02",
		tag: "Scroll",
		title: "Scroll-driven, no library",
		benefit: "Elements follow the scroll. They rise, fade and turn as you move.",
		icon: "swipe_vertical",
		tone: "var(--lavender)",
	},
	{
		key: "updates",
		number: "03",
		tag: "Reactive",
		title: "Surgical updates",
		benefit: "Change a variable and only the text that reads it updates.",
		icon: "bolt",
		tone: "var(--pink)",
	},
	{
		key: "flow",
		number: "04",
		tag: "Lists",
		title: "Shuffle with grace",
		benefit: "Keyed EACH items glide to their new place when the list changes.",
		icon: "shuffle",
		tone: "var(--mint)",
	},
	{
		key: "tree",
		number: "05",
		tag: "Components",
		title: "Infinite trees",
		benefit: "A component can use itself. One small file builds a tree of any depth.",
		icon: "account_tree",
		tone: "var(--lemon)",
	},
	{
		key: "scoped",
		number: "06",
		tag: "Styles",
		title: "Styles stay home",
		benefit: "Styles in a scoped block only touch their own component. Two components can use the same class name without clashing.",
		icon: "palette",
		tone: "var(--peach)",
	},
	{
		key: "start",
		number: "07",
		tag: "Tooling",
		title: "Zero to running",
		benefit: "One command creates a project. bun run dev starts it.",
		icon: "rocket_launch",
		tone: "var(--sky)",
	},
];

// The code shown on the Home features. The test compiles each .lusia snippet, so the features never show broken code.
// Each feature shows the real source of the demo beside it, so the code always matches.
export const featureSources = {
	motion: { file: "MotionDemo.lusia", code: motionSource },
	scroll: { file: "ScrollDemo.lusia", code: scrollSource },
	updates: { file: "UpdateDemo.lusia", code: updateSource },
	flow: { file: "FlowDemo.lusia", code: flowSource },
	tree: { file: "TreeNode.lusia", code: treeSource },
	scoped: { file: "ScopedDemo.lusia", code: scopedSource },
	start: { file: "TerminalMock.lusia", code: terminalSource },
};
