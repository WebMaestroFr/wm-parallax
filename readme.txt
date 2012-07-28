=== Image Parallax ===
Contributors: WebMaestro.Fr
Donate link: http://webmaestro.fr/blog/2012/image-parallax-plugin-for-wordpress/
Tags: parallax, 3D, image, picture
Requires at least: 3
Tested up to: 3.3.2
Stable tag: 1.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A simple plugin that display images as layers of a parallax effect.

== Description ==

This plugin is based on [Steve Fenton's jQuery Image Parallax](http://www.stevefenton.co.uk/Content/Jquery-Image-Parallax/ "Steve Fenton's jQuery Image Parallax") script. I edited it a lot though.

Well, if you want to generate a kinda 3D "parallax" effect on your pictures in a second (after you spent an hour to separate every single layer and made a .PNG file of each ground) and publish it into your blog post, this is the WordPress Plugin you're searching for !

It create a new post type called "Parallax". You can find it in the "Media" menu.

A "Parallax" post is meant to receive the layers : the .PNG images we were talking about. Simply drag your files into the "Upload Layers" box. After they loaded, make sure that they will display in the right order : from the frontground to the background. You can order them by giving them a number with the tiny form in your "Gallery" list.

The title will be the caption of our effect.

The original picture should be used as featured image. Try to use the <b>same dimensions for every image</b>.

You can also play with the intensity of size difference between the layers, and allow or not the vertical or horizontal mouse control.

After publishing, you'll get the ID of the post (the number after "?post=" in the address bar up there). Keep that number in mind.

In your post, at the place you want to display our effect, write the shortcode [parallax id="THE_NUMBER_I_WAS_TALKING_ABOUT"].

[See the demo](http://webmaestro.fr/blog/2012/image-parallax-plugin-for-wordpress/ "See the demo")<a href=""></a>.

Enjoy !

== Installation ==

1. Upload the plugin folder "image-parallax" to the "/wp-content/plugins/" directory or get it from your dashboard.
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Create a new "Parallax" post through the "Media" menu, upload your layers, organize them and define the original picture as featured image.
5. Place [parallax id="ID_OF_YOUR_PARALLAX_POST"] in any post or page.
6. Enjoy.

== Frequently Asked Questions ==

== Screenshots ==

1. First of all, generate independent .PNG files of each layer of your image. This is the boring step.
2. There is a new post type called "Parallax". You can find it in the "Media" menu. A "Parallax" post is meant to receive the layers : the .PNG images we were talking about. Simply drag your files into the "Upload Layers" box. By the way folks, my WP is in french but the plugin is in english.
3. After they loaded, make sure that they will display in the right order : from the frontground to the background. You can order them by giving them a number in the tiny form next to the "Show". Set your original picture as featured image, set the intensity of the effect, and finally allow horizontal and/or vertical control.
4. Insert the effect in a post, using the shortcode [parallax id="ID_OF_YOUR_PARALLAX_POST"].
5. Enjoy !

== Changelog ==

= 1.3 =
Solved the size issue !

= 1.2 =
Fixed the issues with post-thumbnails support.

= 1.1 =
Updated functions, moved to classes, cleaned the code...
Also fixed the funny opacity problem in the background.

= 1.0 =
Waiting for feed back !

== Upgrade Notice ==

= 1.3 =
Solved the size issue !