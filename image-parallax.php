<?php

/*
Plugin Name: Image Parallax
Plugin URI: http://webmaestro.fr/blog/2012/image-parallax-plugin-for-wordpress/
Description: A simple plugin that display images as layers of a parallax effect.
Version: 1.3
Author: WebMaestro.Fr
Author URI: http://webmaestro.fr/blog/
*/

require_once('post-type.php');

class Image_Parallax {
 
	static function init() {
		add_shortcode('parallax', array(__CLASS__, 'handle_shortcode'));
		add_filter('the_content', array(__CLASS__, 'content_filter'));
	}
	
	static function handle_shortcode($atts) {
		extract(shortcode_atts(array('id' => null), $atts));
		return self::insert($id);	
	}
	
	static function content_filter($content) {
		global $post;
		$content .= self::insert($post->ID);
		return $content;
	}
 
	static function insert($parallax_ID) {
		if (get_post_type($parallax_ID) != 'parallax') return;
		wp_enqueue_script('imageparallax', plugins_url('js/imageparallax.js', __FILE__), array('jquery'));
		wp_enqueue_style('imageparallax', plugins_url('css/imageparallax.css', __FILE__));
		return self::get_layers($parallax_ID);
	}
	
	static function get_layers($parallax_ID) {
		$original_picture_ID = get_post_thumbnail_id($parallax_ID);
		$images = get_posts(array(
			'numberposts' => -1,
			'post_type' => 'attachment',
			'post_mime_type' => 'image/png, image/gif',
			'post_parent' => $parallax_ID,
			'orderby' => 'menu_order',
			'exclude' => $original_picture_ID
		));
		if (count($images) > 0) {
			$horizontal = get_post_meta($parallax_ID, 'parallax_horizontal', true);
			$vertical = get_post_meta($parallax_ID, 'parallax_vertical', true);
			$intensity = get_post_meta($parallax_ID, 'parallax_intensity', true);
			/*$size = get_post_meta($parallax_ID, 'parallax_size', true);
			if (empty($size)) */$size = 'medium';
			$layers = '<figure class="parallax" id="parallax-'.$parallax_ID.'"';
			if ($original_picture_ID != null) {
				$src = wp_get_attachment_image_src($original_picture_ID, $size);
				$layers .= ' style="background-image:url('.$src[0].')"';
			} else {
				$src = wp_get_attachment_image_src($images[0]->ID, $size);
			}
			$width = $src[1];
			$height = $src[2];
			$layers .= '><div class="parallax-container"><div class="parallax-layers'.($vertical ? ' vertical' : '').($horizontal ? ' horizontal' : '').'" data-intensity="'.$intensity.'" data-ratio="'.( $src[1] / $src[2] ).'">';
			foreach ($images as $image) {
				$layers .= wp_get_attachment_image($image->ID, $size);
			}
			$layers .= '</div></div><figcaption>'.get_the_title($parallax_ID).'</figcaption></figure>';
		}
		return $layers;
	}
}
Image_Parallax::init();

?>