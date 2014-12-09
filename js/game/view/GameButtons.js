// Copyright 2002-2014, University of Colorado Boulder

/**
 * Group of mutually-exclusive buttons that are used to advance a challenge through its states.
 * The buttons are 'Check', 'Try Again', 'Show Answer' and 'Next'.
 * Buttons are created on demand to improve overall performance of creating a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );

  // constants
  var BUTTON_OPTIONS = {
    font: new RPALFont( { size: 20, weight: 'bold' } ),
    baseColor: RPALColors.GAME_BUTTON,
    opacity: RPALQueryParameters.BUTTONS_OPACITY,
    xMargin: 20,
    yMargin: 5,
    centerX: 0 // so that all buttons are center aligned
  };

  /**
   * @param {GameModel} model
   * @param {Property.<boolean>} checkButtonEnabledProperty is the 'Check' button enabled?
   * @param {Object} [options]
   * @constructor
   */
  function GameButtons( model, checkButtonEnabledProperty, options ) {

    options = options || {};

    var thisNode = this;
    Node.call( thisNode, options );

    // buttons, created on demand
    var checkButton, tryAgainButton, showAnswerButton, nextButton;

    // @private
    thisNode.playStateObserver = function( state ) {

      // create buttons on demand
      if ( !checkButton && ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK ) ) {
        checkButton = new TextPushButton( checkString, BUTTON_OPTIONS );
        thisNode.addChild( checkButton );
        checkButton.addListener( function() { model.check(); } );

        // enable/disable the check button
        thisNode.checkButtonEnabledObserver = function( enabled ) { checkButton.enabled = enabled; }; // @private
        thisNode.checkButtonEnabledProperty = checkButtonEnabledProperty; // @private
        thisNode.checkButtonEnabledProperty.link( thisNode.checkButtonEnabledObserver ); // must be unlinked in dispose
      }

      if ( !tryAgainButton && state === PlayState.TRY_AGAIN ) {
        tryAgainButton = new TextPushButton( tryAgainString, BUTTON_OPTIONS );
        thisNode.addChild( tryAgainButton );
        tryAgainButton.addListener( function() { model.tryAgain(); } );
      }

      if ( !showAnswerButton && state === PlayState.SHOW_ANSWER ) {
        showAnswerButton = new TextPushButton( showAnswerString, BUTTON_OPTIONS );
        thisNode.addChild( showAnswerButton );
        showAnswerButton.addListener( function() { model.showAnswer(); } );
      }

      if ( !nextButton && state === PlayState.NEXT ) {
        nextButton = new TextPushButton( nextString, BUTTON_OPTIONS );
        thisNode.addChild( nextButton );
        nextButton.addListener( function() { model.next(); } );
      }

      // make the proper button visible for the {PlayState} state
      checkButton && ( checkButton.visible = ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK ) );
      tryAgainButton && ( tryAgainButton.visible = ( state === PlayState.TRY_AGAIN ) );
      showAnswerButton && ( showAnswerButton.visible = ( state === PlayState.SHOW_ANSWER ) );
      nextButton && ( nextButton.visible = ( state === PlayState.NEXT ) );
    };
    thisNode.playStateProperty = model.playStateProperty; // @private
    thisNode.playStateProperty.link( this.playStateObserver ); // must be unlinked in dispose
  }

  return inherit( Node, GameButtons, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.checkButtonEnabledObserver && this.checkButtonEnabledProperty.unlink( this.checkButtonEnabledObserver );
      this.playStateProperty.unlink( this.playStateObserver );
    }
  } );
} );
