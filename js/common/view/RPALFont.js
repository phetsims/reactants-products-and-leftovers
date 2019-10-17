// Copyright 2014-2019, University of Colorado Boulder

/**
 * Font used throughout this simulation.
 * Allows us to quickly change font properties for the entire simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  /**
   * @param {Object|number} options {Object} font options or {number} font size
   * @constructor
   */
  function RPALFont( options ) {

    // convenience for specifying font size only, e.g. new RPALFont(24)
    if ( typeof options === 'number' ) {
      options = { size: options };
    }

    // font attributes, as specified in the design document
    options = merge( {
      family: 'Arial'
    }, options );

    PhetFont.call( this, options );
  }

  reactantsProductsAndLeftovers.register( 'RPALFont', RPALFont );

  return inherit( PhetFont, RPALFont );
} );
