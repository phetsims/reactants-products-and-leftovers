// Copyright 2014-2019, University of Colorado Boulder

/**
 * An arrow that points from left to right, used in equations to point from reactants to products.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const merge = require( 'PHET_CORE/merge' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  class RightArrowNode extends ArrowNode {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        length: 70,
        tailWidth: 15,
        headWidth: 35,
        headHeight: 30
      }, options );

      super( 0, 0, options.length, 0, options );
    }
  }

  return reactantsProductsAndLeftovers.register( 'RightArrowNode', RightArrowNode );
} );
