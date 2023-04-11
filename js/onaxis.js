let paintAxisResetFlag = true;
let paintAxis_axisY_xs1 = [];
let paintAxis_axisY_xs2 = [];
let paintAxis_recur1 = 0;
let paintAxis_recur2 = 0;

// Y축을 그리는 함수
function paintAxisY() {
  if (paintAxisResetFlag) {
    paintAxis_axisY_xs1 = [];
    paintAxis_axisY_xs2 = [];
    for (let i = 0; i < scale; i++) {
      paintAxis_axisY_xs1.push(Number((graphWidth / scale) * i));
      paintAxis_axisY_xs2.push(Number(graphWidth / scale) * (i + scale));
    }
    paintAxisResetFlag = false;
  } else {
    paintAxis_recur1 = paintAxisY_byArr(paintAxis_axisY_xs1, 1, paintAxis_recur1);
    paintAxis_recur2 = paintAxisY_byArr(paintAxis_axisY_xs2, scale + 1, paintAxis_recur2);
  }
}
// 배열을 받아서 Y축을 그리는 함수
function paintAxisY_byArr(arr, startIdx, recur) {
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;
  for (let i = 0; i < scale; i++) {
    axisY_index = i - 1 + startIdx + recur * scale * 2;
    arr[i] -= distancePerFrame;
    if (arr[i] < -graphWidth) {
      if (arr[0] < -graphWidth) recur++;
      arr[i] = graphWidth;
    }
    let axisY_x = arr[i];
    ctx.beginPath();
    ctx.moveTo(axisY_x, 0);
    ctx.lineTo(axisY_x, graphHeight);
    ctx.stroke();
    ctx.font = `${fontSize / 3}px Arial`;
    ctx.fillStyle = "black";
    ctx.fillText(axisY_index + axisY_scale, axisY_x, graphHeight);
  }
  return recur;
}
// X축을 그리는 함수
function paintAxisX() {
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    let axisX_y = (graphHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, axisX_y);
    ctx.lineTo(graphWidth, axisX_y);
    ctx.stroke();
    ctx.font = `${fontSize / 3}px Arial`;
    ctx.fillStyle = "green";
    ctx.fillText("★".repeat(5 - i) + "☆".repeat(i), 0, (graphHeight / 5) * i + fontSize / 3);
  }
}
