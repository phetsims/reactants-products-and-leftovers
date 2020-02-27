// Copyright 2014-2019, University of Colorado Boulder

/**
 * A substance is a participant in a chemical reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  class Substance {

    /**
     * @param {number} coefficient substance's coefficient in the reaction equation
     * @param {string} symbol used in reaction equation
     * @param {Node} icon visual representation of the substance
     * @param {number} [quantity] how much of a substance we have, defaults to zero
     */
    constructor( coefficient, symbol, icon, quantity ) {

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

    // @public
    reset() {
      this.coefficientProperty.reset();
      this.iconProperty.reset();
      this.quantityProperty.reset();
    }

    /*
     * Are 2 substances the same? AXON.Property observers are not considered.
     * @param {Substance} substance
     * @returns {boolean}
     * @public
     */
    equals( substance ) {
      return ( substance instanceof Substance &&
               this.symbol === substance.symbol &&
               this.coefficientProperty.get() === substance.coefficientProperty.get() &&
               this.iconProperty.get() === substance.iconProperty.get() &&
               this.quantityProperty.get() === substance.quantityProperty.get() );
    }

    /**
     * Creates a shallow copy of a substance. AXON.Property observers are not copied.
     * @param {Substance} substance
     * @returns {Substance}
     * @static
     * @public
     */
    static clone( substance ) {
      return new Substance( substance.coefficientProperty.get(), substance.symbol, substance.iconProperty.get(), substance.quantityProperty.get() );
    }

    /**
     * Creates a shallow copy of a substance with a specified quantity. AXON.Property observers are not copied.
     * @param {Substance} substance
     * @param {number} quantity
     * @returns {Substance}
     * @static
     * @public
     */
    static withQuantity( substance, quantity ) {
      return new Substance( substance.coefficientProperty.get(), substance.symbol, substance.iconProperty.get(), quantity );
    }
  }

  return reactantsProductsAndLeftovers.register( 'Substance', Substance );
} );
