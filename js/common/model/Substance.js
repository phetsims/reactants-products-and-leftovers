// Copyright 2014-2017, University of Colorado Boulder

/**
 * A substance is a participant in a chemical reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

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

    // @public {number} substance's coefficient in the reaction equation, mutable to support 'Custom' sandwich
    this.coefficientProperty = new NumberProperty( coefficient );

    // @public {Node} visual representation of the substance, mutable to support the 'Custom' sandwich
    this.iconProperty = new Property( icon );

    // @public {number} how much of the substance we have
    this.quantityProperty = new NumberProperty( quantity );
  }

  reactantsProductsAndLeftovers.register( 'Substance', Substance );

  return inherit( Object, Substance, {

    // @public
    reset: function() {
      this.coefficientProperty.reset();
      this.iconProperty.reset();
      this.quantityProperty.reset();
    },

    /*
     * Are 2 substances the same? AXON.Property observers are not considered.
     * @param {Substance} substance
     * @returns {boolean}
     * @public
     */
    equals: function( substance ) {
      return ( substance instanceof Substance &&
               this.symbol === substance.symbol &&
               this.coefficientProperty.get() === substance.coefficientProperty.get() &&
               this.iconProperty.get() === substance.iconProperty.get() &&
               this.quantityProperty.get() === substance.quantityProperty.get() );
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
      return new Substance( substance.coefficientProperty.get(), substance.symbol, substance.iconProperty.get(), substance.quantityProperty.get() );
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
      return new Substance( substance.coefficientProperty.get(), substance.symbol, substance.iconProperty.get(), quantity );
    }
  } );
} );
