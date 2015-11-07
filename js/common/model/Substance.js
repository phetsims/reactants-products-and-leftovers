// Copyright 2014-2015, University of Colorado Boulder

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
   * @param {number} coefficient substance's coefficient in the reaction equation
   * @param {string} symbol used in reaction equation
   * @param {Node} icon visual representation of the substance
   * @param {number} [quantity] how much of a substance we have, defaults to zero
   * @constructor
   */
  function Substance( coefficient, symbol, icon, quantity ) {

    quantity = quantity || 0;

    assert && assert( coefficient >= 0 );
    assert && assert( quantity >= 0 );

    this.symbol = symbol; // @public {string}

    PropertySet.call( this, {

      // @public {number} substance's coefficient in the reaction equation, mutable to support 'Custom' sandwich
      coefficient: coefficient,

      // @public {Node} visual representation of the substance, mutable to support the 'Custom' sandwich
      icon: icon,

      // @public {number} how much of the substance we have
      quantity: quantity
    } );
  }

  return inherit( PropertySet, Substance, {

    /*
     * Are 2 substances the same? AXON.Property observers are not considered.
     * @param {Substance} substance
     * @return {boolean}
     * @public
     */
    equals: function( substance ) {
      return ( substance instanceof Substance &&
               this.symbol === substance.symbol &&
               this.coefficient === substance.coefficient &&
               this.icon === substance.icon &&
               this.quantity === substance.quantity );
    }
  }, {

    /**
     * Creates a shallow copy of a substance. AXON.Property observers are not copied.
     * @param {Substance} substance
     * @returns {Substance}
     * @static
     * @public
     */
    clone: function( substance ) {
      return new Substance( substance.coefficient, substance.symbol, substance.icon, substance.quantity );
    },

    /**
     * Creates a shallow copy of a substance with a specified quantity. AXON.Property observers are not copied.
     * @param {Substance} substance
     * @param {number} quantity
     * @returns {Substance}
     * @static
     * @public
     */
    withQuantity: function( substance, quantity ) {
      return new Substance( substance.coefficient, substance.symbol, substance.icon, quantity );
    }
  } );
} );
