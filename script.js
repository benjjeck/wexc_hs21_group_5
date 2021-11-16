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

		const xPos = dist + (i * dist)+60;
		const label = formatTimeString(currTime);

		drawLineWithLabel(xPos, label);

		currTime.setMinutes(currTime.getMinutes() + interval);
	}
}

const drawLineWithLabel = (x, label) => {
	const y = 40;

	ctx.strokeStyle = 'black';
	ctx.lineWidth = 0.6;

	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x, canvas.height - y);
	ctx.stroke();

	drawLabel(label, x, y);
}

const drawLabel = (label, x, y) => {
	y += 10;

	// rectangle
	ctx.fillStyle = '#DCDCDC';
	ctx.fillRect(x - 22, y - 14, 42, 18);

	ctx.fillStyle = '#606060';
	ctx.font = '14px sans-serif'
	ctx.fillText(label, x - 19, y);
}

const formatTimeString = date => {
	const h = date.getHours().toLocaleString('de-CH', {minimumIntegerDigits: 2, useGrouping: false});
	const m = date.getMinutes().toLocaleString('de-CH', {minimumIntegerDigits: 2, useGrouping: false});
	return h + ':' + m;
}

const drawBackground = () => {
	// rectangles
	const rectHeight = canvas.height / 4;

	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//upper Rect
	ctx.beginPath();
	ctx.fillStyle = "#B7D7A6";
	ctx.fillRect(80, 0, 1000, canvas.height * 0.25);
	ctx.stroke();

	//bottom Rect
	ctx.beginPath();
	ctx.fillStyle = "#B7D7A6";
	ctx.fillRect(80, (canvas.height * 0.75), 1000, canvas.height * 0.25);
	ctx.stroke();

	// Middle Rect for time
	ctx.beginPath();
	ctx.lineWidth = "3";
	ctx.fillStyle = "#E9E9E9";
	ctx.fillRect(80, canvas.height * 0.25, 1000, canvas.height * 0.5);
	ctx.stroke();

	//left Pane for time
	ctx.beginPath();
	ctx.lineWidth = "3";
	ctx.fillStyle = "#BFEDF6";
	ctx.fillRect(80, 0, 30, canvas.height);
	ctx.stroke();
	ctx.fillStyle = "#565656";

	//timestamps
	ctx.font = "22px Sans-Serif";
	ctx.textAlign = "start";
	ctx.fontWeight = "50";

	ctx.fillStyle = "#E0E0E0";
	ctx.fillRect(22, 87, 50, 30);
	ctx.fillRect(22, 136, 50, 30);
	ctx.fillRect(22, 187, 50, 30);
	ctx.fillRect(22, 247, 50, 30);

	ctx.font = "22px Sans-Serif";
	ctx.textAlign = "start";
	ctx.fontWeight = "50";
	ctx.fillStyle = "#565656";

	ctx.fillText("2h", 35, 110);
	ctx.fillText("1h", 35, 160);
	ctx.fillText("30m", 25, 210);
	ctx.fillText("15m", 25, 270);

	//marked timestamp
	ctx.fillStyle = "#BE3527";
	ctx.fillRect(22, 22, 50, 30);
	ctx.fillStyle = "white";
	ctx.fillText("4h", 35, 45);

	//draw stroke for start time
	ctx.beginPath();
	ctx.lineWidth = "5";
	ctx.strokeStyle = "#D614AE";
	ctx.moveTo(220, 110);
	ctx.lineTo(220, 190);
	ctx.stroke();

	//draw stroke for end time
	ctx.beginPath();
	ctx.lineWidth = "5";
	ctx.strokeStyle = "#D614AE";
	ctx.moveTo(880, 110);
	ctx.lineTo(880, 190);
	ctx.stroke();

	//draw time reservation rect
	ctx.stroke();
	ctx.fillStyle = "rgba(194, 130, 206, 0.8)";
	ctx.fillRect(223, 110, 655, 80);

	//rects for time box on left pane

	//marked timebox + rectBorder
	ctx.fillStyle = "#BE3429";
	ctx.fillRect(80,0,30,rectHeight);
	ctx.lineWidth = "2";
	ctx.strokeStyle = "#BE3429";
	ctx.strokeRect(80,0,30,rectHeight);

	//2h, 1h and 30m for thirds
	const thirdRects = rectHeight/3*2;

	ctx.strokeStyle = '#ABABAB';
	ctx.lineWidth = 2;
	ctx.strokeRect(80,rectHeight,30,thirdRects)
	ctx.strokeRect(80,rectHeight+thirdRects,30,thirdRects)
	ctx.strokeRect(80,rectHeight+(thirdRects*2),30,thirdRects)
	ctx.strokeRect(80,rectHeight*3,30,rectHeight)

	//show active rect from position of mouse
	const activeY = currentIntervalIdx * rectHeight;
	ctx.fillStyle = "rgb(132,184,217,0.3)";
	ctx.fillRect(110, activeY, canvas.width, rectHeight);

	//labels underneath start and endpoint
	ctx.fillStyle = "#343434";
	ctx.fillRect(200,195,40,25);
	ctx.fillRect(855,195,40,25);

	ctx.fillStyle = "#FFFFFF";
	ctx.font = '16px sans-serif'
	ctx.fillText("9:30", 205, 213);
	ctx.fillText("11:40", 855, 213);

	// borders
	ctx.strokeStyle = '#1D598F';
	ctx.lineWidth = 1;

	ctx.beginPath();

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