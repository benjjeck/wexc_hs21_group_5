const intervals = [15, 30, 60, 120];
const startTime = new Date('2021-10-10T08:00:00')
const numOfLines = 10;

let interval, canvas, ctx;
let currentIntervalIdx = 1;

const draw = () => {
	console.log('draw called')

	canvas = document.getElementById('canvas');
	slider = document.getElementById('scaleSlider');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		
		drawCanvas();
	}
}


const drawCanvas = (e) => {
	if(e){
		var pos = getMousePos(canvas, e);
		const rectHeight = canvas.height / 4;

		for(let i=1; i < 5; i++){
			const currentRangeStart = (i-1) * rectHeight;
			const currentRangeEnd = i * rectHeight;
			if(pos.y > currentRangeStart && pos.y < currentRangeEnd){
				currentIntervalIdx = i - 1;
				drawBackground();
			}
		}
	}

	interval = intervals[currentIntervalIdx];

	drawBackground();

	let currTime = new Date(startTime.toString());
	const dist = canvas.width / (numOfLines + 1);
	for (let i = 0; i < numOfLines; i++) {

		const xPos = dist + (i * dist);
		const label = formatTimeString(currTime);

		drawLineWithLabel(xPos, label);

		currTime.setMinutes(currTime.getMinutes() + interval);
	}
}

const drawLineWithLabel = (x, label) => {
	const y = 20;

	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x, canvas.height - y);
	ctx.stroke();

	drawLabel(label, x, y);
}

const drawLabel = (label, x, y) => {
	y += 10;

	// rectangle
	ctx.fillStyle = 'black';
	ctx.fillRect(x - 22, y - 14, 42, 18);


	ctx.fillStyle = 'white';
	ctx.font = '14px sans-serif'
	ctx.fillText(label, x - 19, y);
}

const formatTimeString = date => {
	const h = date.getHours().toLocaleString('de-CH', {minimumIntegerDigits: 2, useGrouping: false});
	const m = date.getMinutes().toLocaleString('de-CH', {minimumIntegerDigits: 2, useGrouping: false});
	return h + ':' + m;
}

const drawBackground = () => {
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// rectangles
	const rectHeight = canvas.height / 4;

	ctx.fillStyle = '#84B8D9';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const activeY = currentIntervalIdx * rectHeight;
	ctx.fillStyle = '#369AD9';
	ctx.fillRect(0, activeY, canvas.width, rectHeight);

	// borders
	ctx.strokeStyle = '#1D598F';
	ctx.lineWidth = 1;

	ctx.beginPath();

	for (let i = 1; i < 4; i++) {
		const y = i * rectHeight;
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
	}

	ctx.stroke();

}

const getMousePos = (canvas, evt) => {
	var rect = canvas.getBoundingClientRect();
	return {
	  x:
		((evt.clientX - rect.left) / (rect.right - rect.left)) *
		canvas.width,
	  y:
		((evt.clientY - rect.top) / (rect.bottom - rect.top)) *
		canvas.height,
	};
}

window.addEventListener("mousemove", drawCanvas, false);