// Copyright 2014-2020, University of Colorado Boulder

/**
 * Font used throughout this simulation.
 * Allows us to quickly change font properties for the entire simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

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

  return reactantsProductsAndLeftovers.register( 'RPALFont', RPALFont );
} );
