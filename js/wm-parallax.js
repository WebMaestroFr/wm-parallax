(function ($) {
  'use strict';
  $('.wm-parallax ul').each(function () {
    var scene = $(this),
      children = $('li', scene),
      loaded = 0,
      api,
      setOrigin = function () {
        api.hw = api.ox + (api.ow / 2);
        api.hh = api.oy + (api.oh / 2);
      };
    children.css('opacity', 0).each(function () {
      var id = $(this).data('layer-id');
      $('<img>').attr(layers[id]).appendTo(this).load(function () {
        loaded += 1;
        if (loaded === children.length) {
          api = $(scene).parallax().data('api');
          api.onWindowResize = setOrigin;
          setOrigin();
          children.animate({ opacity: 1 }, function () {
            scene.css({ backgroundImage: 'none' });
          });
        }
      });
    });
  });
}(jQuery));
