const intervals = [15, 30, 60, 120];
const startTime = new Date('2021-10-10T08:00:00')
const numOfLines = 10;

let interval, canvas, ctx;
let currentIntervalIdx = 1;

let frames = 0;

const draw = () => {
	console.log('draw called')

	canvas = document.getElementById('canvas');
	slider = document.getElementById('scaleSlider');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		
		drawCanvas();
	}

	setInterval(drawCanvas, 1000 / 60);
}

const drawCanvas = (e) => {
	frames++;

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

	//upper Rect
	ctx.beginPath();
	ctx.fillStyle = "#909090";
	ctx.fillRect(80, 0, 1000, canvas.height * 0.25);
	ctx.stroke();

	//bottom Rect
	ctx.beginPath();
	ctx.fillStyle = "#909090";
	ctx.fillRect(80, (canvas.height * 0.75), 1000, canvas.height * 0.25);
	ctx.stroke();

	// Middle Rect for time
	ctx.beginPath();
	ctx.lineWidth = "3";
	ctx.fillStyle = "#C4C4C4";
	ctx.fillRect(80, canvas.height * 0.25, 1000, canvas.height * 0.5);
	ctx.stroke();

	//left Pane for time
	ctx.beginPath();
	ctx.lineWidth = "3";
	ctx.fillStyle = "#565656";
	ctx.fillRect(80, 0, 30, canvas.height);
	ctx.stroke();

	//lines for time pane
	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = "#C4C2DB";
	ctx.moveTo(80, canvas.height * 0.25);
	ctx.lineTo(110, canvas.height * 0.25);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = "#C4C2DB";
	ctx.moveTo(80, canvas.height * 0.5);
	ctx.lineTo(110, canvas.height * 0.5);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = "#C4C2DB";
	ctx.moveTo(80, canvas.height * 0.75);
	ctx.lineTo(110, canvas.height * 0.75);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = "#C4C2DB";
	ctx.moveTo(80, canvas.height * 0.875);
	ctx.lineTo(110, canvas.height * 0.875);
	ctx.stroke();

	//marked time 4h in left time pane
	ctx.beginPath();
	ctx.lineWidth = "8";
	ctx.strokeStyle = "#8A80FF";
	ctx.moveTo(80, canvas.height * 0.125);
	ctx.lineTo(110, canvas.height * 0.125);
	ctx.stroke();

	//timestamps
	ctx.font = "22px Sans-Serif";
	ctx.textAlign = "start";
	ctx.fontWeight = "50";

	ctx.fillText("2h", 45, 90);
	ctx.fillText("1h", 45, 155);
	ctx.fillText("30min", 15, 225);
	ctx.fillText("15min", 15, 280);

	//marked timestamp
	ctx.fillStyle = "#8A80FF";
	ctx.fillRect(32, 22, 40, 30);
	ctx.fillStyle = "white";
	ctx.fillText("4h", 40, 45);

	//draw stroke for start time
	ctx.beginPath();
	ctx.lineWidth = "5";
	ctx.strokeStyle = "#780060";
	ctx.moveTo(220, 110);
	ctx.lineTo(220, 190);
	ctx.stroke();

	//draw stroke for end time
	ctx.beginPath();
	ctx.lineWidth = "5";
	ctx.strokeStyle = "#780060";
	ctx.moveTo(880, 110);
	ctx.lineTo(880, 190);
	ctx.stroke();

	//draw time reservation rect
	ctx.stroke();
	ctx.fillStyle = "rgba(214, 116, 192, 0.5)";
	ctx.fillRect(223, 110, 655, 80);
	
	// rectangles
	const rectHeight = canvas.height / 4;

	const activeY = currentIntervalIdx * rectHeight;
	ctx.fillStyle = "rgb(132,184,217,0.3)";
	ctx.fillRect(110, activeY, canvas.width, rectHeight);

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

const addToolTip = (x, y, text) => {


// Thanks Juan Mendes
// https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
 const roundRect = (x, y, width, height, radius, fill, stroke) => {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}