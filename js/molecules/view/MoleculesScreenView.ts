// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * MoleculesScreenView is the view for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import RPALConstants from '../../common/RPALConstants.js';
import BeforeAfterNode from '../../common/view/BeforeAfterNode.js';
import MoleculesEquationNode from '../../common/view/MoleculesEquationNode.js';
import RPALScreenView from '../../common/view/RPALScreenView.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

export default class MoleculesScreenView extends RPALScreenView {

  /**
   * @param {MoleculesModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    // Creates an equation for a specified reaction.
    const createEquationNode = reaction => new MoleculesEquationNode( reaction );

    // Creates the Before/After interface for a specified reaction.
    const createBeforeAfterNode = ( reaction, beforeExpandedProperty, afterExpandedProperty, options ) => {
      return new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
        merge( {}, options, {
          contentSize: RPALConstants.MOLECULES_BEFORE_AFTER_BOX_SIZE,
          minIconSize: new Dimension2( 30, 25 ) // eyeballed
        } ) );
    };

    super( model, createEquationNode, createBeforeAfterNode, tandem );
  }
}

reactantsProductsAndLeftovers.register( 'MoleculesScreenView', MoleculesScreenView );