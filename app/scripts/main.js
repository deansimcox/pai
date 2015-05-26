'use strict';

/* globals Power2, Sine, TimelineLite, TweenLite, Vivus, smoothScrollTo, debounce, once */

;(function(win, doc, $){

	$(function(){

		/*
		 *	VARS
		 */

		var stage = {
			el: $('.stage'),
			prevEl: $('.stage-controls-prev'),
			nextEl: $('.stage-controls-next'),
			progress: $('.stage-progress'),
			current: 1,
			amount: $('.stage .screen').length,
			ease: Power2.easeInOut
		};

		var icons = {
			belt: $('#belt-icon'),
			plane: $('.icon-plane'),
			attendant: $('#attendant-icon'),
			newxtArrow: $('#next-arrow-icon')
		};

		var highlight = {
			h1: $('.highlight-1'),
			h2: $('.highlight-2'),
			h3: $('.highlight-3'),
			h4: $('.highlight-4'),
			h5: $('.highlight-5'),
			h6: $('.highlight-6'),
			h7: $('.highlight-7')
		};

		var teamMembers = $('.team__member'),
		body = $('body'),
		planeEl = $('.plane'),
		planeSeat = $('.plane__seat'),
		loader = $('.screen-loader'),
		h5Scroll = $('.highlight-5__scroll'),
		h5Hover = $('.highlight-5__hover'),
		memberImgSingle = function(parent, not){
			var img = $('.team__member-img').filter(function(){
				return $(this).parents(parent).length === not && $(this).parents('.stage-2').length === 0;
			});
			return img;
		};

		var hideControls = function(timeline, instant){
			if( instant ){
				timeline.staggerTo([stage.prevEl, stage.nextEl, stage.progress], 0, {y: 20, opacity: 0}, 0);
			} else {
				timeline.staggerTo([stage.prevEl, stage.nextEl, stage.progress], 0.2, {y: 20, opacity: 0}, 0.2);
			}
		};

		var showControls = function(timeline){
			timeline.staggerTo([stage.prevEl, stage.nextEl, stage.progress], 0.2, {y: 0, opacity: 1}, 0.2);
		};


		/*
		 *	FUNCTIONS
		 */

		var vivusReset = function(selector){
			var el = doc.querySelector( selector );
			if(typeof el.getTotalLength === 'function'){
				var elLength = el.getTotalLength();
				elLength = Math.ceil(elLength);
				$(el).css('stroke-dasharray', ''+elLength+'px, '+(elLength+2)+'px').css('stroke-dashoffset', ''+elLength+'px');
			}
		};

		var planeAnimOnce = once(function(){			
			TweenLite.to(icons.plane, 1.8, {x: 0, y: 0, opacity: 1, onComplete: function(){
				new Vivus('plane', {type: 'async', duration: 30, animTimingFunction: Vivus.EASE_OUT});
			}});
		});

		var stageItems = function(){

			var tStageItems = new TimelineLite();

			$('.btn-point-'+stage.newStage, stage.progress).addClass('active');

			// stage 1
			if(stage.newStage === 1){
				planeAnimOnce();
				new Vivus('belt', {type: 'async', duration: 110, animTimingFunction: Vivus.EASE_OUT});
				tStageItems.to(icons.belt, 0.6, {y: 0, opacity: 1, delay: 1.1});
			} else {
				vivusReset('#belt-circle');
				TweenLite.to(icons.belt, 0, {y: 20, opacity: 0});
			}

			// stage 2
			if(stage.newStage === 2){
				tStageItems.staggerTo(teamMembers, 0.45, {y: 0, opacity: 1, scale: 1, ease: stage.ease}, 0.25);
			} else {
				tStageItems.to(teamMembers, 0, {y: 50, opacity: 0, scale: 0.9});
			}

			// stages 3 - 7 the people stages
			if( stage.newStage === 3 || stage.newStage === 4 || stage.newStage === 5 || stage.newStage === 6 || stage.newStage === 7 ){
				tStageItems.to( memberImgSingle('.stage-'+stage.newStage, 0), 0, {y: 50, opacity: 0, scale: 0.9});
				tStageItems.to( memberImgSingle('.stage-'+stage.newStage, 1), 0.45, {y: 0, opacity: 1, scale: 1, ease: stage.ease});
			} else {
				tStageItems.to( memberImgSingle('.stage-'+stage.newStage, 0), 0, {y: 50, opacity: 0, scale: 0.9});
			}

			// stage 8
			if(stage.newStage === 8){
				new Vivus('next-arrow', {type: 'async', duration: 110, animTimingFunction: Vivus.EASE_OUT});
				tStageItems.to(icons.newxtArrow, 0.6, {x: 0, opacity: 1, delay: 1.1});
			} else {
				vivusReset('#next-arrow-circle');
				TweenLite.to(icons.newxtArrow, 0, {x: -20, opacity: 0});
			}

			// stages 9 - 14 The highlight stages
			if( stage.newStage === 9 || stage.newStage === 10 || stage.newStage === 11 || stage.newStage === 12 || stage.newStage === 13 || stage.newStage === 14 || stage.newStage === 15 ){

				var newHighlight = stage.newStage - 8;

				hideControls(tStageItems);

				if(stage.newStage === 13) {

					tStageItems.to( highlight['h' + newHighlight] , 1, {y: -73, ease: Sine.easeOut});
					tStageItems.to( h5Scroll , 1, {x: '-100%'});
					tStageItems.to( h5Hover , 1, {opacity: 1});

				} else {

					var hHeight = highlight['h' + newHighlight].outerHeight();
					tStageItems.to( highlight['h' + newHighlight] , (hHeight / 300), {y: (- hHeight + 588), ease: Sine.easeOut});
					tStageItems.to( h5Scroll , 0, {x: '0%'});
					tStageItems.to( h5Hover , 0, {opacity: 0});

				}

				for(var i = 0; i < Object.keys(highlight).length; i++){
					if(highlight['h' + (i + 1)] !== highlight['h' + newHighlight]){
						tStageItems.to( highlight['h' + (i + 1)] , 0, {y: 0});
					}
				}
				showControls(tStageItems);
			}

			// stage 15 - last stage
			if(stage.newStage === 16){
				new Vivus('attendant', {type: 'async', duration: 110, animTimingFunction: Vivus.EASE_OUT});
				tStageItems.to( icons.attendant, 0.8, {opacity: 1, y: 0, delay: 1, ease: stage.ease});
			} else {
				vivusReset('#attendant-circle');
				tStageItems.to( icons.attendant, 0, {opacity: 0, y: 20});
			}

		};

		var goToStage = function(newStage){

			if( newStage >= 0 && newStage < stage.amount ){

				stage.newStage = newStage;

				var tStage = new TimelineLite();

				tStage.to(stage.el, 1, {x: ''+ (newStage * -100) +'%', ease: stage.ease, onComplete: stageItems});

				stage.el.attr('data-stage-current', newStage);

				if( newStage === 0 ){
					tStage.staggerTo([stage.prevEl, stage.nextEl, stage.progress], 0.2, {y: 20, opacity: 0}, 0.2);
				} else if(newStage === stage.amount -1) {
					tStage.to(stage.nextEl, 0.2, {y: 20, opacity: 0});
				} else {
					tStage.staggerTo([stage.prevEl, stage.nextEl, stage.progress], 0.2, {y: 0, opacity: 1}, 0.2);
				}

				$('.active', stage.progress).removeClass('active');

				stage.current = newStage;

			}

		};
		stage.goTo = goToStage;
		win.stage = stage;

		$('[data-stage-go]').on('click',function(){
			var stageNumber = $(this).data('stage-go');
			goToStage(parseInt(stageNumber));
		});
		$('[data-stage-next]').on('click',function(){
			goToStage(stage.current+1);
		});
		$('[data-stage-prev]').on('click',function(){
			goToStage(stage.current-1);
		});

		
		var resizeScale = function(func){
			var wWidth = $(win).outerWidth();
			if( wWidth < 1907){
				var wHeight = $(win).outerHeight();
				var newScale = wWidth / 1907;
				planeEl.attr('style', '-webkit-transform: scale('+newScale+');-moz-transform: scale('+newScale+');-ms-transform: scale('+newScale+');-o-transform: scale('+newScale+');transform: scale('+newScale+');height:'+wHeight+'px;');
				if(typeof func === 'function'){
					func( newScale );
				}
			}
		};

		var resizeFuncs = debounce(function(){

			resizeScale();

		},250);



		/*
		 *	Document ready functions below
		 */

		var intro1 = $('.screen-intro .heading-1');
		var intro2 = $('.screen-intro .heading-2');
		var intro3 = $('.screen-intro .btn-intro');
		var intro4 = $('.screen-intro .disclaimer');

		TweenLite.to(intro1, 0, {y: -50, opacity: 0});
		TweenLite.to(intro2, 0, {y: 20, opacity: 0});
		TweenLite.to(intro3, 0, {x: -10, opacity: 0});
		TweenLite.to(intro4, 0, {opacity: 0});

		var transIntro = function(){

			var tIntro = new TimelineLite();

			tIntro.to(intro1, 1, {y: 0, opacity: 1, ease: stage.ease});
			tIntro.to(intro2, 0.8, {y: 0, opacity: 1, ease: stage.ease});
			tIntro.to(intro3, 0.2, {x: 0, opacity: 1, ease: stage.ease});
			tIntro.to(intro4, 0.6, {opacity: 1, ease: stage.ease});
			
		};

		$('.screen-intro').vide({
			mp4: 'videos/plane.mp4',
			webm: 'videos/plane.webm',
			ogv: 'videos/plane.ogv',
			poster: 'videos/plane.jpg'
		}, {
			volume: 1,
			playbackRate: 1,
			muted: true,
			loop: true,
			autoplay: true,
			position: '50% 50%',
			posterType: 'jpg',
			resizing: false
		}).append('<div class="screen-intro__cover"></div>');

		TweenLite.to($(['.stage-controls button', stage.progress]), 0, {y: 20, opacity: 0});
		TweenLite.to(icons.belt, 0, {y: 20, opacity: 0});
		TweenLite.to(h5Hover, 0, {opacity: 0});
		TweenLite.to(icons.plane, 0, {x: -200, y: 100, opacity: 0});
		TweenLite.to(icons.plane, 0, {x: -200, y: 100, opacity: 0});
		new Vivus('attendant', {type: 'async', duration: 1});

		$(win).on('resize', resizeFuncs);

		$(win).on('load', function(){

			body.addClass('loaded');

			TweenLite.to( loader, 0.5, {y: -25, opacity: 0, onComplete: function(){
				loader.hide().css('height', '0px').css('width', '0px');
			}});

			resizeScale(function(newScale){

				TweenLite.to(planeSeat, 1, {y: 0, onComplete: function(){

					var initialPos = function(){
						var scroll = body[0].scrollHeight * newScale;
						var top = planeSeat.offset().top * newScale;
						return Math.min( scroll, top );
					};
					smoothScrollTo( body[0], initialPos(), 1000 );

					transIntro();

				}});

			});
		});

	});

}(window, document, jQuery));
