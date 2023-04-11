// html 객체 불러오기
const canvas = document.querySelector("#todoCanvas");
// 캔버스 설정
canvas.width = graphWidth;
canvas.height = graphHeight;
const ctx = canvas.getContext("2d");
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
    // console.log("hi");
    parsedToDosOnGraph.forEach((todo) => {
      todo.limit = todo.x / distancePerSecond;
      // syncGraphToHtml(todo);
    });
  }
  // 격자 그리기
  paintAxisX();
  paintAxisY();
  // 각각의 Todo에서 작동해야 하는 함수(forEach문)
  parsedToDosOnGraph.forEach((todo) => {
    paintTodoOnGraph(todo);
    distanceToMouse(todo);
    if (todo.is_mouse_on) {
      paintTodoRectOnGraph(todo);
    }
  });
  // 재귀적으로 호출
  requestAnimationFrame(drawFrame);
}
//<---------------------------------main------------------------------------->

requestAnimationFrame(drawFrame);
