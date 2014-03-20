(function ($) {
  $('.wm-parallax ul').each(function () {
    var api = $(this).parallax().data('api');
    api.hh = api.oy + (api.oh / 2);
    api.hw = api.ox + (api.ow / 2);
  });
}(jQuery));
