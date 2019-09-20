// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model for the 'Sandwiches' screen.
 *
 * For the purposes of the 'sandwiches' analogy:
 * - sandwich recipe == reaction
 * - ingredients == reactants
 * - sandwich == product
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALBaseModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/RPALBaseModel' );
  const SandwichRecipe = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/SandwichRecipe' );

  // strings
  const cheeseString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/cheese' );
  const customString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/custom' );
  const meatAndCheeseString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/meatAndCheese' );

  /**
   * @constructor
   */
  function SandwichesModel() {
    RPALBaseModel.call( this,
      // sandwich recipe choices, numeric args are: bread, meat, cheese
      [
        new SandwichRecipe( cheeseString, 2, 0, 1 ),
        new SandwichRecipe( meatAndCheeseString, 2, 1, 1 ),
        // for Custom sandwich, the user can change coefficients of the ingredients
        new SandwichRecipe( customString, 0, 0, 0, { coefficientsMutable: true } )
      ] );
  }

  reactantsProductsAndLeftovers.register( 'SandwichesModel', SandwichesModel );

  return inherit( RPALBaseModel, SandwichesModel );
} );
