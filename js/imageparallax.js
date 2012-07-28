(function($)
{	
	$.fn.imageparallax = function () {

		$(this).each(function (parallaxId, parallax) {
	
			var resize = false;

			parallax.intensity = parseInt($(parallax).data('intensity'), 10) / 10;
			parallax.ratio = $(parallax).data('ratio');
			parallax.horizontal = $(parallax).hasClass('horizontal')
			parallax.vertical = $(parallax).hasClass('vertical');
			parallax.images = $(parallax).find('img');
			
			$(parallax.images).each(function(i, img) {
				img.intensity = 1 - (parallax.intensity / 2) + parallax.intensity * (i / parallax.images.length);
				$(img).attr('title', '');
			});
			
			parallax.init = function() {
				if (parallax.ratio >= 1) {
					parallax.w = parseInt($(parallax).parent().width(), 10);
				} else {
					parallax.w = parseInt($(parallax).parent().width() * parallax.ratio, 10);
				}
				parallax.h = parseInt(parallax.w / parallax.ratio, 10);
				$(parallax).width(parallax.w);
				$(parallax).height(parallax.h);
				$(parallax.images).each(function(i, img) {
					img.w = parseInt(parallax.w * img.intensity, 10);
					img.h = parseInt(parallax.h * img.intensity, 10);
					img.left = parseInt((img.w - parallax.w) / 2, 10) * -1;
					img.top = parseInt((img.h - parallax.h) / 2, 10) * -1;
					$(img).css({
						left: img.left + "px",
						top: img.top + "px"
					}).width(img.w).height(img.h);
				});
				$(parallax).mousemove( function (e) {
					var offset = $(parallax).offset(),
					ratioX = parseInt(e.pageX - offset.left - ( parallax.w / 2 ), 10) / -parallax.w,
					ratioY = parseInt(e.pageY - offset.top - ( parallax.h / 2 ), 10) / -parallax.h;
					$(parallax.images).each(function(i, img) {
						if (parallax.horizontal) {
							$(img).css('left', parseInt(img.left - ratioX * img.left, 10) + 'px');
						}
						if (parallax.vertical) {
							$(img).css('top', parseInt(img.top - ratioY * img.top, 10) + 'px');
						}
					});
				});
			};
		
			$(window).resize(function () {
				if (resize !== false) { clearTimeout(resize); }
				resize = setTimeout(function () {
					parallax.init();
				}, 'normal');
			});
			
			parallax.init();
		});
	};
})(jQuery);

jQuery(document).ready(function($) {
	$('.parallax-layers').imageparallax();
});