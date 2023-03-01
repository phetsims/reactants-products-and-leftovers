// Copyright 2014-2023, University of Colorado Boulder

/**
 * Developer controls for the 'Game' screen. i18n not required.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { HBox, HBoxOptions, NodeTranslationOptions } from '../../../scenery/js/imports.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import GameModel from '../game/model/GameModel.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';

// constants
const BUTTON_OPTIONS = {
  font: new PhetFont( 10 ),
  baseColor: 'red',
  textFill: 'white'
};

type SelfOptions = EmptySelfOptions;

type DevGameControlsOptions = SelfOptions & NodeTranslationOptions;

export default class DevGameControls extends HBox {

  public constructor( model: GameModel, providedOptions?: DevGameControlsOptions ) {

    const options = optionize<DevGameControlsOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: 5
    }, providedOptions );

    // replays the current challenge
    const replayButton = new TextPushButton( '<', BUTTON_OPTIONS );
    replayButton.addListener( () => model.replayCurrentChallenge() );

    // skips the current challenge
    const skipButton = new TextPushButton( '>', BUTTON_OPTIONS );
    skipButton.addListener( () => model.skipCurrentChallenge() );

    options.children = [ replayButton, skipButton ];
    super( options );
  }
}

reactantsProductsAndLeftovers.register( 'DevGameControls', DevGameControls );