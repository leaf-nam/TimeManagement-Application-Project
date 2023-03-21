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
// 애니메이션을 위한 초기화
let x = 100;
let dx = 1;
const radius = 20;
let nowText;
let nowTodoX;
let nowTodoY;
let mouseX;
let mouseY;
let downMouseX;
let downMouseY;
let isMouseDown = false;
let fontSize = 30;
ctx.font = `${fontSize}px Arial`;
// 마우스 움직였을 때 함수
function handleMouseMove(event) {
  let rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}
// 마우스 클릭했을 때 함수
function handleMouseDown(event) {
  let rect = canvas.getBoundingClientRect();
  downMouseX = event.clientX - rect.left;
  downMouseY = event.clientY - rect.top;
  isMouseDown = true;
}
// Frame 그리는 함수
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 격자
  ctx.strokeStyle = "green";
  ctx.lineWidth = 1;
  x -= dx;
  if (x - radius < 0) {
    x = graphWidth;
  }
  for (let i = 1; i <= 48; i++) {
    ctx.beginPath();
    ctx.moveTo(x + ((i - 24) * graphWidth) / 24, 0);
    ctx.lineTo(x + ((i - 24) * graphWidth) / 24, graphHeight);
    ctx.stroke();
  }
  for (let i = 1; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (graphHeight / 10) * (2 * i - 1));
    ctx.lineTo(graphWidth, (graphHeight / 10) * (2 * i - 1));
    ctx.stroke();
  }
  // Check 표시
  parsedToDos = JSON.parse(savedToDos);
  let locationTodos = [];
  parsedToDos.forEach((parsedToDo) =>
    locationTodos.push(calLocationTodo(parsedToDo))
  );
  locationTodos.forEach(function (locationTodo) {
    console.log(locationTodo[3]);
    if (isMouseDown || !locationTodo[3]) {
      circleX = locationTodo[0] + x;
      circleY = locationTodo[1];
    }
    ctx.beginPath();
    ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  });
  // 마우스 상호작용
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  parsedToDos.forEach((parsedToDo) => {
    locationThis = calLocationTodo(parsedToDo);
    thisCircleX = locationThis[0] + x;
    thisCircleY = locationThis[1];
    let distance = Math.sqrt(
      Math.pow(mouseX - thisCircleX, 2) + Math.pow(mouseY - thisCircleY, 2)
    );
    let downDistance = Math.sqrt(
      Math.pow(downMouseX - thisCircleX, 2) +
        Math.pow(downMouseY - thisCircleY, 2)
    );
    if (distance <= radius && !parsedToDo.is_mouse_on) {
      parsedToDo.is_mouse_on = true;
      nowTodoX = mouseX;
      nowTodoY = mouseY;
      nowText = parsedToDo.text;
    } else if (distance > radius && parsedToDo.is_mouse_on) {
      parsedToDo.is_mouse_on = false;
    }
    if (downDistance <= radius && isMouseDown) {
      thisCircleX = mouseX;
      thisCircleY = mouseY;
    }
    if (parsedToDo.is_mouse_on) {
      ctx.beginPath();
      ctx.rect(
        nowTodoX,
        nowTodoY - checkSize * 5,
        checkSize * 10,
        checkSize * 5
      );
      ctx.stroke();
      ctx.fillText(`할 일 : ${nowText}`, nowTodoX, nowTodoY - 2 * fontSize);
      ctx.fillText(`남은시간 : ${nowTodoX}`, nowTodoX, nowTodoY - fontSize);
      ctx.fillText(
        `중요도 : ${Math.round(5.5 - (nowTodoY * 5) / graphHeight)}`,
        nowTodoX,
        nowTodoY
      );
    }
  });
  requestAnimationFrame(drawFrame);
}
// Todo 위치를 계산하기 위한 함수(변수는 todo객체)
function calLocationTodo(todo) {
  const remains = RemainTimeCalcurate(todo);
  const locationX =
    (graphWidth * (Number(remains[0]) * 60 + Number(remains[1]))) / (26 * 60);
  const locationY = (graphHeight * (9 - (todo.important - 1) * 2)) / 10;
  return [locationX, locationY, todo.text, todo.is_mouse_on];
}

requestAnimationFrame(drawFrame);
