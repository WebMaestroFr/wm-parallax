(function () {
  'use strict';
  tinymce.create('tinymce.plugins.parallax', {
    init : function (ed, url) {
      var t = this;
      t.url = url;
      t.editor = ed;
      t._createButtons();
      ed.addCommand('Parallax', function () {
        if (tinymce.isIE) { ed.selection.moveToBookmark(ed.parallaxBookmark); }
        var el = ed.selection.getNode(),
          parallax = wp.media.parallax,
          frame;
        if (wp === 'undefined' || !wp.media || !wp.media.parallax) { return; }
        if (el.nodeName !== 'IMG' || ed.dom.getAttrib(el, 'class').indexOf('wm-parallax') === -1) { return; }
        frame = parallax.edit('[' + ed.dom.getAttrib(el, 'title') + ']');
        frame.state('parallax-edit').on('update', function (selection) {
          var shortcode = parallax.shortcode(selection).string().slice(1, -1);
          ed.dom.setAttrib(el, 'title', shortcode);
        });
      });
      ed.onInit.add(function (ed) {
        if (window.hasOwnProperty('ontouchstart')) {
          ed.dom.events.add(ed.getBody(), 'touchstart', function (e) {
            var target = e.target;
            if (target.nodeName === 'IMG' && ed.dom.hasClass(target, 'wm-parallax')) {
              ed.selection.select(target);
              ed.dom.events.cancel(e);
              ed.plugins.parallax._hideButtons();
              ed.plugins.wordpress._showButtons(target, 'parallaxbtns');
            }
          });
        }
        tinymce.dom.Event.add(ed.getWin(), 'scroll', function () {
          ed.plugins.parallax._hideButtons();
        });
        tinymce.dom.Event.add(ed.getBody(), 'dragstart', function () {
          ed.plugins.parallax._hideButtons();
        });
      });
      ed.onMouseDown.add(function (ed, e) {
        ed.plugins.parallax._hideButtons();
        if (e.target.nodeName === 'IMG' && ed.dom.hasClass(e.target, 'wm-parallax')) {
          ed.plugins.wordpress._showButtons(e.target, 'parallaxbtns');
        }
      });
      ed.onBeforeSetContent.add(function (ed, o) {
        o.content = t._do_parallax(o.content);
      });
      ed.onPostProcess.add(function (ed, o) { if (o.get) {
        o.content = t._get_parallax(o.content);
      } });
      ed.onBeforeExecCommand.add(function (ed) {
        ed.plugins.parallax._hideButtons();
      });
      ed.onSaveContent.add(function (ed) {
        ed.plugins.parallax._hideButtons();
      });
      ed.onKeyDown.add(function (ed, e) {
        if (e.which === tinymce.VK.DELETE || e.which === tinymce.VK.BACKSPACE) { ed.plugins.parallax._hideButtons(); }
      });
    },
    _do_parallax : function (co) {
      return co.replace(/\[parallax([^\]]*)\]/g, function (a, b) {
        return '<img src="' + tinymce.baseURL + '/plugins/wpgallery/img/t.gif" class="wm-parallax mceItem" title="parallax' + tinymce.DOM.encode(b) + '" />';
      });
    },
    _get_parallax : function (co) {
      function getAttr(s, n) {
        n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);
        return n ? tinymce.DOM.decode(n[1]) : '';
      }
      return co.replace(/(?:<p[^>]*>)*(<img[^>]+>)(?:<\/p>)*/g, function (a, im) {
        var cls = getAttr(im, 'class');
        if (cls.indexOf('wm-parallax') !== -1) { return '<p>[' + tinymce.trim(getAttr(im, 'title')) + ']</p>'; }
        return a;
      });
    },
    _createButtons : function () {
      var ed = tinymce.activeEditor, DOM = tinymce.DOM, editButton, dellButton, isRetina;
      if (DOM.get('parallaxbtns')) { return; }
      isRetina = (window.devicePixelRatio && window.devicePixelRatio > 1) || // WebKit, Opera
        (window.matchMedia && window.matchMedia('(min-resolution:130dpi)').matches); // Firefox, IE10, Opera
      DOM.add(document.body, 'div', { id : 'parallaxbtns', style : 'display:none;' });
      editButton = DOM.add('parallaxbtns', 'div', {
        class : 'dashicons dashicons-edit',
        id : 'editparallax',
        title : wp.media.view.l10n.editParallaxTitle
      });
      dellButton = DOM.add('parallaxbtns', 'div', {
        class : 'dashicons dashicons-no',
        id : 'delparallax',
        title : wp.media.view.l10n.deleteParallaxTitle
      });
      tinymce.dom.Event.add(editButton, 'mousedown', function () {
        ed.parallaxBookmark = ed.selection.getBookmark('simple');
        ed.execCommand('Parallax');
        ed.plugins.parallax._hideButtons();
      });
      tinymce.dom.Event.add(dellButton, 'mousedown', function (e) {
        var el = ed.selection.getNode();
        if (el.nodeName === 'IMG' && ed.dom.hasClass(el, 'wm-parallax')) {
          ed.dom.remove(el);
          ed.execCommand('mceRepaint');
          ed.dom.events.cancel(e);
        }
        ed.plugins.parallax._hideButtons();
      });
    },
    _hideButtons : function () {
      var DOM = tinymce.DOM;
      DOM.hide(DOM.select('#parallaxbtns'));
    },
    getInfo : function () {
      return {
        longname : 'Parallax Settings',
        author : 'WebMaestro',
        authorurl : 'http://webmaestro.fr',
        infourl : '',
        version : '1.0'
      };
    }
  });
  tinymce.PluginManager.add('parallax', tinymce.plugins.parallax);
  wp.media.editor.insertParallax = function (h) {
    var qt = (QTags !== 'undefined'),
      ed = tinymce.activeEditor,
      wpActiveEditor = window.wpActiveEditor;
    if (ed && !ed.isHidden()) {
      if (tinymce.isIE && ed.windowManager.insertimagebookmark) { ed.selection.moveToBookmark(ed.windowManager.insertimagebookmark); }
      if (h.indexOf('[parallax') !== -1) {
        if (ed.plugins.parallax) { h = ed.plugins.parallax._do_parallax(h); }
      }
      ed.execCommand('mceInsertContent', false, h);
    } else if (qt) {
      QTags.insertContent(h);
    } else { document.getElementById(wpActiveEditor).value += h; }
    if (window.tb_remove) { try { window.tb_remove(); } catch (ignore) {} }
  };
}());
