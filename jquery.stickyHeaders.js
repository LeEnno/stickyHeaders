;
(function($) {

	// DEFAULTS
	// -------------------------------------------------------------------------

	var pluginName = 'stickyHeaders',
		defaults = {
			headlineSelector: '.sticky-header',
			hiddenClass: 'sticky-header-hidden',
			stickyElement: 'h2',
			stickyClass: 'sticky-helper',
			stickyChildren: '<span></span>',
			textContainerSelector: 'span',
			endOfScrollPos: null,
			stickyStart: 0
		};

	// CONSTRUCTOR
	// -------------------------------------------------------------------------

	function StickyHeaders(el, options) {
		this.$el = $(el);
		this.options = $.extend({}, defaults, options);

		// jQuery Objects
		this.$headers = null;

		// custom Objects consisting of jQuery Object, height, top offset and
		// text
		this.headers = [];

		// header container count
		this.headerLength = 0;

		// sticky container
		this.$sticky = null;

		// sticky offset
		this.stickyStart = 0;

		// sticky container text wrapper
		this.$stickyText = null;

		// position of wrapper for all headers
		this.navWrapPos = 0;

		// position where sticky-scrolling should end
		this.endOfScrollPos = null;

		// status container
		this.lastStatus = {
			isFixed: false,
			index: 0
		};

		// let's get it on
		this.init();
	}

	// PROTOTYPE
	// -------------------------------------------------------------------------

	StickyHeaders.prototype = {

		// create sticky container and bind events
		init: function() {
			this.$sticky = $('<' + this.options.stickyElement + ' />').wrapInner(this.options.stickyChildren).addClass(this.options.stickyClass + ' ' + this.options.hiddenClass).prependTo(this.$el);
			this.$stickyText = this.$sticky.find(this.options.textContainerSelector);
			this.buildHeaderCache();

			var _this = this;
			$(window).on('load stickyHeadersRebuildCache', function() {
				_this.buildHeaderCache();
			}).on('scroll touchmove', function() {
				_this.updateSticky();
			});
		},

		// update sticky on scoll
		updateSticky: function() {
			var scrollPos = window.pageYOffset || window.scrollY,
				i = 0;

			// are we above first header?
			if (scrollPos < this.headers[i].pos) {
				if (this.lastStatus.index == i && !this.lastStatus.isFixed)
					return;

				this.disableSticky(this.headers[i].pos, i);

				// are we below last header?
			} else if (!!this.endOfScrollPos && scrollPos > this.endOfScrollPos - this.headers[this.headerLength - 1].height) {
				if (this.lastStatus.index == this.headerLength - 1 && !this.lastStatus.isFixed)
					return;

				this.disableSticky(this.endOfScrollPos - this.headers[this.headerLength - 1].height, this.headerLength - 1);

				// we are between start of first and end of last header
			} else {
				var updateComplete = false;

				for (i = this.headerLength - 1; !updateComplete; i--) {

					// are we in transition between 2 headers?
					if (i + 1 < this.headerLength && scrollPos + this.headers[i].height >= this.headers[i + 1].pos) {
						if (this.lastStatus.index == i && !this.lastStatus.isFixed)
							return;

						this.disableSticky(this.headers[i + 1].pos - this.headers[i].height, i);
						updateComplete = true;

						// are we below current header?
					} else if (scrollPos >= this.headers[i].pos) {
						if (this.lastStatus.index == i && this.lastStatus.isFixed)
							return;

						this.enableSticky(i);
						updateComplete = true;
					}
				}
			}
		},

		// make sticky container fixed and position it at 'stickyStart'
		enableSticky: function(currentIndex) {
			this.$sticky.removeClass(this.options.hiddenClass).addClass('is-sticky').css({position: 'fixed', top: this.options.stickyStart});

			this.updateTextAndClassesAndStatus(currentIndex, true);
		},

		// make sticky container absolute and position it accordingly
		disableSticky: function(targetPosition, currentIndex) {
			this.$sticky.removeClass(this.options.hiddenClass + ' is-sticky').css({
				position: 'absolute',
				top: targetPosition - this.navWrapPos
			});

			this.updateTextAndClassesAndStatus(currentIndex, false);
		},

		// when positioning is done: update sticky container text, header
		// classes and status
		updateTextAndClassesAndStatus: function(currentIndex, isFixed) {
			this.$stickyText.text(this.headers[currentIndex].text);

			this.$headers.not(this.headers[currentIndex].$el).removeClass(this.options.hiddenClass);

			this.headers[currentIndex].$el.addClass(this.options.hiddenClass);

			this.lastStatus = {
				isFixed: isFixed,
				index: currentIndex
			};
		},

		// recalculate header element's positions etc.
		buildHeaderCache: function() {
			var _this = this;

			this.navWrapPos = (this.$el.offset().top) - this.options.stickyStart;
			this.$headers = $(this.options.headlineSelector).not("." + this.options.stickyClass);
			this.headerLength = this.$headers.length;

			this.headers = [];
			this.$headers.each(function(i, el) {
				var $el = $(el);
				_this.headers.push({
					$el: $el,
					height: $el.outerHeight(),
					pos: ($el.offset().top) - _this.options.stickyStart,
					text: $el.text()
				});
			});

			// fix for wrong endOfScrollPos when images take too long to render
			if (!this.endOfScrollPos && !!this.options.endOfScrollPos)
				this.endOfScrollPos = typeof this.options.endOfScrollPos == 'function'
					? this.options.endOfScrollPos()
					: this.options.endOfScrollPos;
			}
		};

	// REGISTER PLUGIN
	// -------------------------------------------------------------------------

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new StickyHeaders(this, options));
			}
		});
	};

})(jQuery);
