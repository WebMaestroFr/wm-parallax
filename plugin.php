<?php
/*
Plugin Name: WebMaestro Parallax
Plugin URI: http://webmaestro.fr/image-parallax-plugin-wordpress/
GitHub Plugin URI: WebMaestroFr/wm-parallax
Author: Etienne Baudry
Author URI: http://webmaestro.fr
Description: A parallax media type.
Version: 2.0
License: GNU General Public License
License URI: license.txt
Text Domain: wm-parallax
*/

class WM_Parallax
{
  public static $behaviors = array(
    'calibrate_x' => false,
    'calibrate_y' => true,
    'invert_x' => true,
    'invert_y' => true,
    'limit_x' => false,
    'limit_y' => false,
    'scalar_x' => 10.0,
    'scalar_y' => 10.0,
    'friction_x' => 0.5,
    'friction_y' => 0.5
  );

  public static function init()
  {
    add_action( 'admin_init', array( __CLASS__, 'update_plugin' ) );
    add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ) );
    add_action( 'admin_enqueue_scripts', array( __CLASS__, 'admin_enqueue_scripts' ) );
    add_filter( 'media_view_strings', array( __CLASS__, 'media_view_strings' ) );
    add_filter( 'mce_external_plugins', array( __CLASS__, 'mce_plugin' ) );
    add_shortcode( 'parallax', array( __CLASS__, 'shortcode' ) );
  }

  public static function enqueue_scripts()
  {
    if ( preg_match( '/\[parallax(.)+\]/', $GLOBALS['post']->post_content ) ) {
      wp_register_script( 'parallax', plugins_url( 'js/vendor/jquery.parallax.min.js' , __FILE__ ), 'false', false, true );
      wp_enqueue_script( 'wm-parallax', plugins_url( 'js/wm-parallax.js' , __FILE__ ), array( 'parallax' ), false, true );
      wp_enqueue_style( 'wm-parallax', plugins_url( 'css/wm-parallax.css' , __FILE__ ) );
    }
  }

  public static function admin_enqueue_scripts( $hook_suffix )
  {
    if ( current_user_can( 'edit_posts' ) && ( $hook_suffix === 'post-new.php' || $hook_suffix === 'post.php' ) ) {
      require_once( plugin_dir_path( __FILE__ ) . 'tpl/edit.php' );
      wp_enqueue_media();
      wp_enqueue_script( 'wm-parallax-media', plugins_url( 'js/wm-parallax-media.js' , __FILE__ ), array( 'media-views' ), false, true );
      wp_enqueue_style( 'wm-parallax-media', plugins_url( 'css/wm-parallax-media.css' , __FILE__ ) );
      add_editor_style( plugins_url( 'css/wm-parallax-editor.css' , __FILE__ ) );
    }
  }

  public static function mce_plugin( $plugins )
  {
    $plugins['parallax'] = plugins_url( 'js/wm-parallax-editor.js' , __FILE__ );
    return $plugins;
  }

  public static function media_view_strings( $strings )
  {
    return array_merge( $strings, array(
      'createNewParallax'   => __( 'Create a new parallax' ),
  		'createParallaxTitle' => __( 'Create Parallax' ),
  		'editParallaxTitle'   => __( 'Edit Parallax' ),
  		'cancelParallaxTitle' => __( '&#8592; Cancel Parallax' ),
  		'insertParallax'      => __( 'Insert parallax' ),
  		'updateParallax'      => __( 'Update parallax' ),
  		'addToParallax'       => __( 'Add to parallax' ),
  		'addToParallaxTitle'  => __( 'Add to Parallax' ),
  		'deleteParallaxTitle' => __( 'Delete Parallax' )
    ) );
  }

  public static function shortcode( $atts ) {
    $ids = explode( ',', $atts['ids'] );
    if ( $count = count( $ids ) - 1 ) {
      $atts = shortcode_atts( self::$behaviors, $atts, 'parallax' );
      $output = '<div class="wm-parallax"><ul';
      foreach ( self::$behaviors as $data => $default ) {
        $value = isset( $atts[$data] ) ? $atts[$data] : $default;
        $data = str_replace( '_', '-', $data );
        $output .= " data-{$data}='{$value}'";
      }
      $output .= '>';
      foreach ( $ids as $i => $id ) {
        $depth = $i / $count;
        $img = wp_get_attachment_image( $id, 'large' );
        $output .= "<li class='layer' data-depth='{$depth}'>{$img}</li>";
      }
      return $output . '</ul></div>';
    }
    return '';
  }

  // The previous version of this plugin used post types...
  public function update_plugin() {
    if ( ! get_option( 'wm-parallax-version' ) ) {
      register_post_type( 'parallax', array( 'public' => false ) );
      $effects = get_posts( array( 'numberposts' => -1, 'post_type' => 'parallax' ) );
      if ( ! empty( $effects ) ) {
        $old = $new = array();
        foreach ( $effects as $parallax ) {
          $attachments = get_posts( array(
            'numberposts' => -1,
            'post_type' => 'attachment',
			      'post_mime_type' => 'image/png, image/gif',
            'post_parent' => $parallax->ID,
            'orderby' => 'menu_order',
            'exclude' => get_post_thumbnail_id( $parallax->ID )
          ) );
          $ids = array();
          foreach ( $attachments as $image ) { $ids[] = $image->ID; }
          $old[] = "/\[[\s]?parallax[\s]+id=[\"|\'][\s]?{$parallax->ID}[\s]?[\"|\'][\s]?\]/";
          $new[] = '[parallax ids="' . implode( ',', $ids ) . '"]';
        }
        $posts = get_posts( array( 'numberposts' => -1, 'post_type' => 'any' ) );
        foreach ( $posts as $post ) {
          $content = preg_replace( $old, $new, $post->post_content, -1, $count );
          if ( $count > 0 ) {
            wp_update_post( array( 'ID' => $post->ID, 'post_content' => $content ) );
          }
        }
      }
      $data = get_plugin_data( __FILE__, false );
      update_option( 'wm-parallax-version', $data['Version'] );
    }
  }
}
add_action( 'init', array( WM_Parallax, 'init' ) );
