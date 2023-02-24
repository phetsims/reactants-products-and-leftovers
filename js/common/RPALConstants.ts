// Copyright 2014-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';

const RPALConstants = {

  SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 835, 504 ) },
  MOLECULE_NODE_OPTIONS: {
    atomNodeOptions: {
      stroke: 'black',
      lineWidth: 0.5,
      scale: 1
    }
  },
  QUANTITY_RANGE: new Range( 0, 8 ),
  SANDWICH_COEFFICIENT_RANGE: new Range( 0, 3 ),
  RESET_ALL_BUTTON_SCALE: 0.75,

  // box size requested to be configurable per screen
  SANDWICHES_BEFORE_AFTER_BOX_SIZE: new Dimension2( 310, 240 ),
  MOLECULES_BEFORE_AFTER_BOX_SIZE: new Dimension2( 310, 240 ),
  GAME_BEFORE_AFTER_BOX_SIZE: new Dimension2( 330, 240 ),

  SPINNER_OPTIONS: {
    numberDisplayOptions: {
      align: 'center',
      xMargin: 5,
      yMargin: 3,
      backgroundLineWidth: 0.5,
      textOptions: {
        font: new PhetFont( 28 )
      }
    },
    touchAreaXDilation: 20,
    touchAreaYDilation: 10
  }
};

reactantsProductsAndLeftovers.register( 'RPALConstants', RPALConstants );
export default RPALConstants;