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
sliderOutput.innerHTML = hourSlider.value;
let scale = Number(hourSlider.value);
let scaleForSlider = 3600;
let axisY_scale = "시";
// 슬라이더 움직일 때 스케일 변화
function sliding() {
  value = Number(this.value);
  sliderOutput.innerHTML = value;
  scale = value;
  distancePerSecond = graphWidth / scale / scaleForSlider;
  paintAxisResetFlag = true;
}
// 슬라이더에 따라 스케일을 바꿔주는 함수
function scaling(num) {
  scaleArr = [7 * 24 * 60 * 60, 24 * 60 * 60, 60 * 60, 60, 1];
  scaleNameArr = ["주", "일", "시", "분", "초"];
  return [scaleArr[num], scaleNameArr[num]];
}
// 버튼 누를때 함수
function clickButton(event) {
  sliderArr[nowSlider].classList.add("hidden");
  if (event.target.id == "pre") {
    if (nowSlider > 0) nowSlider -= 1;
  } else {
    if (nowSlider < 4) nowSlider += 1;
  }
  [scaleForSlider, axisY_scale] = scaling(nowSlider);
  sliderArr[nowSlider].classList.remove("hidden");
  sliderArr[nowSlider].oninput = sliding;
  sliderOutput.innerHTML = sliderArr[nowSlider].value;
}

preButton.addEventListener("click", clickButton);
nextButton.addEventListener("click", clickButton);
