// Copyright 2014-2020, University of Colorado Boulder

/**
 * Font used throughout this simulation.
 * Allows us to quickly change font properties for the entire simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

class RPALFont extends PhetFont {

  /**
   * @param {Object|number} options {Object} font options or {number} font size
   */
  constructor( options ) {

    // convenience for specifying font size only, e.g. new RPALFont(24)
    if ( typeof options === 'number' ) {
      options = { size: options };
    }

    // font attributes, as specified in the design document
    options = merge( {
      family: 'Arial'
    }, options );

    super( options );
  }
}

reactantsProductsAndLeftovers.register( 'RPALFont', RPALFont );
export default RPALFont;