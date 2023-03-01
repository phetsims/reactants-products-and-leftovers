// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * Developer controls for the 'Game' screen. i18n not required.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../phet-core/js/merge.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { HBox } from '../../../scenery/js/imports.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';

// constants
const BUTTON_OPTIONS = {
  font: new PhetFont( 10 ),
  baseColor: 'red',
  textFill: 'white'
};

export default class DevGameControls extends HBox {

  /**
   * @param {GameModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      spacing: 5
    }, options );

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