(function ($) {
  'use strict';
  $('.wm-parallax ul').each(function () {
    var scene = $(this).parallax(),
      api = scene.data('api'),
      setOrigin = function () {
        api.hw = api.ox + (api.ow / 2);
        api.hh = api.oy + (api.oh / 2);
      };
    api.onWindowResize = setOrigin;
    setOrigin();
  });
}(jQuery));
