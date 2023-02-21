// Copyright 2014-2020, University of Colorado Boulder

/**
 * View for the 'Molecules' screen.
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
   */
  constructor( model ) {

    super( model,

      /*
       * Creates an equation for a specified reaction.
       * @param {Reaction} reaction
       * @returns {Node}
       */
      reaction => new MoleculesEquationNode( reaction ),

      /*
       * Creates the Before/After interface for a specified reaction.
       * @param {Reaction} reaction the reaction displayed in the boxes
       * @param {Property.<boolean>} beforeExpandedProperty is the 'Before' box expanded?
       * @param {Property.<boolean>} afterExpandedProperty is the 'After' box expanded?
       * @param {Object} [options]
       * @returns {Node}
       */
      ( reaction, beforeExpandedProperty, afterExpandedProperty, options ) => {
        return new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
          merge( {}, options, {
            contentSize: RPALConstants.MOLECULES_BEFORE_AFTER_BOX_SIZE,
            minIconSize: new Dimension2( 30, 25 ) // eyeballed
          } ) );
      }
    );
  }
}

reactantsProductsAndLeftovers.register( 'MoleculesScreenView', MoleculesScreenView );