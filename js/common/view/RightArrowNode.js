// Copyright 2014-2015, University of Colorado Boulder

/**
 * An arrow that points from left to right, used in equations to point from reactants to products.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RightArrowNode( options ) {

    options = _.extend( {
      length: 70,
      tailWidth: 15,
      headWidth: 35,
      headHeight: 30
    }, options );

    ArrowNode.call( this, 0, 0, options.length, 0, options );
  }

  reactantsProductsAndLeftovers.register( 'RightArrowNode', RightArrowNode );

  return inherit( ArrowNode, RightArrowNode );
} );
