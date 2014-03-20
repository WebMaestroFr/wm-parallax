<?php
/*
Plugin Name: WebMaestro Parallax
Plugin URI: http://#
Author: Etienne Baudry
Author URI: http://webmaestro.fr
Description: A parallax media type.
Version: 1.0
License: GNU General Public License
License URI: license.txt
Text Domain: wm-parallax
*/

class WM_Parallax
{
  private static $behaviors = array(
    'calibrate_x' => 'false',
    'calibrate_y' => 'true',
    'invert_x' => 'true',
    'invert_y' => 'true',
    'limit_x' => 'false',
    'limit_y' => 'false',
    'scalar_x' => 10.0,
    'scalar_y' => 10.0,
    'friction_x' => 0.1,
    'friction_y' => 0.1
  );

  public static function init()
  {
    add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ) );
    add_action( 'admin_enqueue_scripts', array( __CLASS__, 'admin_enqueue_scripts' ) );
    add_filter( 'media_view_strings', array( __CLASS__, 'media_view_strings' ) );
    add_shortcode( 'parallax', array( __CLASS__, 'shortcode' ) );
  }

  public static function enqueue_scripts( $hook_suffix )
  {
    wp_register_script( 'parallax', plugins_url( 'js/vendor/jquery.parallax.min.js' , __FILE__ ), 'false', false, true );
    wp_register_script( 'wm-parallax', plugins_url( 'js/wm-parallax.js' , __FILE__ ), array( 'parallax' ), false, true );
    wp_register_style( 'wm-parallax', plugins_url( 'css/wm-parallax.css' , __FILE__ ) );
  }

  public static function admin_enqueue_scripts( $hook_suffix )
  {
    if ( $hook_suffix === 'post-new.php' || $hook_suffix === 'post.php' ) {
      wp_enqueue_media();
      require_once( plugin_dir_path( __FILE__ ) . 'tpl/edit.php' );
      wp_enqueue_script( 'wm-parallax-edit', plugins_url( 'js/wm-parallax-edit.js' , __FILE__ ), array( 'media-views' ), false, true );
      wp_enqueue_style( 'wm-parallax-edit', plugins_url( 'css/wm-parallax-edit.css' , __FILE__ ) );
    }
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
    ) );
  }

  public static function shortcode( $atts ) {
    $ids = explode( ',', $atts['ids'] );
    if ( $count = count( $ids ) - 1 ) {
      $atts = shortcode_atts( self::$behaviors, $atts, 'parallax' );
      wp_enqueue_script( 'wm-parallax' );
      wp_enqueue_style( 'wm-parallax' );
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
}
add_action( 'init', array( WM_Parallax, 'init' ) );
