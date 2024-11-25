//누르면 캐릭터가 한바퀴 돎.
let deg = 0;
let image = document.getElementById("npc");

function rotate() {
  deg = deg + 360; 
  image.style.transform = "rotate(" + deg + "deg)";
} 

//jQuery
$(document).ready(function () {
  //배너 3초마다 바뀌게 하기
  // 배너 이미지 배열
  const banners = [
    "media/banner1.png",
    "media/banner2.png",
    "media/banner3.png"
  ];
  let i = 0;

  // 배너를 변경하는 함수
  function changeBanner() {
    const banner = $(".banner");
    i = (i + 1) % banners.length; 
    //변경
    banner.attr("src", banners[i]);
  }

  // 3초마다 배너 변경
  setInterval(changeBanner, 3000);
});
