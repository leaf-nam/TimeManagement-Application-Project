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
let speed = 1;
let nowText;
let nowTodoX;
let nowTodoY;
let mouseX;
let mouseY;
let downMouseX;
let downMouseY;
let isMouseDown = false;
let mouseLock = false;
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
      todo.limit = mouseX;
      todo.important = Math.round(5.5 - (mouseY * 5) / graphHeight);
      todo.y = (graphHeight * (9 - (todo.important - 1) * 2)) / 10;
    }
    todo.mouseLock = false;
  });
}
//   if (todo.mouseLock) {
//     console.log(todo);
//     const li = todo.parentElement;
//     parsedToDos = parsedToDos.filter((todo) => todo.id != parseInt(li.id));
//     li.remove();
//     paintTodo(todo);
//   }
// });
// parsedToDos = parsedToDosOnGraph;
// saveToDos();

// Todo 위치를 계산하기 위한 함수
function calLocationTodo(todo) {
  const remains = RemainTimeCalcurate(todo);
  const locationX =
    (graphWidth * (Number(remains[0]) * 60 + Number(remains[1]))) / (26 * 60);
  const locationY = (graphHeight * (9 - (todo.important - 1) * 2)) / 10;
  return [locationX, locationY];
}
// todo의 좌표를 바꾸는 함수
function moveTodo(todo) {
  if (todo.mouseLock) {
    todo.x = mouseX;
    todo.y = mouseY;
  } else {
    todo.x = todo.x - speed;
    todo.y = todo.y;
  }
  if (todo.x - radius < 0) {
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
  let distance = Math.sqrt(
    Math.pow(mouseX - todo.x, 2) + Math.pow(mouseY - todo.y, 2)
  );
  if (distance <= radius && !todo.is_mouse_on) {
    todo.is_mouse_on = true;
  } else if (distance > radius && todo.is_mouse_on) {
    todo.is_mouse_on = false;
  }
}
// Todo의 속성을 상자로 띄우는 함수
function paintTodoRectOnGraph(todo) {
  ctx.beginPath();
  ctx.rect(mouseX, mouseY - radius * 10, radius * 20, radius * 10);
  ctx.stroke();
  ctx.font = `${fontSize}px Arial`;
  ctx.fillText(`할 일 : ${todo.text}`, mouseX, mouseY - 2 * fontSize);
  ctx.fillText(`남은시간 : ${todo.limit}`, mouseX, mouseY - fontSize);
  ctx.fillText(`중요도 : ${todo.important}`, mouseX, mouseY);
}
// 격자를 그리는 함수
function paintLine() {
  let x = 100;
  x -= speed;
  ctx.strokeStyle = "green";
  ctx.lineWidth = 1;
  if (x - radius < 0) {
    x = graphWidth;
  }
  for (let i = 1; i <= 24; i++) {
    ctx.beginPath();
    ctx.moveTo(((24 - i) * graphWidth) / 24, 0);
    ctx.lineTo(((24 - i) * graphWidth) / 24, graphHeight);
    ctx.stroke();
    ctx.font = `${fontSize / 3}px Arial`;
    ctx.fillText(`${24 - i}시`, ((24 - i) * graphWidth) / 24, graphHeight);
  }
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (graphHeight / 10) * (2 * i - 1));
    ctx.lineTo(graphWidth, (graphHeight / 10) * (2 * i - 1));
    ctx.stroke();
    ctx.fillText("★".repeat(6 - i), 0, (graphHeight / 10) * (2 * i - 1));
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
