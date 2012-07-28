<?php

class Image_Parallax_Post_Type {

	static $setting_fields = array(
		array(
			'id' => 'parallax_horizontal',
			'label' => 'Allow horizontal control',
			'type' => 'checkbox'
		),
		array(
			'id' => 'parallax_vertical',
			'label' => 'Allow vertical control',
			'type' => 'checkbox'
		),
		array(
			'id' => 'parallax_intensity',
			'label' => 'Intensity',
			'type' => 'range',
			'min' => 0,
			'max' => 10,
			'step' => 1
		)/*,
		array(
			'id' => 'parallax_size',
			'label' => 'Size',
			'type'	=> 'radio',
			'options' => array (
				'large' => array (
					'label' => 'Large',
					'value'	=> 'large'
				),
				'medium' => array (
					'label' => 'Medium',
					'value'	=> 'medium'
				),
				'thumb' => array (
					'label' => 'Thumbnail',
					'value'	=> 'thumb'
				)
			)
		)*/
	);

	static function init() {
		add_action('init', array(__CLASS__, 'register'));
	}
	
	static function register() {
		$labels = array(
			'name' => __('Parallax'),
			'singular_name' => __('Parallax'),
			'add_new_item' => __('Add New Parallax'),
			'edit_item' => __('Edit Parallax'),
			'new_item' => __('New Parallax'),
			'view_item' => __('View Parallax'),
			'search_items' => __('Search Parallax'),
			'not_found' => __('No parallax found'),
			'not_found_in_trash' => __('No parallax found in trash'),
			'menu_name' => __('Parallax')
    	);
    	$args = array( 
			'labels' => $labels,
			'supports' => array('title', 'thumbnail'),
			'public' => true,
			'show_in_menu' => 'upload.php',
			'has_archive' => true,
			'register_meta_box_cb' => array(__CLASS__, 'meta_box_cb')
		);
		register_post_type('parallax', $args);
		add_action('save_post', array(__CLASS__, 'save_meta'));
	}

	static function meta_box_cb() {
		add_meta_box('parallax_layers', 'Upload Layers', array(__CLASS__, 'meta_box_layers'), 'parallax', 'normal', 'high');
		add_meta_box('parallax_settings', 'Settings', array(__CLASS__, 'meta_box_settings'), 'parallax', 'side', 'default');
	}
	
	static function meta_box_layers() {
		global $post;
		$post_ID = $post->ID;
		printf( "<iframe frameborder='0' src=' %s ' style='width: 100%%; height: 442px;'></iframe>", get_upload_iframe_src('media'));
	}
	
	static function meta_box_settings() {
		global $post;
		echo '<input type="hidden" name="parallax_meta_box_nonce" value="'.wp_create_nonce(basename(__FILE__)).'" /><table class="form-table">';
		foreach (self::$setting_fields as $field) {
			$meta = get_post_meta($post->ID, $field['id'], true);
			switch ($field['type']) {
				case 'checkbox':
					echo '<tr><td><input type="checkbox" name="'.$field['id'].'" id="'.$field['id'].'" ', $meta ? ' checked="checked"' : '', '/><label for="'.$field['id'].'">'.$field['label'].'</label></td></tr>';
				break;
				case 'range':
					echo '<tr><td style="text-align:center"><input type="range" name="'.$field['id'].'" id="'.$field['id'].'" value="'.$meta.'" min="'.$field['min'].'" max="'.$field['max'].'" step ="'.$field['step'].'" /><br /><label for="'.$field['id'].'">'.$field['label'].'</label></td></tr>';
				break;
				case 'radio':
					echo '<tr><td>';
					foreach ($field['options'] as $option ) {
						echo '<input type="radio" name="'.$field['id'].'" id="'.$option['value'].'" value="'.$option['value'].'" ', $meta == $option['value'] ? ' checked="checked"' : '',' /><label for="'.$option['value'].'">'.$option['label'].'</label>';
					}
					echo '</td></tr>';
				break;
			}
		}
		echo '</table>';
	}
	
	static function save_meta($parallax_ID) {
		if (get_post_type($parallax_ID) != 'parallax') return $parallax_ID;
		if (!wp_verify_nonce($_POST['parallax_meta_box_nonce'], basename(__FILE__))) return $parallax_ID;
		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return $parallax_ID;
		foreach (self::$setting_fields as $field) {
			$old = get_post_meta($parallax_ID, $field['id'], true);
			$new = $_POST[$field['id']];
			if ($new && $new != $old) {
				update_post_meta($parallax_ID, $field['id'], $new);
			} elseif ('' == $new && $old) {
				delete_post_meta($parallax_ID, $field['id'], $old);
			}
		}
	}
}
Image_Parallax_Post_Type::init();  

?>