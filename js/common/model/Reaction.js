// Copyright 2014-2017, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  /**
   * @param {Substance[]} reactants
   * @param {Substance[]} products
   * @param {Object} [options]
   * @constructor
   */
  function Reaction( reactants, products, options ) {

    assert && assert( reactants.length > 1, 'a reaction requires at least 2 reactants' );
    assert && assert( products.length > 0, 'a reaction requires at least 1 product' );

    options = _.extend( {
      name: null // {string|null} optional name, suitable for display to the user
    }, options );

    const self = this;

    // @public
    this.name = options.name;
    this.reactants = reactants;
    this.products = products;

    // @public Create a leftover for each reactant, in the same order.
    this.leftovers = [];
    this.reactants.forEach( function( reactant ) {
      self.leftovers.push( new Substance( 1, reactant.symbol, reactant.iconProperty.get(), 0 ) );
    } );

    this.reactants.forEach( function( reactant ) {
      // internal, no corresponding unlink needed
      reactant.quantityProperty.link( self.updateQuantities.bind( self ) );
    } );
  }

  reactantsProductsAndLeftovers.register( 'Reaction', Reaction );

  return inherit( Object, Reaction, {

    // @public
    reset: function() {
      this.reactants.forEach( function( reactant ) { reactant.reset(); } );
      this.products.forEach( function( product ) { product.reset(); } );
      this.leftovers.forEach( function( leftover ) { leftover.reset(); } );
    },

    // @public
    toString: function() {
      return DevStringUtils.equationString( this );
    },

    /**
     * Formula is a reaction if more than one coefficient is non-zero, or if any coefficient is > 1.
     * @returns {boolean}
     * @public
     */
    isReaction: function() {
      let greaterThanZero = 0;
      let greaterThanOne = 0;
      this.reactants.forEach( function( reactant ) {
        if ( reactant.coefficientProperty.get() > 0 ) { greaterThanZero++; }
        if ( reactant.coefficientProperty.get() > 1 ) { greaterThanOne++; }
      } );
      return ( greaterThanZero > 1 || greaterThanOne > 0 );
    },

    /*
     * Updates the quantities of products and leftovers.
     * @protected
     */
    updateQuantities: function() {
      const numberOfReactions = this.getNumberOfReactions();
      this.products.forEach( function( product ) {
        product.quantityProperty.set( numberOfReactions * product.coefficientProperty.get() );
      } );
      // reactants and leftovers array have identical orders
      for ( let i = 0; i < this.reactants.length; i++ ) {
        const quantity = this.reactants[ i ].quantityProperty.get() - ( numberOfReactions * this.reactants[ i ].coefficientProperty.get() );
        this.leftovers[ i ].quantityProperty.set( quantity );
      }
    },

    /**
     * Gets the number of reactions we have, based on the coefficients and reactant quantities.
     * For each reactant, we divide its quantity by its coefficient.
     * The smallest such value determines the number of reactions N that will occur.
     * @returns {number}
     * @private
     */
    getNumberOfReactions: function() {
      let numberOfReactions = 0;
      if ( this.isReaction() ) {
        const possibleValues = [];
        this.reactants.forEach( function( reactant ) {
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
  } );
} );