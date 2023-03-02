// Copyright 2014-2023, University of Colorado Boulder

/**
 * MoleculesScreenView is the view for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RPALConstants from '../../common/RPALConstants.js';
import BeforeAfterNode, { BeforeAfterNodeOptions } from '../../common/view/BeforeAfterNode.js';
import MoleculesEquationNode from '../../common/view/MoleculesEquationNode.js';
import RPALScreenView, { CreateBeforeAfterNodeFunction } from '../../common/view/RPALScreenView.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import MoleculesModel from '../model/MoleculesModel.js';
import { CreateEquationNodeFunction } from '../../common/view/ReactionBarNode.js';

export default class MoleculesScreenView extends RPALScreenView {

  public constructor( model: MoleculesModel, tandem: Tandem ) {

    // Creates an equation for a specified reaction.
    const createEquationNode: CreateEquationNodeFunction = reaction => new MoleculesEquationNode( reaction );

    // Creates the Before/After interface for a specified reaction.
    const createBeforeAfterNode: CreateBeforeAfterNodeFunction =
      ( reaction, beforeExpandedProperty, afterExpandedProperty, options ) =>
        new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
          combineOptions<BeforeAfterNodeOptions>( {
            contentSize: RPALConstants.MOLECULES_BEFORE_AFTER_BOX_SIZE,
            minIconSize: new Dimension2( 30, 25 ) // eyeballed
          }, options ) );

    super( model, createEquationNode, createBeforeAfterNode, tandem );
  }
}

reactantsProductsAndLeftovers.register( 'MoleculesScreenView', MoleculesScreenView );