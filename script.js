const intervals = [240, 120, 60, 30, 15];
const startTime = new Date("2021-10-10T08:00:00");
const numOfLines = 10;

let interval, canvas, ctx;
let currentIntervalIdx = 1;
let currentXPos = 110;
let start, end;

let tooltips = [];
let userHasInteracted = false;

const draw = () => {
  canvas = document.getElementById("canvas");
  slider = document.getElementById("scaleSlider");
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");

    setTimeout(() => {
      if (!userHasInteracted) addToolTip("Try to click here", 255, canvas.height / 2, 20, 90);
    }, 1500);
  
    setTimeout(() => {
      if (!userHasInteracted) addToolTip("... and then here", 700, canvas.height / 2, 20, 90);
    }, 3000)

    setInterval(drawCanvas, 1000 / 60);
  }
};

const drawCanvas = () => {
  interval = intervals[currentIntervalIdx];

  drawBackground();

  let currTime = new Date(startTime.toString());
  const dist = canvas.width / (numOfLines + 1);

  for (let i = 0; i < numOfLines; i++) {
    const xPos = dist + i * dist + 10;
    const label = formatTimeString(currTime);

    if (i > 0) drawLineWithLabel(xPos, label);

    currTime.setMinutes(currTime.getMinutes() + interval);
  }

  drawIndicationLine();
  drawTimespan();
  drawToolTips();
};

const drawTimespan = () => {
  if (start) {
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "#D614AE";
    ctx.moveTo(start.pos, 110);
    ctx.lineTo(start.pos, 190);
    ctx.stroke();

    // labels underneath start
    ctx.fillStyle = "#343434";
    ctx.fillRect(start.pos, 195, 50, 25);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px sans-serif";
    ctx.fillText(start.time, start.pos + 4, 213);
  }

  if (end) {
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "#D614AE";
    ctx.moveTo(end.pos, 110);
    ctx.lineTo(end.pos, 190);
    ctx.stroke();

    ctx.stroke();
    ctx.fillStyle = "rgba(194, 130, 206, 0.8)";
    ctx.fillRect(start.pos, 110, end.pos - start.pos, 80);

    ctx.fillStyle = "#343434";
    ctx.fillRect(end.pos, 195, 50, 25);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px sans-serif";
    ctx.fillText(end.time, end.pos + 4, 213);

    // close
    const cls = getCloseInfo();
    ctx.fillRect(cls.x, cls.y, cls.w, cls.h);
    ctx.fillStyle = "#000";
    ctx.fillText("X", cls.x + 4, cls.y + 14);
  }
};

const drawToolTips = () => {
  const sidePadding = 10;
  const topPadding = 5;

  tooltips.forEach((tt) => {
    // tooltip
    const x = tt.x - tt.w / 2;
    const y = tt.y + tt.hh / 2 + 10;
    const w = tt.w + sidePadding * 2;
    const h = tt.h + topPadding * 2;
    ctx.fillStyle = "#BE3429";
    roundRect(x, y, w, h + 3, 3, true, false);
    ctx.fillStyle = "white";
    ctx.fillText(tt.text, x + sidePadding, y + tt.h + topPadding);

    // highlight
    ctx.strokeStyle = "#BE3429";
    ctx.lineWidth = 4;
    roundRect(tt.x - tt.hw / 2, tt.y - tt.hh / 2, tt.hw, tt.hh, 10);
  });
};

const getCloseInfo = () => {
  return { x: end.pos - 4, y: 100, w: 18, h: 18 };
};

const addToolTip = (text, x, y, highlightWidth, highlightHeight) => {
  const textMetrics = ctx.measureText(text);
  const w = textMetrics.width;
  const h =
    textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

  tooltips.push({
    x: x,
    y: y,
    w: w,
    h: h,
    hw: highlightWidth,
    hh: highlightHeight,
    text: text,
  });
};

const drawIndicationLine = () => {
  ctx.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
  ctx.beginPath();
  ctx.moveTo(currentXPos, 0);
  ctx.lineTo(currentXPos, 500);
  ctx.stroke();
  ctx.setLineDash([]); //reset line dash
};

const drawLineWithLabel = (x, label) => {
  const y = 40;

  ctx.strokeStyle = "#1D1D1D";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, canvas.height - y);
  ctx.stroke();

  drawLabel(label, x, y);
};

const drawLabel = (label, x, y) => {
  y += 10;

  // rectangle
  ctx.fillStyle = "#FFFFFF";
  roundRect(x - 22, y - 14, 42, 18, 5, true, false);

  ctx.fillStyle = "#1D1D1D";
  ctx.font = "15px sans-serif";
  ctx.fillText(label, x - 19, y);
};

const formatTimeString = (date) => {
  const h = date
    .getHours()
    .toLocaleString("de-CH", { minimumIntegerDigits: 2, useGrouping: false });
  const m = date
    .getMinutes()
    .toLocaleString("de-CH", { minimumIntegerDigits: 2, useGrouping: false });
  return h + ":" + m;
};

