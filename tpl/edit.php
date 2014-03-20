<?php

add_action( 'print_media_templates', 'wm_parallax_print_media_templates' );
function wm_parallax_print_media_templates() { ?>

  <script type="text/html" id="tmpl-parallax-settings">

		<h3><?php _e('Calibrate'); ?></h3>
		<label class="setting">
			<span><?php _e('X axis'); ?></span>
			<input type="checkbox" data-setting="calibrate_x" value="1">
		</label>
    <label class="setting">
      <span><?php _e('Y axis'); ?></span>
      <input type="checkbox" data-setting="calibrate_y" value="1" checked />
    </label>
    <p><?php _e( 'Cache & calculate the motion on initialisation.'); ?></p>

    <h3><?php _e('Invert'); ?></h3>
    <label class="setting">
      <span><?php _e('X axis'); ?></span>
      <input type="checkbox" data-setting="invert_x" value="1" checked>
    </label>
    <label class="setting">
      <span><?php _e('Y axis'); ?></span>
      <input type="checkbox" data-setting="invert_y" value="1" checked>
    </label>
    <p><?php _e( 'Move layers in opposition to the device motion.'); ?></p>

    <h3><?php _e('Limit'); ?></h3>
    <label class="setting">
      <span><?php _e('X axis'); ?></span>
      <input type="number" data-setting="limit_x" value="0">
    </label>
    <label class="setting">
      <span><?php _e('Y axis'); ?></span>
      <input type="number" data-setting="limit_y" value="0">
    </label>
    <p><?php _e( 'Total range of motion <em>(0 allows layers to move with complete freedom)</em>.'); ?></p>

    <h3><?php _e('Scalar'); ?></h3>
    <label class="setting">
      <span><?php _e('X axis'); ?></span>
      <input type="number" data-setting="scalar_x" value="10.0">
    </label>
    <label class="setting">
      <span><?php _e('Y axis'); ?></span>
      <input type="number" data-setting="scalar_y" value="10.0">
    </label>
    <p><?php _e( 'Increase or decrease motion sensitivity.'); ?></p>

    <h3><?php _e('Friction'); ?></h3>
    <label class="setting">
      <span><?php _e('X axis'); ?></span>
      <input type="number" data-setting="friction_x" value="0.1">
    </label>
    <label class="setting">
      <span><?php _e('Y axis'); ?></span>
      <input type="number" data-setting="friction_y" value="0.1">
    </label>
    <p><?php _e( 'Amount of friction <em>(adds some easing to the motion)</em>.'); ?></p>

	</script>

<?php }
