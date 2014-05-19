=== Image Parallax ===
Contributors: WebMaestro.Fr
Donate link: http://webmaestro.fr/blog/image-parallax-plugin-for-wordpress/
Tags: parallax, 3D, image, picture
Requires at least: 3.9.1
Tested up to: 3.9.1
Stable tag: 2.0
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Create images with a parallax effect. Upload some layers, configure the animation, and publish !

== Description ==

Upload the layers of your image, and create a parallax effect !

It works great on smart devices too !

The first step is to create with your favorite picture editing software (*Photoshop*, *GIMP*...) an independent image for each ground composing your image. All these layers shall be the **same size**, and should be in **.png** format as they are meant to include transparency areas.
Then, on your post editing page in WordPress, click the *Insert Media* button, and (the same way you would create a gallery) upload your layers under the *Create Parallax* item. Reorganise the layers if needed, from the background to the front.
You can finally configure the animation (calibrate, invert, limit, scalar, friction), and publish !

There is [some examples](http://webmaestro.fr/image-parallax-plugin-wordpress/) on the plugin page.

It uses [parallax.js](http://wagerfield.github.io/parallax/) by Matthew Wagerfield.

== Installation ==

1. Upload `image-parallax` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Create a .png file for each layer
3. Create an effect, upload your layers, and publish !

== Frequently Asked Questions ==

= No question asked =

No answer to give.

== Screenshots ==

1. Upload your layers, organise them, and configure the animation.
2. First of all, generate independent .png files of each layer of your image. This is the boring step.

== Changelog ==

= 2.0 =
New version, now using a media type instead of a post type ! Compatible with WP3.9 !

= 1.3 =
Solved the size issue !
Updated the demo link.

= 1.2 =
Fixed the issues with post-thumbnails support.

= 1.1 =
Updated functions, moved to classes, cleaned the code...
Also fixed the funny opacity problem in the background.

= 1.0 =
Waiting for feed back !

== Upgrade Notice ==

= 2.0 =
New version, now using a media type instead of a post type ! Compatible with WP3.9 !

= 1.3 =
Solved the size issue !
