<?php $default = WM_Parallax::$behaviors; ?>

<script type="text/html" id="tmpl-parallax-settings">
	<# console.log(data); #>
	<h3><?php _e( 'Parallax Settings' ); ?></h3>

  <h4><?php _e( 'Calibrate', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="checkbox" data-setting="calibrate_x" <?php checked( $default['calibrate_x'] ); ?>>
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="checkbox" data-setting="calibrate_y" <?php checked( $default['calibrate_y'] ); ?>>
  </label>
  <p><?php _e( 'Cache & calculate the motion on initialisation.', 'wm-parallax' ); ?></p>

  <h4><?php _e( 'Invert', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="checkbox" data-setting="invert_x" <?php checked( $default['invert_x'] ); ?>>
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="checkbox" data-setting="invert_y" <?php checked( $default['invert_y'] ); ?>>
  </label>
  <p><?php _e( 'Move layers in opposition to the device motion.', 'wm-parallax' ); ?></p>

  <h4><?php _e( 'Limit', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="number" data-setting="limit_x" value="<?php echo $default['limit_x']; ?>" placeholder="<?php _e( 'None', 'wm-parallax' ); ?>">
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="number" data-setting="limit_y" value="<?php echo $default['limit_y']; ?>" placeholder="<?php _e( 'None', 'wm-parallax' ); ?>">
  </label>
  <p><?php _e( 'Total range of motion <em>(empty to allow layers to move with complete freedom)</em>.', 'wm-parallax' ); ?></p>

  <h4><?php _e('Scalar', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="text" data-setting="scalar_x" value="<?php echo $default['scalar_x']; ?>">
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="text" data-setting="scalar_y" value="<?php echo $default['scalar_y']; ?>">
  </label>
  <p><?php _e( 'Increase or decrease motion sensitivity.', 'wm-parallax' ); ?></p>

  <h4><?php _e( 'Friction', 'wm-parallax' ); ?></h4>
  <label class="setting">
    <span><?php _e( 'X axis', 'wm-parallax' ); ?></span>
    <input type="text" data-setting="friction_x" value="<?php echo $default['friction_x']; ?>">
  </label>
  <label class="setting">
    <span><?php _e( 'Y axis', 'wm-parallax' ); ?></span>
    <input type="text" data-setting="friction_y" value="<?php echo $default['friction_y']; ?>">
  </label>
  <p><?php _e( 'Amount of friction <em>(adds some easing to the motion)</em>.', 'wm-parallax' ); ?></p>

</script>
