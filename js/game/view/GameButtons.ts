// Copyright 2014-2023, University of Colorado Boulder

/**
 * Group of mutually-exclusive buttons that are used to advance a challenge through its states.
 * The buttons are 'Check', 'Try Again', 'Show Answer' and 'Next'.
 * Buttons are created on demand to improve overall performance of creating a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import VegasStrings from '../../../../vegas/js/VegasStrings.js';
import RPALColors from '../../common/RPALColors.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import GameModel from '../model/GameModel.js';
import PlayState from '../model/PlayState.js';

type SelfOptions = {
  maxTextWidth?: number;
};

type GameButtonOptions = SelfOptions & PickOptional<VBoxOptions, 'maxWidth'>;

export default class GameButtons extends VBox {

  private playStateProperty: EnumerationProperty<PlayState> | null;
  private playStateObserver: ( ( playState: PlayState ) => void );
  private readonly disposeGameButtons: () => void;

  public constructor( model: GameModel, checkButtonEnabledProperty: TReadOnlyProperty<boolean>, providedOptions?: GameButtonOptions ) {

    const options = optionize<GameButtonOptions, SelfOptions, VBoxOptions>()( {

      // SelfOptions
      maxTextWidth: 100
    }, providedOptions );

    const textPushButtonOptions: TextPushButtonOptions = {
      maxTextWidth: options.maxTextWidth,
      font: new PhetFont( { size: 20, weight: 'bold' } ),
      baseColor: RPALColors.GAME_BUTTON,
      opacity: 0.65,
      xMargin: 20,
      yMargin: 5,
      centerX: 0 // so that all buttons are center aligned
    };

    const checkButton = new TextPushButton( VegasStrings.checkStringProperty,
      combineOptions<TextPushButtonOptions>( {
        listener: () => model.check()
      }, textPushButtonOptions ) );

    const tryAgainButton = new TextPushButton( VegasStrings.tryAgainStringProperty,
      combineOptions<TextPushButtonOptions>( {
        listener: () => model.tryAgain()
      }, textPushButtonOptions ) );

    const showAnswerButton = new TextPushButton( VegasStrings.showAnswerStringProperty,
      combineOptions<TextPushButtonOptions>( {
        listener: () => model.showAnswer()
      }, textPushButtonOptions ) );

    const nextButton = new TextPushButton( VegasStrings.nextStringProperty,
      combineOptions<TextPushButtonOptions>( {
        listener: () => model.next()
      }, textPushButtonOptions ) );

    options.children = [ checkButton, tryAgainButton, showAnswerButton, nextButton ];

    super( options );

    // enable/disable the check button
    const checkButtonEnabledObserver = ( enabled: boolean ) => {
      checkButton.enabled = enabled;
    };
    checkButtonEnabledProperty.link( checkButtonEnabledObserver ); // must be unlinked in dispose

    // Show the button that corresponds to the PlayState.
    const playStateObserver = ( state: PlayState ) => {
      checkButton && ( checkButton.visible = ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK ) );
      tryAgainButton && ( tryAgainButton.visible = ( state === PlayState.TRY_AGAIN ) );
      showAnswerButton && ( showAnswerButton.visible = ( state === PlayState.SHOW_ANSWER ) );
      nextButton && ( nextButton.visible = ( state === PlayState.NEXT ) );
    };

    this.disposeGameButtons = () => {
      checkButton.dispose();
      tryAgainButton.dispose();
      showAnswerButton.dispose();
      nextButton.dispose();
      if ( checkButtonEnabledProperty.hasListener( checkButtonEnabledObserver ) ) {
        checkButtonEnabledProperty.unlink( checkButtonEnabledObserver );
      }
      if ( this.playStateProperty && this.playStateProperty.hasListener( this.playStateObserver ) ) {
        this.playStateProperty.unlink( this.playStateObserver );
      }
    };

    this.playStateProperty = null; // will be set by activate()
    this.playStateObserver = playStateObserver;
  }

  /**
   * Connects this node to the model. Until this is called, the node is preloaded, but not fully functional.
   */
  public activate( playStateProperty: EnumerationProperty<PlayState> ): void {
    this.playStateProperty = playStateProperty;
    this.playStateProperty.link( this.playStateObserver ); // must be unlinked in dispose
  }

  public override dispose(): void {
    this.disposeGameButtons();
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'GameButtons', GameButtons );