// Copyright 2014-2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color } from '../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';

// constants
const DARK_BLUE = new Color( 51, 118, 196 );

const RPALColors = {
  SCREEN_BACKGROUND: 'rgb( 218, 236, 255 )',
  PANEL_FILL: DARK_BLUE,
  BOX_STROKE: DARK_BLUE.withAlpha( 0.3 ),
  BOX_FILL: 'white',
  GAME_BUTTON: 'yellow' //TODO https://github.com/phetsims/reactants-products-and-leftovers/issues/81 PhetColorScheme.BUTTON_YELLOW
};

reactantsProductsAndLeftovers.register( 'RPALColors', RPALColors );
export default RPALColors;