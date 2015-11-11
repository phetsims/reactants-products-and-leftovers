// Copyright 2014-2015, University of Colorado Boulder

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
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
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
    opacity: 0.65,
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

    // check button is needed immediately, so create it so this node has well-defined bounds (needed for layout)
    var checkButton = new TextPushButton( checkString, BUTTON_OPTIONS );
    thisNode.addChild( checkButton );
    checkButton.addListener( function() { model.check(); } );

    // enable/disable the check button
    thisNode.checkButtonEnabledObserver = function( enabled ) { checkButton.enabled = enabled; }; // @private
    thisNode.checkButtonEnabledProperty = checkButtonEnabledProperty; // @private
    thisNode.checkButtonEnabledProperty.link( thisNode.checkButtonEnabledObserver ); // must be unlinked in dispose

    // other buttons, created on demand
    var tryAgainButton;
    var showAnswerButton;
    var nextButton;

    // @private
    thisNode.playStateObserver = function( state ) {

      // create buttons on demand
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
    thisNode.playStateProperty = null; // @private will be set by activate()
  }

  reactantsProductsAndLeftovers.register( 'GameButtons', GameButtons );

  return inherit( Node, GameButtons, {

    /**
     * Connects this node to the model. Until this is called, the node is preloaded, but not fully functional.
     * @param {Property.<PlayState>} playStateProperty
     * @public
     */
    activate: function( playStateProperty ) {
      this.playStateProperty = playStateProperty;
      this.playStateProperty.link( this.playStateObserver ); // must be unlinked in dispose
    },

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.checkButtonEnabledProperty.unlink( this.checkButtonEnabledObserver );
      if ( this.playStateProperty ) {
        this.playStateProperty.unlink( this.playStateObserver );
      }
    }
  } );
} );
