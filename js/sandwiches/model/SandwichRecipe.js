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
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );

  // constants
  var NO_SANDWICH_NODE = new Rectangle( 0, 0, 5, 5 ); // used when the product is undefined, any invisible node with well-defined bounds

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
    var bread = new Reactant( breadCount, 'bread', SandwichNode.createBreadNode() );
    var meat =  new Reactant( meatCount, 'meat', SandwichNode.createMeatNode() );
    var cheese = new Reactant( cheeseCount, 'cheese', SandwichNode.createCheeseNode() );

    // sandwich image will be updated below
    thisRecipe.sandwich = new Product( 1, 'sandwich', NO_SANDWICH_NODE );

    var ingredients;
    if ( options.coefficientsMutable ) {
      // if coefficients are mutable, include all ingredients
      ingredients = [ bread, meat, cheese ];
    }
    else {
      // if coefficients are immutable, include all non-zero ingredients
      ingredients = [];
      if ( breadCount > 0 ) { ingredients.push( bread ); }
      if ( meatCount > 0 ) { ingredients.push( meat ); }
      if ( cheeseCount > 0 ) { ingredients.push( cheese ); }
    }

    Reaction.call( thisRecipe, ingredients, [ thisRecipe.sandwich ], { name: name } );

    if ( options.coefficientsMutable ) {

      // Update the sandwich image to match the coefficients.
      var updateSandwichNode = function() {
        if ( thisRecipe.isReaction() ) {
          thisRecipe.sandwich.node = new SandwichNode( bread.coefficient, meat.coefficient, cheese.coefficient );
        }
        else {
          thisRecipe.sandwich.node = NO_SANDWICH_NODE;
        }
      };

      ingredients.forEach( function( ingredient ) {
        ingredient.coefficientProperty.link( thisRecipe.update.bind( thisRecipe ) );
        ingredient.coefficientProperty.link( updateSandwichNode );
      } );
    }
    else {
      assert && assert( thisRecipe.isReaction() );
      thisRecipe.sandwich.node = new SandwichNode( breadCount, meatCount, cheeseCount );
    }
  }

  return inherit( Reaction, SandwichRecipe );
} );
