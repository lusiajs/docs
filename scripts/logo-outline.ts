// Writes the home page tunnel outlines (public/logo-outline-{dark,light}-{1..4}.svg).
// Copy sizes mirror src/components/LogoTunnel.lusia. Run from docs/: bun scripts/logo-outline.ts
const outlinePath = "M26 52L30 20L44 48L48 48L62 20L66 52L66 86L100 86L100 114L26 114Z";
const tailPath = "M98 104C116 104 120 86 114 70C111 61 116 54 122 52";
const transform = "rotate(7 64 64) translate(-8 2)";
const viewBox = "10 8 108 112";

// The image box is 108 by 112 units on the 128 grid, so px per unit = copy size / 128.
const copyCount = 12;
const biggestVmin = 160;
const shrink = 0.8;
const copiesPerBucket = 3;
const viewportWidth = 1904;
const viewportHeight = 997;
const targetPx = 1.8;

const themes = {
	dark: "#f2f2f2",
	light: "#3a2e4a",
};

const vminPx = Math.min(viewportWidth, viewportHeight) / 100;

function copySizePx(index: number): number {
	return biggestVmin * shrink ** index * vminPx;
}

function bucketOf(index: number): number {
	return Math.floor(index / copiesPerBucket) + 1;
}

// Stroke in SVG units that gives `targetPx` on the bucket's middle copy.
function bucketStroke(bucket: number): number {
	const middle = (bucket - 1) * copiesPerBucket + Math.floor(copiesPerBucket / 2);
	const pxPerUnit = copySizePx(middle) / 128;
	return Math.round((targetPx / pxPerUnit) * 100) / 100;
}

function outlineSvg(color: string, stroke: number): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><g transform="${transform}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round"><path d="${outlinePath}"/><path d="${tailPath}"/></g></svg>\n`;
}

const bucketCount = Math.ceil(copyCount / copiesPerBucket);
console.log("bucket  copies   middle px/unit  stroke  px on middle  px range");
for (let bucket = 1; bucket <= bucketCount; bucket += 1) {
	const first = (bucket - 1) * copiesPerBucket;
	const last = Math.min(first + copiesPerBucket, copyCount) - 1;
	const stroke = bucketStroke(bucket);
	const middle = first + Math.floor(copiesPerBucket / 2);
	const pxPerUnit = copySizePx(middle) / 128;
	const pxFirst = stroke * (copySizePx(first) / 128);
	const pxLast = stroke * (copySizePx(last) / 128);
	console.log(
		`${bucket}       ${first}-${last}     ${pxPerUnit.toFixed(2).padStart(6)}        ${stroke.toFixed(2)}    ${(stroke * pxPerUnit).toFixed(2)}          ${pxLast.toFixed(2)}-${pxFirst.toFixed(2)}`,
	);
	for (const [name, color] of Object.entries(themes)) {
		const file = `${import.meta.dir}/../public/logo-outline-${name}-${bucket}.svg`;
		await Bun.write(file, outlineSvg(color, stroke));
	}
}
