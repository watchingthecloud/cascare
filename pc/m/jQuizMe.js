﻿// jQuizMe 2.1 by Larry Battle.
//Please give me feedback at blarry@bateru.com
//Copyright (c) 2009 Larry Battle 12/15/2009
//Dual licensed under the MIT and GPL licenses.
//http://www.opensource.org/licenses/mit-license.php
//http://www.gnu.org/licenses/gpl.html
// quizData =[ { ques: "", ans : ""},  {ques: "", ans : ""}, etc ];
// quiz( quizData, options ) # wordsList is an arrary of objects with the following format
alert("hi");
(function($){	
	var _jQuizMeLayOut = jQuery_1_3_2("<div/>").addClass( "quiz-el").append( 
		jQuery_1_3_2("<div/>").addClass( "q-header q-innerArea").append(
			jQuery_1_3_2("<div/>").addClass( "q-counter"),
			jQuery_1_3_2("<div/>").addClass( "q-title")
		),
		jQuery_1_3_2("<div/>").addClass( "q-help q-innerArea").append( 
			jQuery_1_3_2("<div/>").addClass( "q-help-menu" ).append(
				jQuery_1_3_2( "<span/>" ).addClass( "q-quit-area" ).append(
					jQuery_1_3_2( "<input type ='button'/>" ).addClass( "q-quit-btn" ).hide(),
					jQuery_1_3_2( "<input type='button'/>" ).addClass( "q-quitYes-btn q-quit-confirm" ).hide(),
					jQuery_1_3_2( "<input type='button'/>" ).addClass( "q-quitNo-btn q-quit-confirm" ).hide()
				),
				jQuery_1_3_2("<input type='button'/>").addClass( "q-help-btn" ).hide(),									
				jQuery_1_3_2( "<span/>" ).addClass( "q-timer-area" ),
				jQuery_1_3_2("<div/>").addClass( "q-help-info" ).show()
			)
		),
		jQuery_1_3_2("<div/>").addClass( "q-review-menu q-innerArea").append( 
			jQuery_1_3_2("<input type='button'/>").addClass( "q-details-btn q-reviewBar-btns" ),
			jQuery_1_3_2("&nbsp<input type='button'/>").addClass( "q-review-btn q-reviewBar-btns" ),
			jQuery_1_3_2("<div/>").addClass( "q-reviewBar q-innerArea").append(
				jQuery_1_3_2("<input type='button'/>").attr({ "class": "q-leftArrow q-review-arrows", "value": "<-" }),
				jQuery_1_3_2("<input type='button'/>").attr({ "class": "q-rightArrow q-review-arrows", "value": "->" }),
				jQuery_1_3_2( "<span/>" ).addClass( "q-review-nav" ).append(
					jQuery_1_3_2("<select/>").addClass( "q-review-index-all q-review-index"),
					jQuery_1_3_2("<select/>").addClass( "q-review-index-missed q-review-index").hide(),
					jQuery_1_3_2("<span/>").addClass( "q-missMarker" ).show(),
					jQuery_1_3_2("<input type='checkbox'/>").addClass( "q-showOnlyMissed-btn")
				)
			).hide()
		),
		jQuery_1_3_2("<div/>").addClass( "q-intro q-innerArea" ).append(
			jQuery_1_3_2( '<p/>' ).addClass( "q-intro-info" ),
			jQuery_1_3_2( '<input type="button"/>' ).addClass( "q-begin-btn" )
		).hide(),
		jQuery_1_3_2("<div/>").addClass( "q-prob q-innerArea" ).append( 
			jQuery_1_3_2("<div/>").addClass( "q-ques q-probArea"),
			jQuery_1_3_2("<div/>").addClass( "q-ans q-probArea").append(
					jQuery_1_3_2( "<div/>" ).addClass( "q-ansSel" ),
					jQuery_1_3_2( "<input type='button' onClick='pageScroll()'/>" ).addClass( "q-check-btn" )
				),
			jQuery_1_3_2("<div/>").addClass( "q-result q-probArea" ).hide() 
		),
		jQuery_1_3_2("<div/>").addClass( "q-gameOver q-innerArea" ).append(
			jQuery_1_3_2("<div/>").addClass( "q-stat q-probArea").append(
					jQuery_1_3_2("<span/>").addClass( "q-statTotal q-center"),
					jQuery_1_3_2("<hr/>"),
					jQuery_1_3_2("<blockquote/>").addClass( "q-statDetails"),
					jQuery_1_3_2("<div/>").addClass( "q-extraStat" )	
			),
			jQuery_1_3_2("<div/>").addClass( "q-options q-probArea q-center").append( 
				jQuery_1_3_2("<input type='button'/>").addClass( "q-restart-btn" ),
				jQuery_1_3_2("<input type='button'/>").addClass( "q-del-btn" ) 
			)
		).hide()
	);
	
	var areArraysSame = function( mainArr, testArr) {
		if ( mainArr.length != testArr.length ){ return false; }
		var i = mainArr.length;	
		
		while( i-- ) {
			if ( jQuery_1_3_2.isArray( mainArr[i] ) ) { 
				if ( !areArraysSame( mainArr[i], testArr[i] ) ){ return false;}
			}
			if ( mainArr[i] !== testArr[i] ){ return false;}
		}
		return true;
	},
	toHTMLUnicode = function( str ) {
		if( typeof str !== "string" ){ return str; }
		var uni = '', i = str.length, i2 = 0;
		
		while( i-- ){
			uni += "&#" + str.charCodeAt( i2++ ) + ";";
		}
		return uni;
	},
	isMSIE = jQuery_1_3_2.browser.msie,
	_lang = {
			ans:{	// _lang.ans are shown during the display of .q-result, the answer result.
				corrAns: "Correct answer(s):",
				praise: 'Great Job. Right!',
				whyAns: "Info:",
				yourAns: "Your Answer:"
			},
			btn:{	// [ "text", "title" ]
				begin: [ "Begin Quiz" ],
				check: [ "", "Check your answer" ],
				del: [ "Delete", "Delete quiz" ],
				help: [ "", 'Click for help'],
				next: [ "Next", "" ],
				restart: [ "Restart", "Restart the quit over" ],
				details: [ "Details", "View score report" ],
				review: [ "Review", "Review Questions" ],
				showOnlyMissed: [ "   Click to show only incorrect answers." ],
				quit: [ "", "" ],
				quitNo: [ "", "Go Back" ],
				quitYes: [ '', "Yes, quit" ]
			},
			err:{
				badQType: "Invalid quiz type.",
				badKey: " is an invalid key value.",
				error: "Error",	
				noQType: "No quizTypes.",
				noQues: "Quiz has no questions.",
				notArr: "Must be an array.",
				notObj: "Invalid quiz data structure. Must be an array or object."
			},
			stats:{
				right: "Right",
				rate: "Rate",
				score: "Score",
				wrong: "Wrong",
				total: "Total",
				tried: "Tried"
			},
			quiz:{
				tfEqual: " <br/>=<br/> ",
				tfFalse: "False",
				tfTrue: "True"
			}
		},
		setLangBtnTxt = function( lang ){
			var btnCls = [ "begin", "check", "del", "help", "restart", "quit", "quitYes", "quitNo", "review", "details", "showOnlyMissed" ];
			var i = btnCls.length, el;
			
			if( !lang.btn.quitYes[0] ){ lang.btn.quitYes[0] = lang.btn.quit[0] + ""; }
			
			jQuery_1_3_2( ".q-missMarker", _jQuizMeLayOut ).html( lang.btn.showOnlyMissed[0] );
			lang.btn.showOnlyMissed[0] = '';
			while( i-- ){
				el = [".q-", btnCls[ i ], "-btn"].join('');
				jQuery_1_3_2( el, _jQuizMeLayOut ).attr( "value", lang.btn[ btnCls[ i ] ][0] );
				jQuery_1_3_2( el, _jQuizMeLayOut ).attr( "title", lang.btn[ btnCls[ i ] ][1] );
			}
		},	
		_settings = {
			addToEnd: "",  // This is attached to fill in the blank quiz types.
			activeClass: "q-ol-active", // Used on multiple choice, (multiOl), quiz types.
			allQuizType: '', // This sets all questions to this quiz type.
			allRandom: true, // Randomizes all the questions, regardless of quiz type section.
			blockCheck: true, // Blocks the check-button until the user tries to answer.
			disableRestart: false, //Hide or show the restart button on gameOver.
			disableDelete: true, //Hide or show the delete button on gameOver.
			fxType: 2, // animateType [ show/hide, fadeToggle, slideToggle, weight&heightToggle ];
			fxCode: false, //If a function, then this is used for animation. Please refer to animateType[] for examples.
			fxSpeed: "normal", // "fast", "slow", "normal" or numbers. 
			help: '<img class="imageHolder" style="max-height:300px;max-width:280px;" name="imagename" onClick="image1();"/>', // Provide help text/html if needed.
			hoverClass: "q-ol-hover", // Used on multiple choice, (multiOl), quiz types.
			intro: '', // Provide an text/html intro.
			multiLen : 4, // Set the number of multiple choice choices for quizType multi & multiList.
			numOfQuizQues: 10, // Sets the number of questions asked. Must be between 0 and the total questions.
			random: true, // Randomizes all the questions in each quiz type section.
			randomizeAnswers: true, // Randomizes all the questions in each quiz type section.

			review: true, // Allows for review of questions at gameOver.
			showAns: false, // Show the answers after each question.
			showAnsInfo: true, // If provided, show the answers information after each question.
			showHTML: false, //This will show the HTML, by converting to unicode, rather than render it.
			showWrongAns: false,  // If answer is wrong, then show the user's wrong answer after each question.
			statusUpdate: false, // Sends a status Update. Refer to function sendStatus.
			quizType: "fillInTheBlank", // This is only need if you send in an array and not a object with a defined quiz type.
			title: '' // title displayed for quiz.
		};
		
	jQuery_1_3_2.fn.jQuizMe = function( wordList, options, userLang ){
		var settings = jQuery_1_3_2.extend( {}, settings, _settings, options ), 
			lang = jQuery_1_3_2.extend( true, {}, lang, _lang, userLang );		
		setLangBtnTxt( lang );

		return this.each( function(){
			// currQuiz is the output file.(this is what the user sees). jQuery_1_3_2 ( el, currQuiz) must be used when accessing elements.
			var currQuiz = {}, currIndex = 0, stickyEl = this, quit = false, userAns = [], totalQuesLen = 0,
			// The q object is where the quiz data, that was made before the quiz starts, is stored here.
			// Please beware that all the questions are stored linearly. But you can find a quiz type by using index[Max|Min].
			q = {
				// Each index is a question. [ question1, question2, question3,... ]. But not for indexMax|Min and props.
				ans: [], // Answers.
				ansSel: [], // Answer selections, the elements for inputting an answer. Ex. input text box, or a select tag.
				ansInfo: [], // Stores the answer information if provided.
				indexMax: [], // The stopping point index for a quiz type inside the q. ans, ansSel, ansInfo and ques.
				indexMin: [], // The starting point index.
				prop:[], // Stores the quiz types names in order. Used for creation of each.
				ques: [] // Questions.
			},
			stats = { 
				totalQues: 0,
				quesTried: 0,
				// rightAns[] and wrongAns[] keeps an track of the q's answer index, enabling the user to review on gameOver.
				rightAns: [], 
				wrongAns : [],
				accur : function(){
					var x = Math.round( this.rightAns.length / this.quesTried * 10000 ) / 100;
					return ( this.quesTried ) ? x : 0;
				},
				accurTxt : function(){
					return [ this.rightAns.length, "/", this.quesTried," = ", this.accur(), "%"].join('');
				},
				perc : function(){ 
					var x = Math.round( this.rightAns.length / this.totalQues * 10000 );
					return ( this.totalQues ) ? ( x / 100) : 0; 
				},
				percTxt : function(){
					return [ this.rightAns.length, "/", this.numOfQues, " = ", this.perc(), "%"].join('');
				},
				reset : function(){ 
					this.totalQues = totalQuesLen;
					this.quesTried = 0;
					this.rightAns = [];
					this.wrongAns = [];
				}
			},
			// r means random.
			rNum = function( len ){
				return Math.floor( Math.random() * len );
			},
			rBool = function(){
				return ( (rNum( 100 ) % 2) != 1);
			},
			// rAns(): Returns a random answer from either all the questions, or a curtain quiz type.
			// iProp -> index of the desired quiz type.
			rAns = function( iProp, fromAllQues ){
			
			
  			if (settings.randomizeAnswers) {
  				var p = ( fromAllQues ) ? q.prop[ rNum( q.prop.length ) ] : q.prop[ iProp ],
  					ques = wordList[ p ][ rNum( wordList[ p ].length ) ];
        }
        else {
          ques = wordList[p][iProp];
        }
        
        
				return ques.ans;
			},
			makeArrayRandom = function( arr ){
			 			
				var j, x, i = arr.length;
				while( i ){
					j = parseInt(Math.random() * i, 10);
					x = arr[--i]; 
					arr[i] = arr[j];
					arr[j] = x;
				}
				return arr;
			},
			disableMenuBar = function(){
				jQuery_1_3_2( ".q-quit-btn, .q-help-btn", currQuiz ).attr( "disabled", true );
				jQuery_1_3_2( ".q-help-info" ).show();
				jQuery_1_3_2( ".q-help-btn" ).hide();
			},
			// setCheckBtn(): Sets the check button to toggle from "check" to "next". Or just displays "next".
			// "check" shows the answer results, but "next" just changes the question.
			setCheckBtn = function(){
				var isFlashCard = '';
				
				jQuery_1_3_2( ".q-check-btn", currQuiz ).unbind();
				if( settings.showAns ){
					//replaceWith forces the toggle() to reset on check-btn.
					jQuery_1_3_2( ".q-check-btn", currQuiz ).replaceWith( 
						jQuery_1_3_2( ".q-check-btn", _jQuizMeLayOut ).clone(true)
					);
					jQuery_1_3_2( ".q-check-btn", currQuiz ).attr( "disabled", settings.blockCheck ).toggle(
						function( e ){ 
							jQuery_1_3_2( e.target ).attr( "value", lang.btn.next[0] );
							isFlashCard = jQuery_1_3_2 ( currQuiz ).find( ".userInputArea" ).triggerHandler( "getUserAns" );
							displayAnsResult( isFlashCard ); 
							e.preventDefault();
						},
						function( e ){
							jQuery_1_3_2( e.target ).attr( { "disabled": settings.blockCheck, "value": lang.btn.check[0] });
							nextMove();
							e.preventDefault();
						}
					);					
				}
				else{
					jQuery_1_3_2( ".q-check-btn", currQuiz ).attr( {"disabled": settings.blockCheck, "value": lang.btn.next[0] } )
						.click( function( e ){
						
						  alert("hi");
						
							jQuery_1_3_2( e.target ).attr( "disabled", settings.blockCheck );
							isFlashCard = jQuery_1_3_2( currQuiz ).find( ".userInputArea" ).triggerHandler( "getUserAns" );
							displayAnsResult( isFlashCard );
							nextMove();
							e.preventDefault();
						}
					);				
				}
			},
			// setQuitBtn(): Provides a quit confirm action.
			setQuitBtn = function(){
				jQuery_1_3_2( ".q-quitYes-btn", currQuiz ).click( function(){ 
					quit = true;
					nextMove();
				});
				jQuery_1_3_2( ".q-quit-confirm", currQuiz ).click( function(){ 
					jQuery_1_3_2( ".q-quit-confirm", currQuiz ).hide(); //.q-quit-confirm calls both the quitYes and quitNo btns.
					jQuery_1_3_2( ".q-quit-btn", currQuiz ).show();
				});
				jQuery_1_3_2( ".q-quit-btn", currQuiz ).click( function( e ){ 
					jQuery_1_3_2( e.target ).hide();
					jQuery_1_3_2( ".q-quit-confirm", currQuiz ).show();
				}); 
			},
			setTotalQuesLen = function(){	
				var i = q.prop.length, len = 0, numOfQQ = settings.numOfQuizQues;
				
				while( i-- ){
					len += wordList[ q.prop[ i ] ].length; 
				}
				totalQuesLen = ( !numOfQQ || isNaN( numOfQQ ) || numOfQQ > len ) ? len : numOfQQ;
				stats.numOfQues = totalQuesLen;
			},
			// setQuizTypePos(): This stores the position of the beginning and end index of each quiz type.
			// This allows for each quiz type to be pinpointed to in an array.
			setQuizTypePos = function(){
				var i = 0, sum = 0, len = 0;
				
				while( q.prop[ i ] ){ 
					len = wordList[ q.prop[ i ] ].length;
					sum += len; 
					q.indexMax[ i ] = sum - 1;
					q.indexMin[ i ] = sum - len;
					i++;
				}
			},
			// createQuizEl(): Creates new quiz element and sets default button behaviors.
			createQuizEl = function(){
				currQuiz = _jQuizMeLayOut.clone( true ).hide();	// currQuiz hide until ready.
				jQuery_1_3_2( ".q-help-btn", currQuiz).toggle( 
					function(){ animateThis( jQuery_1_3_2( ".q-help-info", currQuiz), 1 ); },
					function(){ animateThis( jQuery_1_3_2( ".q-help-info", currQuiz), 0 ); }
				);
				setTotalQuesLen();
				setQuizTypePos();
				setQuitBtn();
				setCheckBtn();
				if( settings.review ){ setReviewMenu(); }
				jQuery_1_3_2( stickyEl ).append( currQuiz );	
			},
			// cont(): Checks whether the questions are done or if quit was called.
			cont = function(){ 
				var result = ( !quit && ( currIndex < totalQuesLen ) ); 
				if( !result ){ quit = true; }
				return result;
			},
			// animateType[]: Stores animation styles to animate an element.
			animateType = [
				function( el, on ){ el[ ( on ) ? "show" : "hide" ]( 0 );},
				function( el, on, spd ){ el[ ( on ) ? "fadeIn" : "fadeOut" ]( spd );},
				function( el, on, spd ){ el[ ( on ) ? "slideDown" : "slideUp" ]( spd );},
				function( el, on, spd ){ 
					el.animate( { "height": "toggle", "width": "toggle" }, spd ); 
				}
			],
			// animateThis(): Calls animations on an element and/or push a callback function.
			animateThis = function( el, isShown, func ){
				if( isShown > -1 ){ 
					animateType[ settings.fxType ]( el, isShown, settings.fxSpeed ); 
				}
				if( func ){ 
					el.queue( function(){ func();jQuery_1_3_2 (el).dequeue();});
				}
				if( isMSIE && (isShown > 0) ){
					jQuery_1_3_2(el).animate( { opacity: 1} ).css( "display", "block" );
				}
			},
			// setReviewNav(): Adds events and functions to change the review questions being viewed.
			// changeCurrIndex() is main point of focus.
			setReviewNav = function(){
				var qReviewOpt = ".q-review-index:visible option:", 
					qReviewOptVal = qReviewOpt + "selected",
					changeCurrIndex = function( i ){
						var max = jQuery_1_3_2 ( qReviewOpt + "last", currQuiz).val(),
							min = jQuery_1_3_2( qReviewOpt + "first", currQuiz).val(),
							isIndexValid = ( i <= max && i >= min );
							
						if( isIndexValid ){
							jQuery_1_3_2( ".q-review-index", currQuiz).val( i );
							currIndex = i;
							changeProb(true);
							displayAnsResult();
							jQuery_1_3_2( ".q-reviewBar > :disabled", currQuiz).attr( "disabled", false );
						}
						// if a limit was reached. Disable the corresponding arrow.
						if( i == max || i == min ){
							jQuery_1_3_2( ".q-" + (( i == min )?"left":"right") + "Arrow", currQuiz ).attr( "disabled", true );
						}
					};
				jQuery_1_3_2( ".q-review-index", currQuiz).change(function(e){
					changeCurrIndex( parseInt(jQuery_1_3_2 (e.target).val(), 10) );
				});
				// Note: The prev||next values of the options tag are used because the list might not be in numerical order.
				jQuery_1_3_2( ".q-review-arrows", currQuiz).click(function( e ){
					var isLeft = !!e.target.className.match( /left/ ), 
						reviewVal = $( qReviewOptVal, currQuiz)[ ( isLeft ) ? "prev":"next" ]().val();
					
					changeCurrIndex( parseInt( reviewVal, 10) ); 
				});
			},
			// setReviewMenu(): Sets the events to change the view when the "review" or "details" button is clicked.
			setReviewMenu = function(){
				var qG = jQuery_1_3_2( ".q-gameOver", currQuiz ), qP = jQuery_1_3_2( ".q-prob", currQuiz );
				
				jQuery_1_3_2( ".q-reviewBar-btns", currQuiz ).click( function( e ){
					var isDetailEl = ( e.target.className.search(/details/) > -1),
						showEl = ( isDetailEl ) ? qG : qP,
						hideEl = ( !isDetailEl ) ? qG : qP;
					
					animateThis( $( ".q-reviewBar", currQuiz), !isDetailEl );
					animateThis( hideEl, 0, function(){
						jQuery_1_3_2( ".q-details-btn", currQuiz ).attr( "disabled", isDetailEl );
						jQuery_1_3_2( ".q-review-btn", currQuiz ).attr( "disabled", !isDetailEl );
						animateThis( showEl, 1 );
					});
				});
				jQuery_1_3_2( ".q-showOnlyMissed-btn", currQuiz ).change( function(){
					var ckd = $(this).is(":checked");
					jQuery_1_3_2( ".q-review-index-missed", currQuiz )[ (ckd) ? "fadeIn":"hide" ]();
					jQuery_1_3_2( ".q-review-index-all", currQuiz )[ (!ckd) ? "fadeIn":"hide" ]();
					jQuery_1_3_2( ".q-review-index:visible", currQuiz ).trigger( "change" );
				});
				setReviewNav();
			},
			// updateReviewIndex(): Creates the review's select tag html for all and wrong answers.
			updateReviewIndex = function(){
				var allMissed = '', optHtml = '', markAsWrong = '', eachOpt = '',
					i = 0, totalQues = stats.totalQues, rightLen = stats.rightAns.length, right = {};
				
				while( rightLen-- ){
					right[ stats.rightAns[ rightLen ] ] = 1;
				}
				while( totalQues - i ){
					markAsWrong = ( !right[i] ) ? " *" : "";
					eachOpt = "<option value=" + i + ">";
					eachOpt += (i+1);
					eachOpt += markAsWrong;
					eachOpt += "</option>";
					optHtml += eachOpt;
					allMissed += (markAsWrong) ? eachOpt : "";
					i++;
				}
				jQuery_1_3_2( ".q-review-index-all", currQuiz).html( optHtml );
				jQuery_1_3_2( ".q-review-index-missed", currQuiz).html( allMissed );
			},
			// disableButtons(): If requested, on gameOver hide the restart and/or delete buttons.
			disableButtons = function(){
				if( settings.disableRestart ){ jQuery_1_3_2( ".q-restart-btn", currQuiz).hide(); }
				if( settings.disableDelete ){ jQuery_1_3_2( ".q-del-btn", currQuiz).hide(); }
				if( settings.disableRestart && settings.disableDelete ){
					jQuery_1_3_2( ".q-options", currQuiz ).hide();
				}
			},
			// gameOver(): Creates a performance list, set's the events for restart and delete, hides unneed elements,
			// # then enables the review-bar.
			gameOver = function(){ 
				disableButtons();
				jQuery_1_3_2( ".q-statTotal", currQuiz).html( lang.stats.score + ": " + stats.perc() + "%" );
				jQuery_1_3_2( ".q-statDetails", currQuiz).html(
					[
						(lang.stats.right + ": " + stats.rightAns.length), 
						(lang.stats.wrong + ": " + stats.wrongAns.length),
						(lang.stats.tried + ": " + stats.quesTried), 
						(lang.stats.rate + ": " + stats.accurTxt()), 
						(lang.stats.total + ": " + stats.percTxt())
					].join('<br/>')
				);
				jQuery_1_3_2( ".q-restart-btn", currQuiz).one( "click", function(){
					reStartQuiz();
				});			
				jQuery_1_3_2( ".q-del-btn", currQuiz).one( "click", function(){
					deleteQuiz();
				});
				jQuery_1_3_2( ".q-help, .q-check-btn, .q-prob, .q-intro, .q-ans", currQuiz).hide();
				if( settings.review ){
					updateReviewIndex();
					jQuery_1_3_2( ".q-review-btn", currQuiz ).one( "click", function(){
						jQuery_1_3_2( ".q-review-index", currQuiz).trigger( "change" );
						displayAnsResult(); // This forces the answer info to be displayed for first question.
						if( totalQuesLen == 1 ){
							jQuery_1_3_2( ".q-rightArrow, .q-showOnlyMissed-btn", currQuiz ).attr( "disabled", true );
						}						
					});
					jQuery_1_3_2( ".q-details-btn", currQuiz).attr( "disabled", true );
					jQuery_1_3_2( ".q-review-menu", currQuiz).show();
				}
				animateThis( jQuery_1_3_2( ".q-gameOver", currQuiz), 1 );
			},
			// changeProb(): Changes to next problem and updates status.
			changeProb = function( isReview ){
				var qAS = q.ansSel;
				jQuery_1_3_2( ".q-counter", currQuiz).text( (currIndex + 1) + '/' + totalQuesLen );
				jQuery_1_3_2( ".q-ques", currQuiz).html( q.ques[ currIndex ] );
				if( !isReview ){ 
					jQuery_1_3_2( ".q-ansSel", currQuiz).html( 
					// Checks for an index pointer; used to clone an identical q.ansSel. This was done to speed up buildQuizType.
						qAS[ isNaN( qAS[currIndex] ) ? currIndex : qAS[currIndex] ].clone(true)
					);
					jQuery_1_3_2( ".q-result", currQuiz ).hide();	//.q-prob is animated to hide, so just hide .q-result.
					jQuery_1_3_2( ".focusThis", currQuiz ).focus();
					jQuery_1_3_2( ".clickThis", currQuiz ).click();
				}
			},
			// changeQuizInfo(): Changes the main information for the quiz.
			changeQuizInfo = function(){
				setToBeginningView();
				jQuery_1_3_2( ".q-title", currQuiz).html( settings.title );
				jQuery_1_3_2( ".q-help-info", currQuiz).html( settings.help );
				if( settings.intro ){
					jQuery_1_3_2( ".q-prob", currQuiz ).hide();
					jQuery_1_3_2( ".q-intro-info", currQuiz ).html( settings.intro );
					jQuery_1_3_2( ".q-intro", currQuiz ).show();
					jQuery_1_3_2( ".q-begin-btn", currQuiz ).unbind().one( "click", function(){
						animateThis( jQuery_1_3_2( ".q-intro", currQuiz ), 0, function(){ 
							animateThis( jQuery_1_3_2( ".q-prob", currQuiz ), 1 );
						});
					});
				}			
				if( isMSIE ){
					//IE will still show the result for some odd reason. So you MUST show, then hide.
					var hideResults = function(){ 
						setTimeout( function(){ $( ".q-result", currQuiz ).show().hide(); }, 500 ); 
					};
					hideResults(); //If no intro, start function.
					jQuery_1_3_2( ".q-begin-btn", currQuiz ).one( "click", function(e){
						hideResults(); //Wait until the quiz has begun.
					});
				}
			},
			sendStatus = function(){
				var quizInfo = { 
					"right": stats.rightAns,
					"wrong": stats.wrongAns,
					"tried": stats.quesTried,
					"score": stats.perc(),
					"total": stats.totalQues,
					"hasQuit": quit,
					"quitFunc": ( !quit ) ? quitQuiz : function(){},
					"nextFunc": ( !quit ) ? changeProb : function(){}
				};
					
				settings.statusUpdate( quizInfo, currQuiz );
			},
			// nextMove(): Decides to change the problem or to quit.
			nextMove = function(){
						
				currIndex++; // currIndex++ must be first, to find out if there are other questions.
				var nextFunc = (cont() ? changeProb : quitQuiz),
					qEl = jQuery_1_3_2( ".q-prob", currQuiz);
				
				if( !quit ){ animateThis( qEl, 0 ); }
				if( settings.statusUpdate ){ sendStatus(); }
				animateThis( qEl, -1, nextFunc ); //Push the function to the stack, so it's called in between the animations.
				if( !quit ){ animateThis( qEl, 1 ); }
				
				replaceImage();
				
				

			},
			// getAns(): Is used to check the answers. 
			getAns = function( i ){ 
				return q.ans[ i || currIndex ]; 
			},
			// checkAns(): Changes the user's answer during the quiz and updates the stats.
			checkAns = function( isFlashCard ){
				var ans = getAns(), isAnsCorr = false;
				
				if( typeof(ans) === "string"){
					ans = jQuery_1_3_2.trim( ans );
				}
				if( $.isArray( ans ) ){
					// If one element of the array matches the user's input, then it's correct.
					// This enables multiple answers to be possible.
					if( (jQuery_1_3_2.inArray( userAns[currIndex], ans ) + 1) ){ isAnsCorr = true; }
					if( userAns[currIndex] == ans.toString() ){ isAnsCorr = true; }
				}
				else{
					isAnsCorr = ( userAns[currIndex] == ans || userAns[currIndex].toString().toLowerCase() == ans.toString().toLowerCase() );
				}
				if( !quit ){
					stats.quesTried++;
					stats[ ( isAnsCorr || isFlashCard ) ? "rightAns" : "wrongAns" ].push( currIndex );
				}
				return isAnsCorr;
			},
			// displayAnsResult(): Display's the answer result and information during the quiz.
			displayAnsResult = function( isFlashCard ){
				var currAns = getAns(), isUserAnsCorr = checkAns( isFlashCard ),
					isLongArr = ( jQuery_1_3_2.isArray( currAns ) ) && (currAns.length > 1), show = "",
					toUni = settings.showHTML;
				if( toUni && !isUserAnsCorr ){
					if( isLongArr ){
						var i = currAns.length;
						currAns = currAns.concat();
						
						while( i-- ){
							currAns[ i ] = toHTMLUnicode( currAns[ i ] );
						}
					}
					else{
						currAns = toHTMLUnicode( currAns );
					}
				}
				show = ( isUserAnsCorr ) ? lang.ans.praise :
								( lang.ans.corrAns + '<br/>' + (( isLongArr ) ? currAns.join( '<br/>' ) : currAns) );
			
				if( !isUserAnsCorr || quit ){ 
					if( settings.showWrongAns || quit ){
						var wrongAns = lang.ans.yourAns + "<br/>";

						wrongAns = ( !userAns[currIndex] ) ? "<del>" + wrongAns +"</del>" : wrongAns + (( toUni ) ? toHTMLUnicode( userAns[ currIndex ] ) : userAns[currIndex]);
						show = wrongAns + "<hr/>" + show;						
					}
					if( settings.showAnsInfo && !!q.ansInfo[ currIndex ] ){
						show += "<hr/>" + lang.ans.whyAns + "<br/>" + q.ansInfo[ currIndex ];
					}
				}
				if( settings.showAns || quit ){ 
					jQuery_1_3_2( ".q-result", currQuiz ).html( show );				
					if( !quit ){
						animateThis( $( ".q-result", currQuiz ), 1 );
					}
					else{
						jQuery_1_3_2( ".q-result", currQuiz ).show();				
					}
				}
			},
			hasAnsSel = function( iProp, i ){
				return ( !!wordList[ q.prop[ iProp ] ] [ i ].ansSel );
			},
			rAnsSel = function( iProp, i ){
				var wAS = wordList[ q.prop[ iProp ] ] [ i ].ansSel,
					len = ( $.isArray( wAS ) ) ? wAS.length : 0;
				
				return ( len ) ? wAS[ rNum(len) ] : wAS;
			},
			// buildQuizType{}: contains all the quiz types.
			//Quiz creation: The q object is filled with the questions, answers and answer selections(what the user can choose from). 
			//The user's input gets assigned to userAns[ currIndex ] ( global inside quizMe ). 
			//Then nextMove() is called. Which checks to see if the user's input is contained in the answer, or is the array.
			buildQuizType = {
				// fillInTheBlank Quiz:	ques = ques, ansSel = Input text[ ans ].
				'fillInTheBlank' : function( iProp, flashVer ){
					var d;
					if( flashVer ){
						d = jQuery_1_3_2( "<span/>" ).addClass( "clickThis userInputArea" ) //Enabled the checkBtn.
							.one( "click", function(){
								jQuery_1_3_2( ".q-check-btn", currQuiz ).attr( "disabled", false );
							})
							.bind( "getUserAns", function(){ return 1; });								
					}
					else{
						d = jQuery_1_3_2( '<input type="text"/>' ).addClass( "q-quesInput focusThis userInputArea" )
							.one( "click keypress", function(){
								jQuery_1_3_2( ".q-check-btn", currQuiz ).attr( "disabled", false );
							})
							.bind( "getUserAns", function(){
								userAns[currIndex] = jQuery_1_3_2( ".q-quesInput", currQuiz ).val();
								userAns[currIndex] = jQuery_1_3_2.trim( userAns[currIndex] );
							});
					}
					var i = q.indexMax[ iProp ], qMin = q.indexMin[ iProp ], wList = wordList[ q.prop[ iProp ] ], numOfQues = wList.length;
					
					while( numOfQues-- ){
						q.ansInfo[ i ] = wList[ numOfQues ].ansInfo || ""; 
						q.ans[ i ] = wList[ numOfQues ].ans;
						q.ansSel[ i ] = qMin;
						q.ques[ i ] = ( wList[ numOfQues ].ques + settings.addToEnd );
						i--;
					}
					q.ansSel[ qMin ] = d;	//speed!! All the q.ansSel area reference to qMin. 
				},
				'flashCard' : function( iProp ){
					// flashCard Quiz:  ques = ques, ansSel =null .
					this.fillInTheBlank( iProp, true);
				},			
				'trueOrFalse' : function( iProp ){
					// trueOrFalse Quiz:
					// ques  = (typeof ans != bool) ? (real or fake ans)  : ques;
					// ansSel =  T / F ( radio );
					// If the answer is a bool, then there is no creation of a question: combining a right or wrong answers, to make a true or false statement.
					
					var d = jQuery_1_3_2( '<div><input type="radio" value="1" class="true-radio trueRadio"/><label class="trueRadio">' + lang.quiz.tfTrue + '</label> <input type="radio" value="0" class="false-radio falseRadio"/><label class="falseRadio">' + lang.quiz.tfFalse + '</label></div>' );
					
					jQuery_1_3_2( d ).addClass( "userInputArea" ).bind( "getUserAns", function(){
						var isTrue = $( ".true-radio", this ).attr( "checked" );
						
						userAns[currIndex] = lang.quiz[ ( isTrue ) ? "tfTrue" : "tfFalse" ];
					});
					jQuery_1_3_2( d ).children().click( function(){
						jQuery_1_3_2( ".q-check-btn", currQuiz).attr( "disabled", false );
					});
					jQuery_1_3_2(".trueRadio", d).click( function(){
						jQuery_1_3_2( ".true-radio", currQuiz ).attr( "checked", true ); 
						jQuery_1_3_2( ".false-radio", currQuiz ).attr( "checked", false ); 
					});
					jQuery_1_3_2(".falseRadio", d).click( function(){
						jQuery_1_3_2( ".true-radio", currQuiz ).attr( "checked", false ); 
						jQuery_1_3_2( ".false-radio", currQuiz ).attr( "checked", true ); 
					});			
					var currAns, shouldAnsBeCorr = true, i = q.indexMax[ iProp ], 
						qMin = q.indexMin[ iProp ], wList = wordList[ q.prop[ iProp ] ], numOfQues = wList.length,
						toUni = settings.showHTML, tfEqual = lang.quiz.tfEqual;
					
					while( numOfQues-- ){
						currAns = wList[ numOfQues ].ans;						
						q.ansInfo[ i ] = wList[ numOfQues ].ansInfo || ""; 
						q.ansSel[ i ] = qMin;
						q.ques[ i ] = wList[ numOfQues ].ques;
						
						if( typeof currAns != "boolean" ){
							shouldAnsBeCorr = rBool();
							var result = ( shouldAnsBeCorr ) ? currAns : 
											( hasAnsSel( iProp, numOfQues ) ) ? rAnsSel( iProp, numOfQues ) : rAns( iProp ),
								a = ( !$.isArray( currAns ) || !$.isArray( result ) ) ? result == currAns : areArraysSame( result, currAns );
							
							q.ans[ i ] = lang.quiz[ ( a ) ? "tfTrue" : "tfFalse" ];
							q.ques[ i ] += tfEqual;
							q.ques[ i ] += ( toUni ) ? toHTMLUnicode( ( typeof result == "object" ) ? result.join( ',' ) : result ) : result;
						}
						else{
							q.ans[ i ] = lang.quiz[ ( currAns ) ? "tfTrue" : "tfFalse" ];
						}
						i--;
					}
					
					q.ansSel[ qMin ] = d;
				},
				'multipleChoice' : function( iProp, olVer ){
					// multipleChoice Quiz: 
					// ques = ques;
					// ansSel = <select>[ <option> is the answer + <option> * settings.multiLen]
						var d;
						if( olVer ){
							d = jQuery_1_3_2( '<div><ol class="q-ol"></ol></div>' );
							jQuery_1_3_2( d ).one( "click", function(){
								jQuery_1_3_2( ".q-check-btn", currQuiz ).attr( "disabled", false );
							});
							jQuery_1_3_2( ".q-ol-li", d )
								.live( "click", function( e ){
									jQuery_1_3_2( e.target ).closest( ".q-ol-li" ).addClass( settings.activeClass ).siblings().removeClass( settings.activeClass );
									if( e.target.className != "q-radioBtn" ){
										jQuery_1_3_2( e.target ).siblings().find( ".q-radioBtn:checked" ).attr( "checked", false );
										jQuery_1_3_2( e.target ).find( ".q-radioBtn" ).attr( "checked", true );
									}else{
										jQuery_1_3_2( e.target ).parent().siblings().find( ".q-radioBtn:checked" ).attr( "checked", false );
										jQuery_1_3_2( e.target ).attr( "checked", true );
									}
								})
								.live( "mouseover", function( e ){ 
									jQuery_1_3_2( e.target ).closest( ".q-ol-li" ).addClass( settings.hoverClass );
								})
								.live( "mouseout", function( e ){
									jQuery_1_3_2( e.target ).closest( ".q-ol-li" ).removeClass( settings.hoverClass );
								});
						}
						else{
							d = jQuery_1_3_2( '<div><select class="q-select"></select></div>' );
							jQuery_1_3_2( ".q-select", d ).one( "click keypress", function( e ){
								jQuery_1_3_2( ".q-check-btn", currQuiz).attr( "disabled", false );
							});
						}
						jQuery_1_3_2( d ).addClass( "userInputArea" ).bind( "getUserAns", function(){		
							if( olVer ){ 
								var elText = $( "." + settings.activeClass, currQuiz ).text();								
								userAns[currIndex] = (isMSIE) ? elText.substring( 2, elText.length ) : elText;
								userAns[currIndex] = jQuery_1_3_2.trim( userAns[currIndex] );
							}
							else{
								userAns[currIndex] = jQuery_1_3_2( "option:selected", this ).text();
							}
						});
						
						var i = q.indexMax[ iProp ], wList = wordList[ q.prop[ iProp ] ], ansPos, optHtml, val, len,
							j = wList.length, wListRange = new Array( j ), numOfQues = wList.length,
							//Checks to see, if the request multiLen length can be supported.
							setLen = ( settings.multiLen > j ) ? j : settings.multiLen,
							toUni = settings.showHTML, hasAnsPosition = false, ansSelChoice = ""; 

						while( j-- ){
							wListRange[ j ] = j;
						}
						
						while( numOfQues-- ){
							optHtml = "";
							hasAnsPosition = false;
							
							if( hasAnsSel( iProp, numOfQues ) ){
								val = [];
								if( typeof wList[ numOfQues ].ansSel === "object" ){
									var wAnsSel = wList[ numOfQues ].ansSel, k = wAnsSel.length, valLen = 0;
									
									while( k-- ){
										if( wAnsSel[ k ] === null ){
											val[ valLen++ ] = wList[ numOfQues ].ans;
											hasAnsPosition = true;
										}
										else{
											val[ valLen++ ] = wAnsSel[ k ];
										}
									}	
									
								}
								else{
									val[ 0 ] = wList[ numOfQues ].ansSel;
								}
								if( !hasAnsPosition ){
									val[ val.length ] = wList[ numOfQues ].ans;
									
									if (settings.randomizeAnswers) {
									 makeArrayRandom( val );
									} else {
									 val = [
									   "Dead",
									   "P3",
									   "P2",
									   "P1"
									 ];
									}
								}
								len = val.length;

								while( len-- ){
									ansSelChoice = ( toUni ) ? toHTMLUnicode( val[ len ] ): val[ len ];
									
									optHtml += ( olVer ) ? ["<li class = 'q-ol-li'><input type='radio' class='q-radioBtn'/> <span>", ansSelChoice, "</span></li> "].join("") :
													[ "<option'>", ansSelChoice, "</option> " ].join("");
								}
							}
							else{
								var randAns = wListRange.concat();
								// Get rids of the answer Index from randAns. 
								randAns.splice( numOfQues, 1 ); 
								len = setLen;
								ansPos = rNum( len );
								while( len-- ){
								
								
									var randIndex = rNum( randAns.length ),
									 ansSelIndex = ( len == ansPos ) ? numOfQues : randAns.splice( randIndex, 1 ) || 0;


									ansSelChoice = ( toUni ) ? toHTMLUnicode( wList[ ansSelIndex ].ans ) : wList[ ansSelIndex ].ans;
									optHtml += ( olVer ) ? ["<li class = 'q-ol-li'><input type='radio' class='q-radioBtn'/><span>", ansSelChoice, "</span></li> "].join("") :
													[ "<option>", ansSelChoice, "</option> " ].join("");
								}
							}
							// below: innerHTML is 2x faster than $.html() but IE generates corrrupt option html
							( olVer ) ? jQuery_1_3_2( ".q-ol", d )[0].innerHTML = optHtml :
								( isMSIE ) ? $( "select", d ).html( optHtml ) : ($( "select", d )[0].innerHTML = optHtml);
							if( isMSIE && olVer ){
								//Fixes IE CSS BUG. No spaces with list-style-position: inline.
								$( ".q-ol-li", d ).prepend( "&nbsp;&nbsp;" );
							}
							
							q.ans[ i ] = wList[ numOfQues ].ans;
							
							q.ansInfo[ i ] = wList[ numOfQues ].ansInfo || ""; 
							q.ansSel[ i ] = d.clone( true );
							q.ques[ i ] = wList[ numOfQues ].ques;
							i--;
						}
						
						//console.log(optHtml);
						//console.log(wList);
						
				},
				'multipleChoiceOl' : function( iProp ){
					// multipleChoiceOlQuiz: ques = ques, ansSel = ol [ <list> real ans + <list> * settings.multipleChooseLength] 
					this.multipleChoice( iProp, true);
				}
			},
			// makeQuizRandom(): If randomizeQ is false, it will randomize the each quiz type. 
			// But if randomizeQ is true, it will randomize the q object.
			makeQuizRandom = function( randomizeQ ){
				if( randomizeQ ){
					var numArr = new Array( totalQuesLen ), i = numArr.length,
						temp = { ans: [], ansSel: [], ansInfo: [], ques: [] }, nArrI, qAS;
					
					while( i-- ){ numArr[ i ] = i; }
					makeArrayRandom( numArr );
					i = numArr.length;

					while( i-- ){
						nArrI = numArr[ i ];
						qAS = q.ansSel[ nArrI ];
						
						temp.ans[i] = q.ans[ nArrI ];
						temp.ansInfo[i] = q.ansInfo[ nArrI ] || "";
						temp.ansSel[i] = ( typeof qAS !== "number" ) ? qAS : q.ansSel[ qAS ];
						temp.ques[i] = q.ques[ nArrI ];
					}
					q.ans = temp.ans.concat();
					q.ansInfo = temp.ansInfo.concat();
					q.ansSel = temp.ansSel.concat();	
				
									
					q.ques = temp.ques.concat();
				}
				else{				
					var iProp = q.prop.length;
					while( iProp-- ){
						makeArrayRandom( wordList[ q.prop[ iProp ] ] ); 
					}					
				}
				
			},
			makeQuizType = function(){ 
			//iProp is a pointer to the quizType min and max index.
				var iProp = q.prop.length, currProp = "", p, allP = settings.allQuizType,
					shortProp = {
						fill:"fillInTheBlank", cards:"flashCard", tf:"trueOrFalse", multi:"multipleChoice", multiList:"multipleChoiceOl"
					};
					
				if( settings.random ){ makeQuizRandom();}
				while( iProp-- ){
					p = allP || q.prop[ iProp ];
					currProp = shortProp[ p ] || p;
					buildQuizType[ currProp ]( iProp );
				}
				if( settings.allRandom ){ makeQuizRandom(true);}
			},
			setUserAnsBlank = function(){
				var i = totalQuesLen;
				
				while( i-- ){
					userAns[ i ] = "";
				}
			},
			
			replaceImage = function() {
				jQuery_1_3_2(document).trigger("jQuizQuestionRendered");
			 
			 var image = "";
			 
			 for (var i =0;i<wordList.multiList.length;i++) {
			   if (wordList.multiList[i].ques == q.ques[currIndex]) {
			     image = wordList.multiList[i].image;
			     break;
			   }
			 }
			 
		
			 if (image) {
			   jQuery_1_3_2('.imageHolder').attr("src",image).show();
			   jQuery_1_3_2('.q-help-menu').show();
			   
			 } else {
			   jQuery_1_3_2('.imageHolder').hide();
			   jQuery_1_3_2('.q-help-menu').hide();
			 }
			 
			 
			 
			},
			
			// Creates and shows the new quiz.
			createNewQuizProb = function(){
				setUserAnsBlank();
				stats.reset();
				makeQuizType();
				changeQuizInfo();
				changeProb();
				if( settings.statusUpdate ){ sendStatus(); }
				animateThis( jQuery_1_3_2( currQuiz ), 1 );
				
			},
			quitQuiz = function(){
				currIndex = 0; //Used to make updateReviewIndex start at 0.
				quit = true; 
				disableMenuBar();
				gameOver();				
			},
			deleteQuiz = function(){
				animateThis( $( currQuiz ), 0, function(){
					jQuery_1_3_2( currQuiz ).remove();
				});
				q = {};
			},
			setToBeginningView = function(){
				jQuery_1_3_2( ".q-gameOver, .q-result, .q-review-menu", currQuiz).hide();
				jQuery_1_3_2( ".q-ans, .q-help, .q-check-btn, .q-help-menu, .q-prob", currQuiz ).show();
				jQuery_1_3_2( ".q-quit-btn, .q-help-btn", currQuiz ).attr( "disabled", false );
			},
			reStartQuiz = function(){
				//IE likes to hide on restart.
				if( !isMSIE || ( isMSIE && settings.fxType == 3 ) ){
					animateThis( $( currQuiz ), 0 );
				}
				setToBeginningView();
				quit = false;
				currIndex = 0;
				setCheckBtn();
				createNewQuizProb();
			},
		
			checkAnimation = function(){
				var s = settings, spd = s.fxSpeed, spdType = { slow: 600, fast: 200, normal: 400 };
				
				s.fxSpeed = isNaN( spd ) ? ( spdType[ spd ] || 400 ) : spd;

				if( isMSIE ){
					$( currQuiz ).children().removeAttr("filter"); 
				}
				if( s.fxCode ){
					var custAnimatePos = animateType.length;
					animateType[ custAnimatePos ] = s.fxCode;
					s.fxType = custAnimatePos;
				}
			},
			// checkQTypeKeys(): Checks the keys for each question, wordList[i]. Returns error if unknown.
			checkQTypeKeys = function( quesKeys ){
				var badKey = "", i = quesKeys.length,
					validKeys = { ques:1, ans:1, ansInfo:1, ansSel:1, image:1 };
				
				if( !i ){ badKey = lang.err.noQues; }
				while( i-- ){
					if( badKey ){ break;}
					for( var currKey in quesKeys[ i ] ){
						if( quesKeys.hasOwnProperty( currKey ) || !validKeys[ currKey ] ){
							badKey = currKey + lang.err.badKey;
							break;
						}
					}
				}
				return badKey;
			},
			hasBadSyntax = function( wNames ){
				var badKey = "", goodKeys = [],
					validKeys = { 
						fillInTheBlank:1, flashCard:1, trueOrFalse:1, multipleChoice:1, multipleChoiceOl:1,
						fill:1, cards:1, tf:1, multi:1, multiList:1
					};
				
				for( var prop in wNames ){
					if( wNames.hasOwnProperty( prop ) ){
						if( !validKeys[ prop ] ){
							badKey = lang.err[ ( typeof wNames === "object" ) ? "badQType" : "lang.err.notObj" ];
						}
						if( !badKey ){
							badKey = ( jQuery_1_3_2.isArray( wNames[prop] ) ) ? checkQTypeKeys( wNames[prop] ) : lang.err.notArr;
						}
						if( badKey ){ 
							badKey = prop + " -> " + badKey;
							break; 
						}
						goodKeys[ goodKeys.length ] = prop;
					}
				}
				q.prop = goodKeys.concat();
				
				if( !prop ){ badKey = lang.err.noQType; }
				if( settings.allQuizType && !badKey ){ 
					badKey = !validKeys[ settings.allQuizType ]; 
					if( badKey ){ 
						badKey = settings.allQuizType + " -> " + lang.err.badQType; 
					}
				}
				return badKey;
			},
			// start(): This is the first function called.
			start = function(){
				
				if( jQuery_1_3_2.isArray( wordList ) ){
					//Turns the array into an object.
					var tempObj = {};
					tempObj[ settings.allQuizType || settings.quizType ] = wordList;
					wordList = tempObj;
				}
				
				var err = ( wordList ) ? hasBadSyntax( wordList ) : lang.err.noQues;
				if( err ){ 
					err = "jQuizMe " + lang.err.error + ": " + err;
					return $( stickyEl ).text( err );
				}
				checkAnimation();
				createQuizEl();
				if (!settings.randomizeAnswers) {
				  console.log(q);
				}
				createNewQuizProb();
				replaceImage();
				return currQuiz;
			}();	// Auto starts.
		});
	};
	jQuery_1_3_2.fn.jQuizMe.version = "2.1";
})(jQuery);
