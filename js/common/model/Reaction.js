// Copyright 2002-2014, University of Colorado Boulder

/**
 * A chemical reaction is a process that leads to the transformation of one set of
 * chemical substances (reactants) to another (products).  The reactants that do not
 * transform to products are referred to herein as "leftovers".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Reactant[]} reactants
   * @param {Product[]} products
   * @param {Object} [options]
   * @constructor
   */
  function Reaction( reactants, products, options ) {

    assert && assert( reactants.length > 1, 'a reaction requires at least 2 reactants' );
    assert && assert( products.length > 0, 'a reaction requires at least 1 product' );

    options = _.extend( {
      name: null, // optional name, suitable for display to the user
      reactantCoefficientsMutable: false // whether the reactant coefficients are mutable
    }, options );

    var thisReaction = this;

    this.reactants = reactants;
    this.products = products;
    this.name = options.name;
    this.reactantCoefficientsMutable = options.reactantCoefficientsMutable;

    this.reactants.forEach( function( reactant ) {
      reactant.quantityProperty.link( thisReaction.update.bind( thisReaction ) );
      if ( options.reactantCoefficientsMutable ) {
        reactant.coefficientProperty.link( thisReaction.update.bind( thisReaction ) );
      }
      else {
        reactant.coefficientProperty.lazyLink( function() {
          throw new Error( 'unexpected coefficient change for reaction: ' + ( options.name || thisReaction.toString() ) );
        } );
      }
    } );
  }

  return inherit( Object, Reaction, {

    reset: function() {
       this.reactants.forEach( function( reactant ) { reactant.reset(); } );
       this.products.forEach( function( product ) { product.reset(); } );
    },

    /**
     * Formula is a reaction if more than one coefficient is non-zero, or if any coefficient is > 1.
     * @returns {boolean}
     */
    isReaction: function() {
      var greaterThanZero = 0;
      var greaterThanOne = 0;
      this.reactants.forEach( function( reactant ) {
        if ( reactant.coefficient > 0 ) { greaterThanZero++; }
        if ( reactant.coefficient > 1 ) { greaterThanOne++; }
      } );
      return ( greaterThanZero > 1 || greaterThanOne > 0 );
    },

    /*
     * Updates the quantities of products and leftovers.
     */
    update: function() {
      var numberOfReactions = this.getNumberOfReactions();
      this.products.forEach( function( product ) {
        product.quantity = numberOfReactions * product.coefficient;
      } );
      this.reactants.forEach( function( reactant ) {
        reactant.leftovers = reactant.quantity - ( numberOfReactions * reactant.coefficient );
      } );
    },

    /*
     * Gets the number of reactions we have, based on the coefficients and reactant quantities.
     * For each reactant, we divide its quantity by its coefficient.
     * The smallest such value determines the number of reactions N that will occur.
     * @returns {number}
     */
    getNumberOfReactions: function() {
      var numberOfReactions = 0;
      if ( this.isReaction() ) {
        var possibleValues = [];
        this.reactants.forEach( function( reactant ) {
          if ( reactant.coefficient !== 0 ) {
            possibleValues.push( Math.floor( reactant.quantity / reactant.coefficient ) );
          }
        } );
        assert && assert( possibleValues.length > 0 );
        possibleValues.sort();
        numberOfReactions = possibleValues[ 0 ];
      }
      return numberOfReactions;
    },

    /**
     * DEBUG
     * String representation of the reaction.
     * @returns {string}
     */
    toString: function() {
      return this.getEquationString() + ' ' + this.getQuantitiesString();
    },

    /**
     * DEBUG
     * A string representation of the reaction, with HTML stripped out.
     * @returns {string}
     */
    getEquationString: function() {
      var s = '';
      for ( var i = 0; i < this.reactants.length; i++ ) {
        if ( i !== 0 ) { s += '+ '; }
        s += ( this.reactants[i].coefficient + ' ' + this.reactants[i].molecule.symbol + ' ' );
      }
      s += '-> ';
      for ( i = 0; i < this.products.length; i++ ) {
        if ( i !== 0 ) { s += '+ '; }
        s += ( this.products[i].coefficient + ' ' + this.products[i].molecule.symbol + ' ' );
      }
      return s.replace( /<sub>/g, '' ).replace( /<sub>/g, '' );
    },

    /**
     * DEBUG
     * String representation of the quantities involved in the reaction.
     * Example: 4,1 -> 1,2,2,0
     * @returns {string}
     */
    getQuantitiesString: function() {
      var s = '';
      // reactants
      for ( var i = 0; i < this.reactants.length; i++ ) {
        if ( i !== 0 ) { s += ','; }
        s += this.reactants[i].quantity;
      }
      // arrow
      s += '->';
      // products
      for ( i = 0; i < this.products.length; i++ ) {
        if ( i !== 0 ) { s += ','; }
        s += this.products[i].quantity;
      }
      // leftovers
      for ( i = 0; i < this.reactants.length; i++ ) {
        s += ',';
        s += this.reactants[i].leftovers;
      }
      return s;
    }
  } );
} );