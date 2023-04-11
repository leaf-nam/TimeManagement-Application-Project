const SliderContainer = document.querySelector(".slider-container");
const weekSlider = SliderContainer.querySelector("#week_slider");
const daySlider = SliderContainer.querySelector("#day_slider");
const hourSlider = SliderContainer.querySelector("#hour_slider");
const minuteSlider = SliderContainer.querySelector("#minute_slider");
const secondSlider = SliderContainer.querySelector("#second_slider");
const sliderOutput = SliderContainer.querySelector("#value");
const preButton = SliderContainer.querySelector("#pre");
const nextButton = SliderContainer.querySelector("#next");
// 초기화
let sliderArr = [weekSlider, daySlider, hourSlider, minuteSlider, secondSlider];
let nowSlider = 2;
sliderArr[nowSlider].oninput = sliding;
sliderOutput.innerHTML = 24;
let scale = 24;
let scaleForSlider = 3600;
let axisY_scale = "시";
let distancePerSecond = window.innerWidth / scale / scaleForSlider;
let distancePerFrame = getDistancePerFrame();
let parsedToDosOnGraph = JSON.parse(savedToDos);
// 슬라이더 움직일 때 스케일 변화
function sliding() {
  value = Number(this.value);
  sliderOutput.innerHTML = value;
  scale = value;
  distancePerSecond = graphWidth / scale / scaleForSlider;
  paintAxisResetFlag = true;
  parsedToDosOnGraph.forEach((todo) => {
    todo.x = todo.limit * distancePerSecond;
  });
}
// 버튼 누를때 함수
function clickButton(event) {
  sliderArr[nowSlider].classList.add("hidden");
  if (event.target.id == "pre") {
    if (nowSlider > 0) nowSlider -= 1;
  } else {
    if (nowSlider < 4) nowSlider += 1;
  }
  sliderArr[nowSlider].classList.remove("hidden");
  sliderArr[nowSlider].oninput = sliding;
  [scaleForSlider, axisY_scale] = changeSlider(nowSlider);
  value = Number(sliderArr[nowSlider].value);
  sliderOutput.innerHTML = value;
  scale = value;
  distancePerSecond = graphWidth / scale / scaleForSlider;
  parsedToDosOnGraph.forEach((todo) => {
    todo.x = todo.limit * distancePerSecond;
  });
}
// 슬라이더가 바뀌면 스케일을 바꿔주는 함수
function changeSlider(num) {
  scaleArr = [7 * 24 * 60 * 60, 24 * 60 * 60, 60 * 60, 60, 1];
  scaleNameArr = ["주", "일", "시", "분", "초"];
  return [scaleArr[num], scaleNameArr[num]];
}

preButton.addEventListener("click", clickButton);
nextButton.addEventListener("click", clickButton);
