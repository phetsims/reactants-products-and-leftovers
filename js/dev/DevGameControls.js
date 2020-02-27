// Copyright 2014-2020, University of Colorado Boulder

/**
 * Developer controls for the 'Game' screen. i18n not required.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../phet-core/js/merge.js';
import LayoutBox from '../../../scenery/js/nodes/LayoutBox.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import RPALFont from '../common/view/RPALFont.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';

// constants
const BUTTON_OPTIONS = {
  font: new RPALFont( 10 ),
  baseColor: 'red',
  textFill: 'white'
};

class DevGameControls extends LayoutBox {

  /**
   * @param {GameModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      orientation: 'horizontal',
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
export default DevGameControls;