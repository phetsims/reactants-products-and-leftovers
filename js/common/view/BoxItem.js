// Copyright 2002-2014, University of Colorado Boulder

/**
 * This is a data structure, useful in the user interfaces that involve Before/After boxes.
 * Since it's used in several places, I chose to formalize its definition, rather than
 * rely on duck typing.
 * <p>
 * This is needed mainly because Reactants have 2 associated quantity properties:
 * quantity (before reaction) and leftovers (after reaction) and we want to
 * pass the correct quantity to the Before vs After user interface.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Property.<Node>} nodeProperty the node that represents some substance
   * @param {Property.<number>} quantityProperty the amount of the substance that we have
   * @param {number} centerX the node's horizontal position relative to the left edge of the box
   * @constructor
   */
  function BoxItem( nodeProperty, quantityProperty, centerX ) {
    this.nodeProperty = nodeProperty;
    this.quantityProperty = quantityProperty;
    this.centerX = centerX;
  }

  return inherit( Object, BoxItem, {}, {

    /**
     * Creates items for the 'Before' side of a reaction equation.
     * @param {[Reactant]} reactants
     * @param {number} boxWidth
     * @returns {[BoxItem]}
     * @static
     */
    createBeforeBoxItems: function( reactants, boxWidth ) {
      var beforeItems = [];
      var xMargin = ( reactants.length > 2 ) ? 0 : ( 0.15 * boxWidth ); // make 2-reactant case look nice
      var deltaX = ( boxWidth - ( 2 * xMargin ) ) / reactants.length;
      var centerX = xMargin + ( deltaX / 2 );
      reactants.forEach( function( reactant ) {
        beforeItems.push( new BoxItem( reactant.nodeProperty, reactant.quantityProperty, centerX ) );
        centerX += deltaX;
      } );
      return beforeItems;
    },

    /**
     * Creates items for the 'After' side of a reaction equation.
     * @param {[Product]} products
     * @param {[Reactant]} reactants in this case, the leftovers
     * @param {number} boxWidth
     * @returns {[BoxItem]}
     * @static
     */
    createAfterBoxItems: function( products, reactants, boxWidth ) {
      var afterItems = [];
      var deltaX = boxWidth / ( products.length + reactants.length );
      var centerX = deltaX / 2;
      products.forEach( function( product ) {
        afterItems.push( new BoxItem( product.nodeProperty, product.quantityProperty, centerX ) );
        centerX += deltaX;
      } );
      reactants.forEach( function( reactant ) {
        // for 'After', we use display each reactant's leftovers quantity
        afterItems.push( new BoxItem( reactant.nodeProperty, reactant.leftoversProperty, centerX ) );
        centerX += deltaX;
      } );
      return afterItems;
    }
  } );
} );
