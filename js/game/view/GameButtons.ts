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
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import VegasStrings from '../../../../vegas/js/VegasStrings.js';
import RPALColors from '../../common/RPALColors.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import GameModel from '../model/GameModel.js';
import PlayState from '../model/PlayState.js';

type SelfOptions = {
  maxTextWidth?: number;
};

type GameButtonOptions = SelfOptions & NodeTranslationOptions & PickOptional<NodeOptions, 'maxWidth'>;

export default class GameButtons extends Node {

  private playStateProperty: EnumerationProperty<PlayState> | null;
  private playStateObserver: ( ( playState: PlayState ) => void );
  private readonly disposeGameButtons: () => void;

  public constructor( model: GameModel, checkButtonEnabledProperty: TReadOnlyProperty<boolean>, providedOptions?: GameButtonOptions ) {

    const options = optionize<GameButtonOptions, SelfOptions, NodeOptions>()( {

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

    // Check button is needed immediately. Create it so this node has well-defined bounds (needed for layout).
    const checkButton = new TextPushButton( VegasStrings.checkStringProperty, textPushButtonOptions );
    checkButton.addListener( () => model.check() );
    options.children = [ checkButton ];

    super( options );

    // enable/disable the check button
    const checkButtonEnabledObserver = ( enabled: boolean ) => {
      checkButton.enabled = enabled;
    };
    checkButtonEnabledProperty.link( checkButtonEnabledObserver ); // must be unlinked in dispose

    // other buttons, created on demand
    let tryAgainButton: TextPushButton;
    let showAnswerButton: TextPushButton;
    let nextButton: TextPushButton;

    const playStateObserver = ( state: PlayState ) => {

      // create buttons on demand
      if ( !tryAgainButton && state === PlayState.TRY_AGAIN ) {
        tryAgainButton = new TextPushButton( VegasStrings.tryAgainStringProperty, textPushButtonOptions );
        this.addChild( tryAgainButton );
        tryAgainButton.addListener( () => model.tryAgain() );
      }

      if ( !showAnswerButton && state === PlayState.SHOW_ANSWER ) {
        showAnswerButton = new TextPushButton( VegasStrings.showAnswerStringProperty, textPushButtonOptions );
        this.addChild( showAnswerButton );
        showAnswerButton.addListener( () => model.showAnswer() );
      }

      if ( !nextButton && state === PlayState.NEXT ) {
        nextButton = new TextPushButton( VegasStrings.nextStringProperty, textPushButtonOptions );
        this.addChild( nextButton );
        nextButton.addListener( () => model.next() );
      }

      // make the proper button visible for the {PlayState} state
      checkButton && ( checkButton.visible = ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK ) );
      tryAgainButton && ( tryAgainButton.visible = ( state === PlayState.TRY_AGAIN ) );
      showAnswerButton && ( showAnswerButton.visible = ( state === PlayState.SHOW_ANSWER ) );
      nextButton && ( nextButton.visible = ( state === PlayState.NEXT ) );
    };

    this.disposeGameButtons = () => {
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