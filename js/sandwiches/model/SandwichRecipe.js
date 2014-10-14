// Copyright 2002-2014, University of Colorado Boulder

/**
 * Recipe for a sandwich. For the purposes of the 'sandwiches' analogy, a sandwich recipe is treated like a reaction,
 * ingredients are analogous to reactants, the sandwich is analogous to a product.
 * A custom sandwich has mutable reactant coefficients, and the sandwich image changes based on those coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Molecule = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Molecule' );
  var MoleculeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/MoleculeFactory' );
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );

  // images
  var breadImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/bread.png' );
  var cheeseImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/cheese.png' );
  var meatImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/meat.png' );

  // constants
  var NO_SANDWICH_NODE = new Rectangle( 0, 0, 5, 5 ); // used when the product is undefined, any invisible node with well-defined bounds

  // sandwich ingredients (name is internal, no i18n required)
  var createIngredient = function( name, count, image ) {
    return new Reactant( count, new Molecule( name, new Image( image, { scale: RPALConstants.SANDWICH_IMAGE_SCALE } ) ) );
  };

  /**
   * @param {string} name
   * @param {number} breadCount
   * @param {number} meatCount
   * @param {number} cheeseCount
   * @param {Object} [options]
   * @constructor
   */
  function SandwichRecipe( name, breadCount, meatCount, cheeseCount, options ) {

    assert && assert( breadCount > 0 && meatCount > 0 && cheeseCount > 0 );

    options = _.extend( {
      coefficientsMutable: false // {boolean} can coefficients of the ingredients can be changed?
    }, options );

    var thisReaction = this;
    this.coefficientsMutable = options.coefficientsMutable; // @public

    // sandwich ingredients (names are internal, no i18n required)
    var bread = createIngredient( 'bread', breadCount, breadImage );
    var meat =  createIngredient( 'meat', meatCount, meatImage );
    var cheese = createIngredient( 'cheese', cheeseCount, cheeseImage );

    // sandwich image will be updated below
    var sandwich = new Product( 1, new Molecule( 'sandwich', NO_SANDWICH_NODE ) );

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

    Reaction.call( thisReaction, ingredients, [ sandwich ], { name: name } );

    if ( options.coefficientsMutable ) {

      // Update the sandwich image to match the coefficients.
      var updateSandwichNode = function() {
        if ( thisReaction.isReaction() ) {
          sandwich.molecule.node = new SandwichNode( bread.coefficient, meat.coefficient, cheese.coefficient,
            { scale: RPALConstants.SANDWICH_IMAGE_SCALE } );
        }
        else {
          sandwich.molecule.node = NO_SANDWICH_NODE;
        }
      };

      ingredients.forEach( function( ingredient ) {
        ingredient.coefficientProperty.link( thisReaction.update.bind( thisReaction ) );
        ingredient.coefficientProperty.link( updateSandwichNode );
      } );
    }
    else {
      assert && assert( thisReaction.isReaction() );
      sandwich.molecule.node = new SandwichNode( breadCount, meatCount, cheeseCount,
        { scale: RPALConstants.SANDWICH_IMAGE_SCALE } );
    }
  }

  return inherit( Reaction, SandwichRecipe );
} );
