/**
 * Created by Umut on 27/01/16.
 */

;( function( $, window, undefined ) {

    'use strict';

    // global
    var Modernizr = window.Modernizr, $body = $( 'body' );

    $.UShifter = function( options, element ) {
        this.$el = $( element );
        this._init( options );

    };

    // the options
    $.UShifter.defaults = {
        // callback: click a link that has a sub menu
        // el is the link element (li); name is the level name
        onLevelClick : function( el, name ) { return false; },
        // callback: click a link that does not have a sub menu
        // el is the link element (li); ev is the event obj
        onLinkClick : function( el, ev ) { return false; }
    };

    $.UShifter.prototype = {
        
        _init : function( options ) {
            // options
            this.options = $.extend( true, {}, $.UShifter.defaults, options );
            // cache some elements and initialize some variables
            this._config();

            var animEndEventNames = {
                    'WebkitAnimation' : 'webkitAnimationEnd',
                    'OAnimation' : 'oAnimationEnd',
                    'msAnimation' : 'MSAnimationEnd',
                    'animation' : 'animationend'
                },
                transEndEventNames = {
                    'WebkitTransition' : 'webkitTransitionEnd',
                    'MozTransition' : 'transitionend',
                    'OTransition' : 'oTransitionEnd',
                    'msTransition' : 'MSTransitionEnd',
                    'transition' : 'transitionend'
                };
            // animation end event name
            this.animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ] + '.ushifter';
            // transition end event name
            this.transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ] + '.ushifter',
                // support for css animations and css transitions
                this.supportAnimations = Modernizr.cssanimations,
                this.supportTransitions = Modernizr.csstransitions;

            this._initEvents();
        },
        _config : function() {
            this.open = true;
			this.$wrapper = this.$el;
            this.$view = this.$el.children( '.u-view.open' );
			
			var views = this.$wrapper.find('.u-view');
			for (var i = 0; i < views.length; i++){
				views[i].setAttribute('data-order', i + 1);
			}
        },
        _initEvents : function() {
        },
        // resets the menu to its original state (first level of options)
        /*
        _resetMenu : function() {
            this.$view.removeClass( 'u-subview' );
            this.$menuitems.removeClass( 'u-subview u-subviewopen' );
        },
        */
		goToView : function ( viewName ) {
			var self = this;
			
			var $viewIn = $(viewName);
			var $viewOut = $(self.$wrapper.find('.open'));
			
			var classIn, classOut;
			
			if($viewIn.data('order') > $viewOut.data('order')){
				classIn = 'rightToIn';
				classOut = 'leftToOut';
			} else {
				classIn = 'leftToIn';
				classOut = 'rightToOut';
			}
			
			var $flyin = $viewIn.clone().css('opacity', 0).insertAfter($viewOut);

			setTimeout( function () {
				$flyin.addClass( classIn );
				$viewOut.addClass( classOut );
				
				if(self.supportAnimations) {
					$viewOut.on(self.animEndEventName, onAnimationEndFn);
				} else {
					onAnimationEndFn.call();
				}
			});
			
			var onAnimationEndFn = function () {
				$viewOut.off( self.animEndEventName ).removeClass( classOut ).removeClass('open');
				$viewIn.addClass('open');
				$flyin.remove();
			};
		}
    };

    var logError = function( message ) {
        if ( window.console ) {
            window.console.error( message );
        }
    };


    $.fn.ushifter = function( options ) {
        if ( typeof options === 'string' ) {
            var args = Array.prototype.slice.call( arguments, 1 );
            this.each(function() {
                var instance = $.data( this, 'ushifter' );
                if ( !instance ) {
                    logError( "cannot call methods on ushifter prior to initialization; " +
                        "attempted to call method '" + options + "'" );
                    return;
                }
                if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
                    logError( "no such method '" + options + "' for ushifter instance" );
                    return;
                }
                instance[ options ].apply( instance, args );
            });
        }
        else {
            return this.each(function() {
                var instance = $.data( this, 'ushifter' );
                if ( instance ) {
                    instance._init();
                }
                else {
                    instance = $.data( this, 'ushifter', new $.UShifter( options, this ) );
                }
            });
        }
        return this;
    };

} )( jQuery, window );


