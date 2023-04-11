let mouseX;
let mouseY;
let isMouseDown = false;
let mouseLock = false;
// Todo를 그리는 함수
function paintTodoOnGraph(todo) {
  moveTodo(todo);
  ctx.beginPath();
  ctx.arc(todo.x, todo.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}
// todo를 움직이는 함수
function moveTodo(todo) {
  if (todo.mouseLock) {
    todo.x = mouseX;
    todo.y = mouseY;
  } else {
    todo.x -= distancePerFrame;
  }
  if (todo.x < 0) {
    todo.x = graphWidth;
  }
}
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
      syncGraphToHtml(todo);
      todo.y = (graphHeight / 5) * (5 - todo.important);
      todo.mouseLock = false;
    }
  });
  parsedToDos = parsedToDosOnGraph;
  saveToDos();
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
  ctx.beginPath();
  ctx.rect(mouseX, mouseY - radius * 5, radius * 15, radius * 5);
  ctx.stroke();
  ctx.fillStyle = "green";
  ctx.font = `${fontSize / 2}px Arial`;
  ctx.fillText(`할 일 : ${todo.text}`, mouseX, mouseY - fontSize);
  ctx.fillText(`남은시간 = ${formatTime(todo.limit, "hh:mm:ss")}`, mouseX, mouseY - fontSize / 2);
  ctx.fillText(`중요도 : ${todo.important}`, mouseX, mouseY);
}
