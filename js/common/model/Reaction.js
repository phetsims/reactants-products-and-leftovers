// Copyright 2014-2019, University of Colorado Boulder

/**
 * A chemical reaction is a process that leads to the transformation of one set of
 * chemical substances (reactants) to another (products).
 * The reactants that do not transform to products are referred to herein as leftovers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DevStringUtils = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevStringUtils' );
  const merge = require( 'PHET_CORE/merge' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  class Reaction {

    /**
     * @param {Substance[]} reactants
     * @param {Substance[]} products
     * @param {Object} [options]
     */
    constructor( reactants, products, options ) {

      assert && assert( reactants.length > 1, 'a reaction requires at least 2 reactants' );
      assert && assert( products.length > 0, 'a reaction requires at least 1 product' );

      options = merge( {
        name: null // {string|null} optional name, suitable for display to the user
      }, options );

      // @public
      this.name = options.name;
      this.reactants = reactants;
      this.products = products;

      // @public Create a leftover for each reactant, in the same order.
      this.leftovers = [];
      this.reactants.forEach( reactant => {
        this.leftovers.push( new Substance( 1, reactant.symbol, reactant.iconProperty.get(), 0 ) );
      } );

      this.reactants.forEach( reactant => {
        // internal, no corresponding unlink needed
        reactant.quantityProperty.link( this.updateQuantities.bind( this ) );
      } );
    }

    // @public
    reset() {
      this.reactants.forEach( reactant => reactant.reset() );
      this.products.forEach( product => product.reset() );
      this.leftovers.forEach( leftover => leftover.reset() );
    }

    // @public
    toString() {
      return DevStringUtils.equationString( this );
    }

    /**
     * Formula is a reaction if more than one coefficient is non-zero, or if any coefficient is > 1.
     * @returns {boolean}
     * @public
     */
    isReaction() {
      let greaterThanZero = 0;
      let greaterThanOne = 0;
      this.reactants.forEach( reactant => {
        if ( reactant.coefficientProperty.get() > 0 ) { greaterThanZero++; }
        if ( reactant.coefficientProperty.get() > 1 ) { greaterThanOne++; }
      } );
      return ( greaterThanZero > 1 || greaterThanOne > 0 );
    }

    /*
     * Updates the quantities of products and leftovers.
     * @protected
     */
    updateQuantities() {
      const numberOfReactions = this.getNumberOfReactions();
      this.products.forEach( product => {
        product.quantityProperty.set( numberOfReactions * product.coefficientProperty.get() );
      } );
      // reactants and leftovers array have identical orders
      for ( let i = 0; i < this.reactants.length; i++ ) {
        const quantity = this.reactants[ i ].quantityProperty.get() - ( numberOfReactions * this.reactants[ i ].coefficientProperty.get() );
        this.leftovers[ i ].quantityProperty.set( quantity );
      }
    }

    /**
     * Gets the number of reactions we have, based on the coefficients and reactant quantities.
     * For each reactant, we divide its quantity by its coefficient.
     * The smallest such value determines the number of reactions N that will occur.
     * @returns {number}
     * @private
     */
    getNumberOfReactions() {
      let numberOfReactions = 0;
      if ( this.isReaction() ) {
        const possibleValues = [];
        this.reactants.forEach( reactant => {
          if ( reactant.coefficientProperty.get() !== 0 ) {
            possibleValues.push( Math.floor( reactant.quantityProperty.get() / reactant.coefficientProperty.get() ) );
          }
        } );
        assert && assert( possibleValues.length > 0 );
        possibleValues.sort();
        numberOfReactions = possibleValues[ 0 ];
      }
      return numberOfReactions;
    }
  }

  return reactantsProductsAndLeftovers.register( 'Reaction', Reaction );
} );