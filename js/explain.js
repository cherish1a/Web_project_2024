//스크롤
$(document).ready(function() {
    // 클래스가 "card"인 모든 요소 선택
    const $cards = $(".card");
    const $texts = $(".cardText");
    const winHeight = window.innerHeight; 

    // 윈도우 스크롤 이벤트 감지
    $(window).on('scroll', function() {
        // 각 "card" 클래스를 가진 요소에 대해 반복.
        $cards.each(function() {    
            //요소의 위치 정보
            const cardRect = this.getBoundingClientRect();
            
            // card에 active 클래스 추가
            if ((cardRect.top < winHeight) && (cardRect.bottom > 0)) {
                $(this).addClass('active');
            }
        });

        // 각 "cardText" 클래스를 가진 요소에 대해 반복.
        $texts.each(function() {    
            //요소의 위치 정보
            const textRect = this.getBoundingClientRect();
            
            // text에 active 클래스 추가
            if ((textRect.top < winHeight) && (textRect.bottom > 0)) {
                $(this).addClass('active');
            }
        });
    }).scroll();

    //누르면 흔들리게
    $(".card").on("click", function () {
        const $this = $(this);

        // 흔드는 애니메이션
        $this
            .css("position", "relative")
            .animate({ top: "-200px" }, 150) // 위로
            .animate({ top: "200px" }, 150) // 아래로
            .animate({ top: "-200px" }, 150) // 위로
            .animate({ top: "0px" }, 150); // 원래 위치
    });
});
