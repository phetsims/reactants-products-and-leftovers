// Copyright 2023-2024, University of Colorado Boulder

/**
 * MoleculesSceneNode is the scene for one reaction in the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Reaction from '../../common/model/Reaction.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALSceneNode, { RPALSceneNodeOptions } from '../../common/view/RPALSceneNode.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

type SelfOptions = EmptySelfOptions;

type MoleculesSceneNodeOptions = SelfOptions & RPALSceneNodeOptions;

export default class MoleculesSceneNode extends RPALSceneNode {

  /**
   * @param reaction - the reaction to be displayed by this scene
   * @param reactionProperty - the selected reaction
   * @param beforeExpandedProperty - whether the 'Before' box is expanded
   * @param afterExpandedProperty - whether the 'After' box is expanded
   * @param providedOptions
   */
  public constructor( reaction: Reaction,
                      reactionProperty: TReadOnlyProperty<Reaction>,
                      beforeExpandedProperty: Property<boolean>,
                      afterExpandedProperty: Property<boolean>,
                      providedOptions: MoleculesSceneNodeOptions ) {

    const options = optionize<MoleculesSceneNodeOptions, SelfOptions, RPALSceneNodeOptions>()( {
      contentSize: RPALConstants.MOLECULES_BEFORE_AFTER_BOX_SIZE,
      minIconSize: new Dimension2( 30, 25 ) // determined empirically
    }, providedOptions );

    super( reaction, reactionProperty, beforeExpandedProperty, afterExpandedProperty, options );
  }
}

reactantsProductsAndLeftovers.register( 'MoleculesSceneNode', MoleculesSceneNode );