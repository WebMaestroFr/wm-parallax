(function ($, _) {
  'use strict';
  var media = wp.media,
    l10n = media.view.l10n,
    mediaFrame = media.view.MediaFrame.Post;

  // MODEL
  media.parallax = new media.collection({
    tag: 'parallax',
    type : 'image',
    editTitle : media.view.l10n.editParallaxTitle,
    defaults : {
      'calibrate_x': false,
      'calibrate_y': true,
      'invert_x': true,
      'invert_y': true,
      'limit_x': false,
      'limit_y': false,
      'scalar_x': 10.0,
      'scalar_y': 10.0,
      'friction_x': 0.5,
      'friction_y': 0.5
    }
  });
  // MODEL

  // VIEWS
  media.view.MediaFrame.Post = mediaFrame.extend({
    createStates: function () {
      var options = this.options;
      mediaFrame.prototype.createStates.apply(this, arguments);
      this.states.add([
        new media.controller.Library({
          id:         'parallax',
          title:      l10n.createParallaxTitle,
          priority:   40,
          toolbar:    'main-parallax',
          filterable: 'uploaded',
          multiple:   'add',
          editable:   false,
          library:  media.query(_.defaults({
            type: 'image'
          }, options.library))
        }),
        new media.controller.ParallaxEdit({
          library: options.selection,
          editing: options.editing,
          menu:    'parallax'
        }),
        new media.controller.ParallaxAdd()
      ]);
    },
    bindHandlers: function () {
      mediaFrame.prototype.bindHandlers.apply(this, arguments);
      this.on('menu:create:parallax', this.createMenu, this);
      this.on('toolbar:create:main-parallax', this.createToolbar, this);
      this.on('menu:render:parallax', this.parallaxMenu, this);
      this.on('toolbar:render:main-parallax', this.mainParallaxToolbar, this);
      this.on('toolbar:render:parallax-edit', this.parallaxEditToolbar, this);
      this.on('toolbar:render:parallax-add', this.parallaxAddToolbar, this);
    },
    parallaxMenu: function (view) {
      var lastState = this.lastState(),
        previous = lastState && lastState.id,
        frame = this;
      view.set({
        cancel: {
          text:     l10n.cancelParallaxTitle,
          priority: 20,
          click:    function () {
            if (previous) {
              frame.setState(previous);
            } else {
              frame.close();
            }
          }
        },
        separateCancel: new media.View({
          className: 'separator',
          priority: 40
        })
      });
    },
    mainParallaxToolbar: function (view) {
      var controller = this;
      this.selectionStatusToolbar(view);
      view.set('parallax', {
        style:    'primary',
        text:     l10n.createNewParallax,
        priority: 60,
        requires: { selection: true },
        click: function () {
          var selection = controller.state().get('selection'),
            edit = controller.state('parallax-edit'),
            models = selection.where({ type: 'image' });
          edit.set('library', new media.model.Selection(models, {
            props:    selection.props.toJSON(),
            multiple: true
          }));
          this.controller.setState('parallax-edit');
        }
      });
    },
    parallaxEditToolbar: function () {
      var editing = this.state().get('editing');
      this.toolbar.set(new media.view.Toolbar({
        controller: this,
        items: {
          insert: {
            style:    'primary',
            text:     editing ? l10n.updateParallax : l10n.insertParallax,
            priority: 80,
            requires: { library: true },
            click: function () {
              var controller = this.controller,
                state = controller.state();
              controller.close();
              state.trigger('update', state.get('library'));
              controller.setState(controller.options.state);
              controller.reset();
            }
          }
        }
      }));
    },
    parallaxAddToolbar: function () {
      this.toolbar.set(new media.view.Toolbar({
        controller: this,
        items: {
          insert: {
            style:    'primary',
            text:     l10n.addToParallax,
            priority: 80,
            requires: { selection: true },
            click: function () {
              var controller = this.controller,
                state = controller.state(),
                edit = controller.state('parallax-edit');
              edit.get('library').add(state.get('selection').models);
              state.trigger('reset');
              controller.setState('parallax-edit');
            }
          }
        }
      }));
    }
  });

  media.controller.ParallaxEdit = media.controller.Library.extend({
    defaults: {
      id:         'parallax-edit',
      multiple:   false,
      describe:   false,
      edge:       199,
      editing:    false,
      sortable:   true,
      searchable: false,
      toolbar:    'parallax-edit',
      content:    'browse',
      title:      l10n.editParallaxTitle,
      priority:   60,
      dragInfo:   true,
      syncSelection: false
    },
    initialize: function () {
      if (!this.get('library')) { this.set('library', new media.model.Selection()); }
      if (!this.get('AttachmentView')) { this.set('AttachmentView', media.view.Attachment.EditLibrary); }
      // Insert initial shortcode
      this.on('update', function (selection) {
        media.editor.insert(media.parallax.shortcode(selection).string());
      });
      // Insert initial shortcode
      media.controller.Library.prototype.initialize.apply(this, arguments);
    },
    activate: function () {
      var library = this.get('library');
      library.props.set('type', 'image');
      this.get('library').observe(wp.Uploader.queue);
      this.frame.on('content:render:browse', this.parallaxSettings, this);
      // Add a class for CSS
      this.frame.$el.addClass('parallax-edit');
      // Add a class for CSS
      media.controller.Library.prototype.activate.apply(this, arguments);
    },
    deactivate: function () {
      this.get('library').unobserve(wp.Uploader.queue);
      this.frame.off('content:render:browse', this.parallaxSettings, this);
      // Remove class
      this.frame.$el.removeClass('parallax-edit');
      // Remove class
      media.controller.Library.prototype.deactivate.apply(this, arguments);
    },
    parallaxSettings: function (browser) {
      var library = this.get('library');
      if (!library || !browser) { return; }
      library.parallax = library.parallax || new Backbone.Model();
      browser.sidebar.set({
        parallax: new media.view.Settings.Parallax({
          controller: this,
          model:      library.parallax,
          priority:   40
        })
      });
      browser.toolbar.set('reverse', {
        text:     l10n.reverseOrder,
        priority: 80,
        click: function () {
          library.reset(library.toArray().reverse());
        }
      });
    }
  });

  media.controller.ParallaxAdd = media.controller.Library.extend({
    defaults: _.defaults({
      id:           'parallax-library',
      filterable:   'uploaded',
      multiple:     'add',
      menu:         'parallax',
      toolbar:      'parallax-add',
      title:        l10n.addToParallaxTitle,
      priority:     100,
      syncSelection: false
    }, media.controller.Library.prototype.defaults),
    initialize: function () {
      if (!this.get('library')) { this.set('library', media.query({ type: 'image' })); }
      media.controller.Library.prototype.initialize.apply(this, arguments);
    },
    activate: function () {
      var library = this.get('library'),
        edit = this.frame.state('parallax-edit').get('library');
      if (this.editLibrary && this.editLibrary !== edit) { library.unobserve(this.editLibrary); }
      library.validator = function (attachment) {
        return !!this.mirroring.get(attachment.cid) && !edit.get(attachment.cid) && media.model.Selection.prototype.validator.apply(this, arguments);
      };
      library.reset(library.mirroring.models, { silent: true });
      library.observe(edit);
      this.editLibrary = edit;
      media.controller.Library.prototype.activate.apply(this, arguments);
    }
  });

  media.view.Settings.Parallax = media.view.Settings.extend({
    className: 'collection-settings parallax-settings',
    template:  media.template('parallax-settings')
  });
  // VIEWS

  // TINYMCE
  wp.mce.parallax = {
    shortcode: 'parallax',
    toView:  function (content) {
      var match = wp.shortcode.next(this.shortcode, content);
      if (!match) { return; }
      return {
        index:   match.index,
        content: match.content,
        options: { shortcode: match.shortcode }
      };
    },
    View: wp.mce.View.extend({
      className: 'editor-parallax',
      template:  media.template('editor-parallax'),
      postID: $('#post_ID').val(),
      initialize: function (options) {
        this.shortcode = options.shortcode;
        this.fetch();
      },
      fetch: function () {
        this.attachments = media.parallax.attachments(this.shortcode, this.postID);
        this.dfd = this.attachments.more().done(_.bind(this.render, this));
      },
      getHtml: function () {
        var attrs = this.shortcode.attrs.named,
          attachments = false,
          options;
        if (this.dfd && 'pending' === this.dfd.state() && !this.attachments.length) { return; }
        if (this.attachments.length) {
          attachments = this.attachments.toJSON();
          _.each(attachments, function (attachment) {
            if (attachment.sizes && attachment.sizes.thumbnail) {
              attachment.thumbnail = attachment.sizes.thumbnail;
            }
          });
        }
        options = { attachments: attachments };
        return this.template(options);
      }
    }),
    edit: function (node) {
      var parallax = media.parallax,
        self = this,
        frame,
        data;
      data = window.decodeURIComponent($(node).attr('data-wpview-text'));
      frame = parallax.edit(data);
      // Deactivate initial shortcode insertion
      frame.state('parallax-edit').off('update');
      // Deactivate initial shortcode insertion
      frame.state('parallax-edit').on('update', function (selection) {
        var shortcode = parallax.shortcode(selection).string();
        $(node).attr('data-wpview-text', window.encodeURIComponent(shortcode));
        wp.mce.views.refreshView(self, shortcode);
        frame.detach();
      });
    }
  };
  wp.mce.views.register('parallax', wp.mce.parallax);
  // TINYMCE

}(jQuery, _));
