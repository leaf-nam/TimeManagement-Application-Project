// html 객체 불러오기
const canvas = document.querySelector("#todoCanvas");
const canvasContainer = document.querySelector("#canvas-container");
const queriedToDo = document.querySelector("#todo-list");
const graphWidth = window.innerWidth;
const graphHeight = 500;
const checkImg = new Image();
checkImg.src = `img/check.png`;
const checkSize = 20;
// 캔버스 설정
canvas.width = graphWidth;
canvas.height = graphHeight;
const ctx = canvas.getContext("2d");
// 애니메이션을 위한 상수, 변수 초기화
const radius = 20;
const fontSize = radius * 3;
const distancePerSecond = graphWidth / (24 * 60);
const startTime = new Date();
let speed;
let mouseX;
let mouseY;
let isMouseDown = false;
let mouseLock = false;
let lastTime = startTime;
let now = 0;
let xStandard = graphWidth;
// 마우스 움직였을 때 함수
function handleMouseMove(event) {
  let rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}
// 마우스 눌렀을 때 함수
function handleMouseDown() {
  isMouseDown = true;
  parsedToDosOnGraph.forEach((todo) => {
    if (todo.is_mouse_on) {
      todo.mouseLock = true;
    }
  });
}
// 마우스 뗐을 때 함수
function handleMouseUp() {
  isMouseDown = false;
  parsedToDosOnGraph.forEach((todo) => {
    if (todo.mouseLock) {
      const toDoInHtml = toDoList.querySelector(`li[id="${String(todo.id)}"]`);
      todo.limit = (mouseX / distancePerSecond) * 60;
      const remains = RemainTimeCalcurate(todo);
      toDoInHtml.querySelector("span[class='limitBox']").innerText = "Remains =" + `${remains[0]} : ${remains[1]}`;
      todo.important = Math.round(5.5 - (mouseY * 5) / graphHeight);
      toDoInHtml.querySelector("span[class='importancyBox']").innerText =
        "★".repeat(todo.important) + "☆".repeat(5 - todo.important);
      todo.x = (todo.limit * distancePerSecond) / 60;
      todo.y = (graphHeight * (9 - (todo.important - 1) * 2)) / 10;
    }
    todo.mouseLock = false;
  });
  parsedToDos = parsedToDosOnGraph;
  saveToDos();
}
// todo의 좌표를 바꾸는 함수
function moveTodo(todo) {
  if (todo.mouseLock) {
    todo.x = mouseX;
    todo.y = mouseY;
  } else {
    todo.x -= speed * 60;
  }
  if (todo.x < 0) {
    todo.x = graphWidth;
  }
}
// Todo를 그리는 함수
function paintTodoOnGraph(todo) {
  moveTodo(todo);
  ctx.beginPath();
  ctx.arc(todo.x, todo.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}
// Todo와 마우스의 거리를 구하는 함수
function distanceToMouse(todo) {
  let distance = Math.sqrt(Math.pow(mouseX - todo.x, 2) + Math.pow(mouseY - todo.y, 2));
  if (distance <= radius && !todo.is_mouse_on) {
    todo.is_mouse_on = true;
  } else if (distance > radius && todo.is_mouse_on) {
    todo.is_mouse_on = false;
  }
}
// Todo의 속성을 상자로 띄우는 함수
function paintTodoRectOnGraph(todo) {
  const remains = RemainTimeCalcurate(todo);
  ctx.beginPath();
  ctx.rect(mouseX, mouseY - radius * 5, radius * 15, radius * 5);
  ctx.stroke();
  ctx.font = `${fontSize / 2}px Arial`;
  ctx.fillText(`할 일 : ${todo.text}`, mouseX, mouseY - fontSize);
  ctx.fillText(`남은시간 = ${remains[0]} : ${remains[1]} : ${remains[2]}`, mouseX, mouseY - fontSize / 2);
  ctx.fillText(`중요도 : ${todo.important}`, mouseX, mouseY);
}
// 시간 함수
function timePerFrame(timestamp = new Date()) {
  const elapsed = timestamp - lastTime;
  if (lastTime != timestamp) lastTime = timestamp;
  const distancePerFrame = (distancePerSecond / 1000) * elapsed;
  return [distancePerFrame, elapsed];
}
// 격자를 그리는 함수
function paintLine() {
  ctx.strokeStyle = "green";
  ctx.lineWidth = 1;
  for (let i = 23; i >= 0; i--) {
    lineX = xStandard - (i / 24) * graphWidth;
    if (lineX < 0) {
      lineX = xStandard - (i / 24) * graphWidth + graphWidth;
    }
    ctx.beginPath();
    ctx.moveTo(lineX, 0);
    ctx.lineTo(lineX, graphHeight);
    ctx.stroke();
    const startHour = startTime.getHours();
    if (startHour - i > 0) {
      text = startHour - i;
    } else {
      text = startHour - i + 24;
    }
    ctx.font = `${fontSize / 3}px Arial`;
    ctx.fillText(`${text}시`, lineX, graphHeight);
  }
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (graphHeight / 10) * (2 * i - 1));
    ctx.lineTo(graphWidth, (graphHeight / 10) * (2 * i - 1));
    ctx.stroke();
    ctx.fillText("★".repeat(6 - i) + "☆".repeat(i - 1), 0, (graphHeight / 10) * (2 * i - 1));
  }
}
// Frame 그리는 함수
function drawFrame() {
  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 마우스 상호작용
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  // 기준시간(24시간 뒤)을 1초에 해당거리만큼 이동시키기
  [speed, elapsed] = timePerFrame();
  xStandard -= speed * 60;
  // 현재시간 확인해서, 1초마다 함수 실행하기
  now += elapsed;
  // if (now > 1000) {
  //   now = 0;
  //   parsedToDosOnGraph.forEach((todo) => {
  //     parsedToDosOnGraph = JSON.parse(savedToDos);
  //     todo.limit = todo.limit - 1;
  //     console.log(todo.limit);
  //     console.log(todo.x);
  //     let toDolistLimit = toDoList.querySelector(`li[id="${String(todo.id)}"] > span[class='limitBox']`);
  //     const remains = RemainTimeCalcurate(todo);
  //     toDolistLimit.innerText = `Remains = ${remains[0]} : ${remains[1]} : ${remains[2]}`;
  //     parsedToDosOnGraph = parsedToDos;
  //     saveToDos();
  //   });
  // }
  // 끝까지 갔을 때(하루가 지나면)
  if (xStandard < 0) {
    xStandard = graphWidth;
  }
  // 격자 그리기
  paintLine();
  // 각각의 Todo에서 작동해야 하는 함수(forEach문)
  parsedToDosOnGraph.forEach((todo) => {
    distanceToMouse(todo);
    paintTodoOnGraph(todo);
    if (todo.is_mouse_on) {
      paintTodoRectOnGraph(todo);
    }
  });

  // 재귀적으로 호출
  requestAnimationFrame(drawFrame);
}
//<---------------------------------main------------------------------------->
let parsedToDosOnGraph = JSON.parse(savedToDos);
requestAnimationFrame(drawFrame);
