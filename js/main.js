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

  // 클래스가 "intro"인 모든 요소 선택
  const $intros = $(".intro");
  const $introTexts = $(".introText");
  const winHeight = window.innerHeight; 

  // 윈도우 스크롤 이벤트 감지
  $(window).on('scroll', function() {
      // 각 "intro" 클래스를 가진 요소에 대해 반복.
      $intros.each(function() {    
          //요소의 위치 정보
          const introRect = this.getBoundingClientRect();
          
          // intro에 active 클래스 추가
          if ((introRect.top < winHeight) && (introRect.bottom > 0)) {
              $(this).addClass('active');
          }
      });

      // 각 "introText" 클래스를 가진 요소에 대해 반복.
      $introTexts.each(function() {    
        //요소의 위치 정보
        const introTextRect = this.getBoundingClientRect();
        
        // introText에 active 클래스 추가
        if ((introTextRect.top < winHeight) && (introTextRect.bottom > 0)) {
            $(this).addClass('active');
        }
    });
  }).scroll();
});
