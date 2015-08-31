// Copyright 2002-2014, University of Colorado Boulder

/**
 * A chemical reaction is a process that leads to the transformation of one set of
 * chemical substances (reactants) to another (products).
 * The reactants that do not transform to products are referred to herein as leftovers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DevStringUtils = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevStringUtils' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

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

    var thisReaction = this;

    // @public
    thisReaction.name = options.name;
    thisReaction.reactants = reactants;
    thisReaction.products = products;

    // @public Create a leftover for each reactant, in the same order.
    thisReaction.leftovers = [];
    thisReaction.reactants.forEach( function( reactant ) {
      thisReaction.leftovers.push( new Substance( 1, reactant.symbol, reactant.icon, 0 ) );
    } );

    thisReaction.reactants.forEach( function( reactant ) {
      // internal, no corresponding unlink needed
      reactant.quantityProperty.link( thisReaction.updateQuantities.bind( thisReaction ) );
    } );
  }

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
     * @protected
     */
    updateQuantities: function() {
      var numberOfReactions = this.getNumberOfReactions();
      this.products.forEach( function( product ) {
        product.quantity = numberOfReactions * product.coefficient;
      } );
      // reactants and leftovers array have identical orders
      for ( var i = 0; i < this.reactants.length; i++ ) {
        this.leftovers[ i ].quantity = this.reactants[ i ].quantity - ( numberOfReactions * this.reactants[ i ].coefficient );
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
    }
  } );
} );