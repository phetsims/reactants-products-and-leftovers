// Copyright 2002-2014, University of Colorado

/**
 * An arrow that points from left to right, used in equations to point from reactants to products.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );

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

  return inherit( ArrowNode, RightArrowNode );
} );
