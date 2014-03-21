(function () {
  'use strict';
  var media = wp.media,
    l10n = media.view.l10n,
    mediaFrame = media.view.MediaFrame.Post;
  // MODEL
  media.parallax = (function () {
    var effects = {};
    return {
      defaults: { id: media.view.settings.post.id },
      attachments: function (shortcode) {
        var string = shortcode.string(),
          result = effects[string],
          attrs = _.defaults(shortcode.attrs.named, media.parallax.defaults),
          args = { type: 'image', perPage: -1 },
          query;
        if (result) {
          delete effects[string];
          return result;
        }
        if (attrs.ids) {
          args.post__in = attrs.ids.split(',');
          args.orderby = 'post__in';
        } else {
          args.uploadedTo = attrs.id;
        }
        query = media.query(args);
        query.parallax = new Backbone.Model(_.omit(attrs, 'id', 'ids'));
        return query;
      },
      shortcode: function (attachments) {
        var attrs = { ids: attachments.pluck('id') },
          shortcode = new wp.shortcode({
            tag:    'parallax',
            attrs:  attachments.parallax ? _.extend(attrs, attachments.parallax.toJSON()) : attrs,
            type:   'single'
          });
        effects[shortcode.string()] = new media.model.Attachments(attachments.models, {
          props: attachments.props.toJSON(),
          parallax: attachments.parallax
        });
        return shortcode;
      },
      edit: function (content) {
        var shortcode = wp.shortcode.next('parallax', content),
          postId = media.parallax.defaults.id,
          attachments,
          selection;
        if (!shortcode || shortcode.content !== content) { return; }
        shortcode = shortcode.shortcode;
        if (_.isUndefined(shortcode.get('id')) && !_.isUndefined(postId)) {
          shortcode.set('id', postId);
        }
        attachments = media.parallax.attachments(shortcode);
        selection = new media.model.Selection(attachments.models, {
          props:    attachments.props.toJSON(),
          multiple: true
        });
        selection.parallax = attachments.parallax;
        selection.more().done(function () {
          selection.props.set({ query: false });
          selection.unmirror();
          selection.props.unset('orderby');
        });
        if (this.frame) { this.frame.dispose(); }
        this.frame = media({
          frame:     'post',
          state:     'parallax-edit',
          title:     media.view.l10n.editParallaxTitle,
          editing:   true,
          multiple:  true,
          selection: selection
        }).open();
        return this.frame;
      }
    };
  }());
  // CONTROLLER - Edit
  media.controller.ParallaxEdit = media.controller.Library.extend({
    defaults: {
      id:         'parallax-edit',
      edge:       249,
      sortable:   true,
      searchable: false,
      toolbar:    'parallax-edit',
      content:    'browse',
      menu:       'parallax',
      title:      l10n.editParallaxTitle,
      priority:   60,
      dragInfo:   true,
      syncSelection: false
    },
    initialize: function () {
      if (!this.get('library')) { this.set('library', new media.model.Selection()); }
      if (!this.get('AttachmentView')) { this.set('AttachmentView', media.view.Attachment.EditLibrary); }
      this.on('update', function( selection ) {
        media.editor.insertParallax( media.parallax.shortcode( selection ).string() );
      });
      media.controller.Library.prototype.initialize.apply(this, arguments);
    },
    activate: function () {
      var library = this.get('library');
      library.props.set('type', 'image');
      library.observe(wp.Uploader.queue);
      this.frame.on('content:render:browse', this.parallaxSettings, this);
      this.frame.$el.addClass('parallax-edit');
      media.controller.Library.prototype.activate.apply(this, arguments);
    },
    deactivate: function () {
      this.get('library').unobserve(wp.Uploader.queue);
      this.frame.off('content:render:browse', this.parallaxSettings, this);
      this.frame.$el.removeClass('parallax-edit');
      media.controller.Library.prototype.deactivate.apply(this, arguments);
    },
    parallaxSettings: function (browser) {
      var library = this.get('library');
      if (!library || !browser) { return; }
      library.parallax = library.parallax || new Backbone.Model();
      browser.sidebar.set({ parallax: new media.view.Settings.Parallax({
        controller: this,
        model:      library.parallax,
        priority:   40
      }) });
      browser.toolbar.set('reverse', {
        text:     l10n.reverseOrder,
        priority: 80,
        click: function () { library.reset(library.toArray().reverse()); }
      });
    }
  });
  // CONTROLLER - Add
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
  // VIEW - Settings
  media.view.Settings.Parallax = media.view.Settings.extend({
    className: 'parallax-settings',
    template:  media.template('parallax-settings')
  });
  wp.media.view.MediaFrame.Post = mediaFrame.extend({
    initialize: function () {
      var options = this.options;
      mediaFrame.prototype.initialize.apply(this, arguments);
      this.states.add([
        new media.controller.Library({
          id:         'parallax',
          title:      l10n.createParallaxTitle,
          priority:   41,
          toolbar:    'main-parallax',
          filterable: 'uploaded',
          multiple:   'add',
          editable:   false,
          library: media.query(_.defaults({
            type: 'image'
          }, options.library))
        }),
        new media.controller.ParallaxEdit({
          library: options.selection,
          editing: options.editing
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
          text: l10n.cancelParallaxTitle,
          priority: 20,
          click: function () {
            if (previous) { frame.setState(previous); } else { frame.close(); }
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
        style: 'primary',
        text: l10n.createNewParallax,
        priority: 60,
        requires: { selection: true },
        click: function () {
          var selection = controller.state().get('selection'),
            edit = controller.state('parallax-edit'),
            models = selection.where({ type: 'image' });
          edit.set('library', new media.model.Selection(models, {
            props: selection.props.toJSON(),
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
            style: 'primary',
            text: editing ? l10n.updateParallax : l10n.insertParallax,
            priority: 80,
            requires: { library: true },
            click: function () {
              var controller = this.controller,
                state = controller.state(),
                selection = state.get('library');
              controller.close();
              state.trigger('update', state.get('library'));
// media.editor.insert(media.parallax.shortcode(selection).string());
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
            style: 'primary',
            text: l10n.addToParallax,
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
}(jQuery));
