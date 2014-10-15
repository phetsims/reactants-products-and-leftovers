// Copyright 2002-2014, University of Colorado Boulder

/**
 * A substance is a participant in a chemical reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {number} coefficient
   * @param {string} symbol
   * @param {Node} node
   * @param {number} [quantity] defaults to zero
   * @constructor
   */
  function Substance( coefficient, symbol, node, quantity ) {

    quantity = quantity || 0;

    assert && assert( coefficient >= 0 );
    assert && assert( quantity >= 0 );

    this.symbol = symbol;

    PropertySet.call( this, {
      coefficient: coefficient,
      node: node, // mutable to support the 'custom sandwich' case
      quantity: quantity
    } );
  }

  return inherit( PropertySet, Substance, {

    /*
     * Are 2 substances the same?
     * @param {Substance} substance
     * @return {boolean}
     */
    equals: function( substance ) {
      return ( substance instanceof Substance &&
               this.coefficient === substance.coefficient &&
               this.symbol === substance.symbol &&
               this.node === this.node &&
               this.quantity === substance.quantity );
    }
  } );
} );
