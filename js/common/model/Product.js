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
   * @param {number} coefficient
   * @param {string} symbol
   * @param {Node} node
   * @param {number} quantity
   * @constructor
   */
  function Product( coefficient, symbol, node, quantity ) {
    Substance.call( this, coefficient, symbol, node, quantity );
  }

  return inherit( Substance, Product, {

    /*
     * Are 2 products the same?
     * @param {Product} product
     * @return {boolean}
     * @override
     */
    equals: function( product ) {
      return ( product instanceof Product &&
               Substance.prototype.equals.call( this, product ) );
    }
  } );
} );
