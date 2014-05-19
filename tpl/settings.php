<script type="text/html" id="tmpl-parallax-settings">
	<h3><?php _e( 'Parallax Settings' ); ?></h3>

  <h4><?php _e( 'Calibrate', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="checkbox" data-setting="calibrate_x">
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="checkbox" data-setting="calibrate_y">
  </label>
  <p><?php _e( 'Cache & calculate the motion on initialisation.', 'wm-parallax' ); ?></p>

  <h4><?php _e( 'Invert', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="checkbox" data-setting="invert_x">
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="checkbox" data-setting="invert_y">
  </label>
  <p><?php _e( 'Move layers in opposition to the device motion.', 'wm-parallax' ); ?></p>

  <h4><?php _e( 'Limit', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="number" data-setting="limit_x" placeholder="<?php _e( 'None', 'wm-parallax' ); ?>">
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="number" data-setting="limit_y" placeholder="<?php _e( 'None', 'wm-parallax' ); ?>">
  </label>
  <p><?php _e( 'Total range of motion <em>(empty to allow layers to move with complete freedom)</em>.', 'wm-parallax' ); ?></p>

  <h4><?php _e('Scalar', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="text" data-setting="scalar_x">
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="text" data-setting="scalar_y">
  </label>
  <p><?php _e( 'Increase or decrease motion sensitivity.', 'wm-parallax' ); ?></p>

  <h4><?php _e( 'Friction', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="text" data-setting="friction_x">
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="text" data-setting="friction_y">
  </label>
  <p><?php _e( 'Amount of friction <em>(adds some easing to the motion)</em>.', 'wm-parallax' ); ?></p>

</script>
