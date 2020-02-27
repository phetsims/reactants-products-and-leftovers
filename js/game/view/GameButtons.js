// Copyright 2014-2019, University of Colorado Boulder

/**
 * Group of mutually-exclusive buttons that are used to advance a challenge through its states.
 * The buttons are 'Check', 'Try Again', 'Show Answer' and 'Next'.
 * Buttons are created on demand to improve overall performance of creating a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  const checkString = require( 'string!VEGAS/check' );
  const nextString = require( 'string!VEGAS/next' );
  const showAnswerString = require( 'string!VEGAS/showAnswer' );
  const tryAgainString = require( 'string!VEGAS/tryAgain' );

  // constants
  const BUTTON_OPTIONS = {
    font: new RPALFont( { size: 20, weight: 'bold' } ),
    baseColor: RPALColors.GAME_BUTTON,
    opacity: 0.65,
    xMargin: 20,
    yMargin: 5,
    centerX: 0 // so that all buttons are center aligned
  };

  class GameButtons extends Node {

    /**
     * @param {GameModel} model
     * @param {Property.<boolean>} checkButtonEnabledProperty is the 'Check' button enabled?
     * @param {Object} [options]
     */
    constructor( model, checkButtonEnabledProperty, options ) {

      options = options || {};

      super( options );

      // check button is needed immediately, so create it so this node has well-defined bounds (needed for layout)
      const checkButton = new TextPushButton( checkString, BUTTON_OPTIONS );
      this.addChild( checkButton );
      checkButton.addListener( function() { model.check(); } );

      // enable/disable the check button
      this.checkButtonEnabledObserver = function( enabled ) { checkButton.enabled = enabled; }; // @private
      this.checkButtonEnabledProperty = checkButtonEnabledProperty; // @private
      this.checkButtonEnabledProperty.link( this.checkButtonEnabledObserver ); // must be unlinked in dispose

      // other buttons, created on demand
      let tryAgainButton;
      let showAnswerButton;
      let nextButton;

      // @private
      this.playStateObserver = state => {

        // create buttons on demand
        if ( !tryAgainButton && state === PlayState.TRY_AGAIN ) {
          tryAgainButton = new TextPushButton( tryAgainString, BUTTON_OPTIONS );
          this.addChild( tryAgainButton );
          tryAgainButton.addListener( function() { model.tryAgain(); } );

          // a11y
          tryAgainButton.focus();
        }

        if ( !showAnswerButton && state === PlayState.SHOW_ANSWER ) {
          showAnswerButton = new TextPushButton( showAnswerString, BUTTON_OPTIONS );
          this.addChild( showAnswerButton );
          showAnswerButton.addListener( function() { model.showAnswer(); } );

          // a11y
          showAnswerButton.focus();
        }

        if ( !nextButton && state === PlayState.NEXT ) {
          nextButton = new TextPushButton( nextString, BUTTON_OPTIONS );
          this.addChild( nextButton );
          nextButton.addListener( function() { model.next(); } );

          // a11y
          nextButton.focus();
        }

        // make the proper button visible for the {PlayState} state
        checkButton && ( checkButton.visible = ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK ) );
        tryAgainButton && ( tryAgainButton.visible = ( state === PlayState.TRY_AGAIN ) );
        showAnswerButton && ( showAnswerButton.visible = ( state === PlayState.SHOW_ANSWER ) );
        nextButton && ( nextButton.visible = ( state === PlayState.NEXT ) );
      };
      this.playStateProperty = null; // @private will be set by activate()
    }

    /**
     * Connects this node to the model. Until this is called, the node is preloaded, but not fully functional.
     * @param {Property.<PlayState>} playStateProperty
     * @public
     */
    activate( playStateProperty ) {
      this.playStateProperty = playStateProperty;
      this.playStateProperty.link( this.playStateObserver ); // must be unlinked in dispose
    }

    /**
     * @public
     * @override
     */
    dispose() {
      this.checkButtonEnabledProperty.unlink( this.checkButtonEnabledObserver );
      if ( this.playStateProperty ) {
        this.playStateProperty.unlink( this.playStateObserver );
      }
      super.dispose();
    }

  }

  return reactantsProductsAndLeftovers.register( 'GameButtons', GameButtons );
} );
