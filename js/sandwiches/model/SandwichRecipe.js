// Copyright 2014-2017, University of Colorado Boulder

/**
 * Recipe for a sandwich.
 *
 * For the purposes of the 'sandwiches' analogy:
 * - sandwich recipe == reaction
 * - ingredients == reactants
 * - sandwich == product
 *
 * A 'custom' sandwich has mutable reactant coefficients, and the sandwich image changes based on those coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );
  const Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  // constants
  // used when the product is undefined, this can be any non-visible node with well-defined bounds
  var NO_SANDWICH_NODE = new Rectangle( 0, 0, 5, 5 );

  /**
   * @param {string} name
   * @param {number} breadCount
   * @param {number} meatCount
   * @param {number} cheeseCount
   * @param {Object} [options]
   * @constructor
   */
  function SandwichRecipe( name, breadCount, meatCount, cheeseCount, options ) {

    assert && assert( breadCount >= 0 && meatCount >= 0 && cheeseCount >= 0 );

    options = _.extend( {
      coefficientsMutable: false // {boolean} can coefficients of the ingredients can be changed?
    }, options );

    var self = this;
    this.coefficientsMutable = options.coefficientsMutable; // @public

    // sandwich ingredients (symbols are internal for sandwiches, no i18n required)
    var ingredients = [];
    var bread = new Substance( breadCount, 'bread', SandwichNode.createBreadNode() );
    var meat = new Substance( meatCount, 'meat', SandwichNode.createMeatNode() );
    var cheese = new Substance( cheeseCount, 'cheese', SandwichNode.createCheeseNode() );
    if ( breadCount > 0 || options.coefficientsMutable ) { ingredients.push( bread ); }
    if ( meatCount > 0 || options.coefficientsMutable ) { ingredients.push( meat ); }
    if ( cheeseCount > 0 || options.coefficientsMutable ) { ingredients.push( cheese ); }

    // @public sandwich image will be updated below
    this.sandwich = new Substance( 1, 'sandwich',
      options.coefficientsMutable ? NO_SANDWICH_NODE : new SandwichNode( breadCount, meatCount, cheeseCount ) );

    Reaction.call( this, ingredients, [ this.sandwich ], { name: name } );

    if ( options.coefficientsMutable ) {

      // Update the sandwich image to match the coefficients.
      var updateSandwichNode = function() {
        if ( self.isReaction() ) {
          self.sandwich.iconProperty.set(
            new SandwichNode( bread.coefficientProperty.get(), meat.coefficientProperty.get(), cheese.coefficientProperty.get() ) );
        }
        else {
          self.sandwich.iconProperty.set( NO_SANDWICH_NODE );
        }
      };

      ingredients.forEach( function( ingredient ) {
        // unlink is unnecessary because these properties exist for the lifetime of the simulation
        ingredient.coefficientProperty.link( self.updateQuantities.bind( self ) );
        ingredient.coefficientProperty.link( updateSandwichNode );
      } );
    }
    else {
      assert && assert( this.isReaction() );
    }
  }

  reactantsProductsAndLeftovers.register( 'SandwichRecipe', SandwichRecipe );

  // for analogy purposes, a sandwich recipe is a specialized type of reaction
  return inherit( Reaction, SandwichRecipe );
} );
