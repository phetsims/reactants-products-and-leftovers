// Copyright 2014-2023, University of Colorado Boulder

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

import Tandem from '../../../../tandem/js/Tandem.js';
import RPALBaseModel from '../../common/model/RPALBaseModel.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import SandwichRecipe from './SandwichRecipe.js';

export default class SandwichesModel extends RPALBaseModel {

  public constructor( tandem: Tandem ) {

    const reactions = [

      // sandwich recipe choices, numeric args are: bread, meat, cheese
      new SandwichRecipe( ReactantsProductsAndLeftoversStrings.cheeseStringProperty, 2, 0, 1 ),
      new SandwichRecipe( ReactantsProductsAndLeftoversStrings.meatAndCheeseStringProperty, 2, 1, 1 ),

      // for Custom sandwich, the user can change coefficients of the ingredients
      new SandwichRecipe( ReactantsProductsAndLeftoversStrings.customStringProperty, 0, 0, 0, {
        coefficientsMutable: true
      } )
    ];

    super( reactions, tandem );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesModel', SandwichesModel );