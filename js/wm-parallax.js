jQuery(document).ready(function ($) {
  'use strict';
  $('.wm-parallax ul').each(function () {
    var scene = $(this),
      children = $('li', scene),
      loaded = 0,
      api,
      setOrigin = function () {
        api.hw = api.ox + (api.ow / 2);
        api.hh = api.oy + (api.oh / 2);
      },
      minHeight = function (h) {
        if (h > scene.height()) { scene.height(h); }
      };
    scene.height(0);
    children.hide().each(function () {
      var id = $(this).data('layer-id');
      minHeight(layers[id].height);
      $('<img>').attr(layers[id]).appendTo(this).load(function () {
        loaded += 1;
        if (loaded === children.length) {
          scene.css({ backgroundImage: 'none' });
          children.fadeIn();
          api = $(scene).parallax().data('api');
          api.onWindowResize = setOrigin;
          setOrigin();
        }
      });
    });
  });
});
