<script type="text/html" id="tmpl-editor-parallax">
	<div class="toolbar">
		<div class="dashicons dashicons-edit edit"></div><div class="dashicons dashicons-no-alt remove"></div>
	</div>
	<# if ( data.attachments ) { #>
		<div class="wm-parallax"><ul>
			<# _.each( data.attachments, function( attachment, index ) { #>
				<li><img src="{{ attachment.thumbnail.url }}" /></li>
			<# } ); #>
		</ul></div>
	<# } else { #>
		<div class="wpview-error">
			<div class="dashicons dashicons-images-alt"></div><p><?php _e( 'No items found.' ); ?></p>
		</div>
	<# } #>
</script>
