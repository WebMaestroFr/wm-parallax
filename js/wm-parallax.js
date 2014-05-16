jQuery(document).ready(function ($) {
  'use strict';
  $('.wm-parallax ul').each(function () {
    var scene = $(this),
      children = $('li', scene),
      loaded = 0;
    children.hide().each(function () {
      var id = $(this).data('layer-id');
      $('<img>').attr(parallaxLayers[id]).appendTo(this).load(function () {
        loaded += 1;
        if (loaded === children.length) {
          $(scene).parallax();
          children.show('fast');
        }
      });
    });
  });
});
