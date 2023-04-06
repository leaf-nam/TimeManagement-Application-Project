// html 객체 불러오기
const canvas = document.querySelector("#todoCanvas");
const canvasContainer = document.querySelector("#canvas-container");
const graphWidth = window.innerWidth;
const graphHeight = window.innerHeight - 200;
// 캔버스 설정
canvas.width = graphWidth;
canvas.height = graphHeight;
const ctx = canvas.getContext("2d");
// 스케일 설정
let distancePerSecond = graphWidth / scale / scaleForSlider;
let distancePerFrame = getDistancePerFrame();
// 객체 크기설정
const radius = 20;
const fontSize = 60;
// Frame 그리는 함수
function drawFrame() {
  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 마우스 상호작용
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  // 기준시간(24시간 뒤)을 1초에 해당거리만큼 이동시키기
  distancePerFrame = getDistancePerFrame();
  // 1초마다 실행되는 함수
  measureOneSecond += distancePerFrame / distancePerSecond;
  if (measureOneSecond > 1) {
    measureOneSecond = 0;
    console.log("hi");
    parsedToDosOnGraph.forEach((todo) => {
      // console.log(todo.limit);
      // console.log(todo.x / distancePerSecond);
    });
  }
  // 격자 그리기
  paintAxisX();
  paintAxisY();
  // 각각의 Todo에서 작동해야 하는 함수(forEach문)
  // 1. 마우스와 거리 구하기
  // 2. Todo그래프에 그리기
  // 3. 마우스 올려지면 Rect 그리기
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
