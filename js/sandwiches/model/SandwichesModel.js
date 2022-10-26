// Copyright 2014-2022, University of Colorado Boulder

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

import RPALBaseModel from '../../common/model/RPALBaseModel.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import SandwichRecipe from './SandwichRecipe.js';

class SandwichesModel extends RPALBaseModel {

  constructor() {
    super( [
      // sandwich recipe choices, numeric args are: bread, meat, cheese
      new SandwichRecipe( ReactantsProductsAndLeftoversStrings.cheeseStringProperty, 2, 0, 1 ),
      new SandwichRecipe( ReactantsProductsAndLeftoversStrings.meatAndCheeseStringProperty, 2, 1, 1 ),
      // for Custom sandwich, the user can change coefficients of the ingredients
      new SandwichRecipe( ReactantsProductsAndLeftoversStrings.customStringProperty, 0, 0, 0, { coefficientsMutable: true } )
    ] );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesModel', SandwichesModel );
export default SandwichesModel;