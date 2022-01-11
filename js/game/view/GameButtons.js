// Copyright 2014-2021, University of Colorado Boulder

/**
 * Group of mutually-exclusive buttons that are used to advance a challenge through its states.
 * The buttons are 'Check', 'Try Again', 'Show Answer' and 'Next'.
 * Buttons are created on demand to improve overall performance of creating a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import vegasStrings from '../../../../vegas/js/vegasStrings.js';
import RPALColors from '../../common/RPALColors.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import PlayState from '../model/PlayState.js';

const checkString = vegasStrings.check;
const nextString = vegasStrings.next;
const showAnswerString = vegasStrings.showAnswer;
const tryAgainString = vegasStrings.tryAgain;

// constants
const BUTTON_OPTIONS = {
  font: new PhetFont( { size: 20, weight: 'bold' } ),
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
    checkButton.addListener( () => model.check() );

    // enable/disable the check button
    this.checkButtonEnabledObserver = enabled => { checkButton.enabled = enabled; }; // @private
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
        tryAgainButton.addListener( () => model.tryAgain() );

        // pdom
        tryAgainButton.focus();
      }

      if ( !showAnswerButton && state === PlayState.SHOW_ANSWER ) {
        showAnswerButton = new TextPushButton( showAnswerString, BUTTON_OPTIONS );
        this.addChild( showAnswerButton );
        showAnswerButton.addListener( () => model.showAnswer() );

        // pdom
        showAnswerButton.focus();
      }

      if ( !nextButton && state === PlayState.NEXT ) {
        nextButton = new TextPushButton( nextString, BUTTON_OPTIONS );
        this.addChild( nextButton );
        nextButton.addListener( () => model.next() );

        // pdom
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
   * @param {EnumerationDeprecatedProperty.<PlayState>} playStateProperty
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

reactantsProductsAndLeftovers.register( 'GameButtons', GameButtons );
export default GameButtons;