// Copyright 2002-2014, University of Colorado Boulder

/**
 * Chemical reactions yield one or more products, which have properties different from the reactants.
 * This type adds no new functionality, it serves as a 'marker' type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  /**
   * @param {number} coefficient product's coefficient in the reaction equation
   * @param {string} symbol used in reaction equation
   * @param {Node} node visual representation of the product
   * @param {number} quantity quantity how much of the reactant we have before the reaction occurs
   * @constructor
   */
  function Product( coefficient, symbol, node, quantity ) {
    Substance.call( this, coefficient, symbol, node, quantity );
  }

  return inherit( Substance, Product, {

    /*
     * Are 2 products the same? AXON.Property observers are not considered.
     * @param {Product} product
     * @return {boolean}
     * @override
     */
    equals: function( product ) {
      return ( product instanceof Product &&
               Substance.prototype.equals.call( this, product ) );
    }
  }, {

    /**
     * Creates a copy of a product. AXON.Property observers are not copied.
     * @param {Product} product
     * @returns {Product}
     * @static
     */
    clone: function( product ) {
      return new Product( product.coefficient, product.symbol, product.node, product.quantity );
    },

    /**
     * Creates a copy of a product with a specified quantity. AXON.Property observers are not copied.
     * @param {Product} product
     * @param {number} quantity
     * @returns {Product}
     * @static
     */
    cloneWithQuantity: function( product, quantity ) {
      return new Product( product.coefficient, product.symbol, product.node, quantity );
    }
  } );
} );
