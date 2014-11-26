// Copyright 2002-2014, University of Colorado Boulder

/**
 * Recipe for a sandwich.
 *<p>
 * For the purposes of the 'sandwiches' analogy:
 * <ul>
 * <li>sandwich recipe == reaction
 * <li>ingredients == reactants
 * <li>sandwich == product
 * </ul>
 * A 'custom' sandwich has mutable reactant coefficients, and the sandwich image changes based on those coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );
  var Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  // constants
  // used when the product is undefined, any invisible node with well-defined bounds
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

    var thisRecipe = this;
    thisRecipe.coefficientsMutable = options.coefficientsMutable;

    // sandwich ingredients (symbols are internal for sandwiches, no i18n required)
    var ingredients = [];
    var bread = new Substance( breadCount, 'bread', SandwichNode.createBreadNode() );
    var meat = new Substance( meatCount, 'meat', SandwichNode.createMeatNode() );
    var cheese = new Substance( cheeseCount, 'cheese', SandwichNode.createCheeseNode() );
    if ( breadCount > 0 || options.coefficientsMutable ) { ingredients.push( bread ); }
    if ( meatCount > 0 || options.coefficientsMutable ) { ingredients.push( meat ); }
    if ( cheeseCount > 0 || options.coefficientsMutable ) { ingredients.push( cheese ); }

    // sandwich image will be updated below
    thisRecipe.sandwich = new Substance( 1, 'sandwich', NO_SANDWICH_NODE );

    Reaction.call( thisRecipe, ingredients, [ thisRecipe.sandwich ], { name: name } );

    if ( options.coefficientsMutable ) {

      // Update the sandwich image to match the coefficients.
      var updateSandwichNode = function() {
        if ( thisRecipe.isReaction() ) {
          thisRecipe.sandwich.icon = new SandwichNode( bread.coefficient, meat.coefficient, cheese.coefficient );
        }
        else {
          thisRecipe.sandwich.icon = NO_SANDWICH_NODE;
        }
      };

      ingredients.forEach( function( ingredient ) {
        ingredient.coefficientProperty.link( thisRecipe.updateQuantities.bind( thisRecipe ) );
        ingredient.coefficientProperty.link( updateSandwichNode );
      } );
    }
    else {
      assert && assert( thisRecipe.isReaction() );
      thisRecipe.sandwich.icon = new SandwichNode( breadCount, meatCount, cheeseCount );
    }
  }

  // for analogy purposes, a sandwich recipe is a specialized type of reaction
  return inherit( Reaction, SandwichRecipe );
} );
