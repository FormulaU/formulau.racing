(function($) {
  "use strict";

  $('a.smoothscroll').click(function(event) {
    if (this.hash !== "") {
      event.preventDefault();

      window.scroll({
        top: $(this.hash).offset().top,
        left: 0,
        behavior: 'smooth'
      });

      history.pushState(null, null, this.hash)
    }

    $('.navbar-collapse').collapse('hide');
  });

  $(window).scroll(function() {
    if ($("#navbar").offset().top > 100) {
      $("#navbar").addClass("navbar-shrink");
    } else {
      $("#navbar").removeClass("navbar-shrink");
    }
  });

})(jQuery);
