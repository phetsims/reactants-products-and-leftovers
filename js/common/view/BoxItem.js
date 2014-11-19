// Copyright 2002-2014, University of Colorado Boulder

/**
 * This is a data structure, useful the user interfaces that involve Before/After boxes.
 * Since it's used in several places, I chose to formalize its definition, rather than
 * rely on duck typing.
 * <p>
 * This is needed mainly because Reactants have 2 associated quantity properties:
 * quantity (before reaction) and leftovers (after reaction) and we want to
 * pass the correct quantity to the Before vs After user interface.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Property.<Node>} nodeProperty the node that represents some substance
   * @param {Property.<number>} quantityProperty the amount of the substance that we have
   * @param {number} centerX the node's horizontal position relative to the left edge of the box
   * @constructor
   */
  function BoxItem( nodeProperty, quantityProperty, centerX ) {
    this.nodeProperty = nodeProperty;
    this.quantityProperty = quantityProperty;
    this.centerX = centerX;
  }

  return inherit( Object, BoxItem );
} );
