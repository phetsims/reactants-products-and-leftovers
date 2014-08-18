// Copyright 2002-2014, University of Colorado

/**
 * An arrow that points left to right, from reactants to products.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );

  /**
   * @param {*} options
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
