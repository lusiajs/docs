import {
	controller,
	EASE,
	ON,
	type AnimateItem,
	type Controller,
	type Keyframes,
	type Variable,
} from "lusiajs";

export type SparkKind = "petal" | "star";

export type Spark = {
	id: number;
	kind: SparkKind;
	tone: string;
	x: number;
	y: number;
	motion: AnimateItem;
	control: Controller;
};

export type SparkOptions = {
	kind: SparkKind;
	tones: string[];
	count: number;
	x: number;
	y: number;
	spread: number;
	lift: number;
	duration: number;
};

let nextId = 0;

function randomBetween(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

function pick(list: string[]): string {
	return list[Math.floor(Math.random() * list.length)]!;
}

function flight(dx: number, dy: number, turn: number): Keyframes {
	return {
		ease: [EASE.STYLE.QUART, EASE.OUT],
		0: { opacity: 1, translate: "0px 0px", rotate: "0deg" },
		1: { opacity: 0, translate: `${dx}px ${dy}px`, rotate: `${turn}deg` },
	};
}

function makeSpark(options: SparkOptions): Spark {
	const angle = randomBetween(0, Math.PI * 2);
	const distance = randomBetween(options.spread * 0.4, options.spread);
	const dx = Math.cos(angle) * distance;
	const dy = Math.sin(angle) * distance + options.lift;
	const turn = randomBetween(-360, 360);
	const control = controller();
	return {
		id: nextId++,
		kind: options.kind,
		tone: pick(options.tones),
		x: options.x,
		y: options.y,
		motion: {
			play: flight(dx, dy, turn),
			duration: options.duration,
			on: ON.MANUAL,
			control,
		},
		control,
	};
}

function removeSpark(sparks: Variable<Spark[]>, spark: Spark): void {
	sparks.value = sparks.value.filter((other) => other !== spark);
}

// Each spark plays its flight once. When the flight ends, the spark leaves the list.
export function spawnSparks(
	sparks: Variable<Spark[]>,
	options: SparkOptions,
): void {
	const created = Array.from({ length: options.count }, () =>
		makeSpark(options),
	);
	sparks.value = [...sparks.value, ...created];
	for (const spark of created) {
		spark.control.play().then(() => removeSpark(sparks, spark));
	}
}
