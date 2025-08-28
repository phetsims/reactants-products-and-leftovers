// Copyright 2023-2025, University of Colorado Boulder

/**
 * SandwichesSceneNode is the scene for one sandwich recipe (reaction) in the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALSceneNode, { RPALSceneNodeOptions } from '../../common/view/RPALSceneNode.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import SandwichRecipe from '../model/SandwichRecipe.js';
import SandwichNode from './SandwichNode.js';

type SelfOptions = EmptySelfOptions;

export type SandwichesSceneNodeOptions = SelfOptions & RPALSceneNodeOptions;

export default class SandwichesSceneNode extends RPALSceneNode<SandwichRecipe> {

  /**
   * @param reaction - the reaction (sandwich) to be displayed by this scene
   * @param reactionProperty - the selected reaction (sandwich)
   * @param beforeExpandedProperty - whether the 'Before' box is expanded
   * @param afterExpandedProperty - whether the 'After' box is expanded
   * @param providedOptions
   */
  public constructor( reaction: SandwichRecipe,
                      reactionProperty: TReadOnlyProperty<SandwichRecipe>,
                      beforeExpandedProperty: Property<boolean>,
                      afterExpandedProperty: Property<boolean>,
                      providedOptions: SandwichesSceneNodeOptions ) {

    // compute the size of the largest sandwich, used for view layout
    const maxCoefficient = RPALConstants.SANDWICH_COEFFICIENT_RANGE.max;
    const maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient );
    const maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    const options = optionize<SandwichesSceneNodeOptions, SelfOptions, RPALSceneNodeOptions>()( {
      contentSize: RPALConstants.SANDWICHES_BEFORE_AFTER_BOX_SIZE,
      showSymbols: false,
      beforeTitleProperty: ReactantsProductsAndLeftoversStrings.beforeSandwichStringProperty,
      afterTitleProperty: ReactantsProductsAndLeftoversStrings.afterSandwichStringProperty,
      minIconSize: maxSandwichSize,
      boxYMargin: 8 // large enough to accommodate the biggest sandwich
    }, providedOptions );

    super( reaction, reactionProperty, beforeExpandedProperty, afterExpandedProperty, options );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesSceneNode', SandwichesSceneNode );