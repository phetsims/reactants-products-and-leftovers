// Copyright 2014-2023, University of Colorado Boulder

/**
 * SandwichesScreenView is the view for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RPALConstants from '../../common/RPALConstants.js';
import { CreateEquationNodeFunction } from '../../common/view/ReactionBarNode.js';
import RPALScreenView, { CreateSceneNodeFunction } from '../../common/view/RPALScreenView.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SandwichesModel from '../model/SandwichesModel.js';
import SandwichRecipe from '../model/SandwichRecipe.js';
import SandwichesEquationNode from './SandwichesEquationNode.js';
import SandwichesSceneNode from './SandwichesSceneNode.js';
import SandwichNode from './SandwichNode.js';

export default class SandwichesScreenView extends RPALScreenView<SandwichRecipe> {

  public constructor( model: SandwichesModel, tandem: Tandem ) {

    // compute the size of the largest sandwich, used for view layout
    const maxCoefficient = RPALConstants.SANDWICH_COEFFICIENT_RANGE.max;
    const maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient );
    const maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    // Creates an equation for a specified reaction.
    const createEquationNode: CreateEquationNodeFunction<SandwichRecipe> =
      ( reaction, visibleProperty ) => new SandwichesEquationNode( reaction, maxSandwichSize, visibleProperty );

    // Creates the user interface for a specified reaction.
    const createSceneNode: CreateSceneNodeFunction<SandwichRecipe> =
      ( reaction, beforeExpandedProperty, afterExpandedProperty, options ) =>
        new SandwichesSceneNode( reaction, model.reactionProperty, beforeExpandedProperty, afterExpandedProperty, options );

    super( model, createEquationNode, createSceneNode, tandem );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesScreenView', SandwichesScreenView );