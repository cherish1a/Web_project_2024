//로딩
$(window).on("load", function() {
    showPage();
});

var showPage = function() {
    var loader = $("div.loader");
    var container = $("div.container");
    loader.css("display","none");
    container.css("display","block");
};