const drawBackground = () => {
  // rectangles
  const rectHeight = canvas.height / 5;

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //backgroundRect
  ctx.beginPath();
  ctx.fillStyle = "#595959";
  ctx.strokeStyle = "#767676";
  ctx.lineWidth = "4";
  roundRect(85, 0, 995, canvas.height, 20, true, true);
  ctx.stroke();

  //left Pane for time
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.fillStyle = "#BFEDF6";
  ctx.stroke();
  ctx.fillStyle = "#333333";

  //timestamps
  ctx.font = "22px Sans-Serif";
  ctx.textAlign = "start";
  ctx.fontWeight = "50";

  renderLeftBar();

  // borders
  ctx.strokeStyle = "#1D598F";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.stroke();
};

const getCorrectLabel = (time) => {
  if (time >= 60) {
    return `${time / 60}h `;
  } else {
    return `${time}m `;
  }
};

const renderLeftBar = () => {
  intervals.forEach((i, index) => {
    const yCoord = (canvas.height / 5) * index;
    const yCoordText = 18 + yCoord;

    if (index === currentIntervalIdx) {
      if (
        (currentIntervalIdx == 0) |
        (currentIntervalIdx == 1) |
        (currentIntervalIdx == 2)
      ) {
        //time
        ctx.fillStyle = "#31613B";
        roundRect(32, yCoordText, 50, 30, 8, true, false);
        ctx.fillStyle = "white";
        ctx.fillText(getCorrectLabel(i), 45, yCoordText + 24);

        //boxindicator
        ctx.fillStyle = "#31613B";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = "2";
      } else {
        //time
        ctx.fillStyle = "#31613B";
        roundRect(32, yCoordText, 50, 30, 8, true, false);
        ctx.fillStyle = "white";
        ctx.fillText(getCorrectLabel(i), 35, yCoordText + 24);

        //boxindicator
        ctx.fillStyle = "#31613B";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = "2";
      }
      roundRect(80, yCoord, 30, canvas.height / 5, 5, true, true);
    } else {
      //time
      ctx.fillStyle = "#E0E0E0";
      roundRect(22, yCoordText, 50, 30, 8, true, false);
      ctx.font = "22px Sans-Serif";
      ctx.textAlign = "start";
      ctx.fontWeight = "50";
      ctx.fillStyle = "#565656";
      if (
        (getCorrectLabel(i) == `4h `) |
        (getCorrectLabel(i) == `2h `) |
        (getCorrectLabel(i) == `1h `)
      ) {
        ctx.fillText(getCorrectLabel(i), 34, yCoordText + 24);
      } else {
        ctx.fillText(getCorrectLabel(i), 24, yCoordText + 24);
      }

      //boxindicator
      ctx.fillStyle = "#1E44A5";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = "2";
      roundRect(80, yCoord + 1, 30, canvas.height / 5 - 1, 5, true, true);
    }
  });
};

const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
};

const handleMouseMove = debounce((e) => {
  if (e) {
    var pos = getMousePos(canvas, e);
    if (isInsideClose(pos)) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "col-resize";
    }
    if (pos.x > 110 && pos.x < canvas.width) {
      //setting horizontal line
      currentXPos = pos.x;

      //setting current interval
      const rectHeight = canvas.height / intervals.length;

      for (let i = 1; i < intervals.length + 1; i++) {
        const currentRangeStart = (i - 1) * rectHeight;
        const currentRangeEnd = i * rectHeight;
        if (pos.y > currentRangeStart && pos.y < currentRangeEnd) {
          currentIntervalIdx = i - 1;
        }
      }
    }
  }
  drawCanvas();
}, 5);

const handleClick = (e) => {
  if (e) {
    var pos = getMousePos(canvas, e);

    if (pos.x > 110 && pos.x < canvas.width) {
      if (!start) {
        start = { pos: pos.x, time: calculateTime(pos.x) };
      } else if (pos.x > start.pos) {
        end = { pos: pos.x, time: calculateTime(pos.x) };
      }

      userHasInteracted = true;
      tooltips = [];
    }
    if (isInsideClose(pos)) {
      start = null;
      end = null;
    }
  }
  drawCanvas();
};

const isInsideClose = (pos) => {
  if (end) {
    const cls = getCloseInfo();
    if (
      pos.x > cls.x &&
      pos.x < cls.x + cls.w &&
      pos.y > cls.y &&
      pos.y < cls.y + cls.h
    ) {
      return true;
    }
  }
};

const calculateTime = (x) => {
  const leftMargin = 110;
  const totalMins = intervals[currentIntervalIdx] * 10;
  const totalWidth = 1080 - leftMargin;

  const pixelsFromStart = x - leftMargin;
  const mins = (totalMins / totalWidth) * pixelsFromStart;

  const time = (480 + mins) / 60;

  const hours = Math.floor(time);
  const minutes = Math.floor((time % 1) * 60);

  return `${hours < 10 ? 0 : ""}${hours}:${minutes < 10 ? 0 : ""}${minutes}`;
};

window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("click", handleClick, false);

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

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
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
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
};
