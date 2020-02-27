// Copyright 2014-2020, University of Colorado Boulder

/**
 * View for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import RPALConstants from '../../common/RPALConstants.js';
import BeforeAfterNode from '../../common/view/BeforeAfterNode.js';
import RPALScreenView from '../../common/view/RPALScreenView.js';
import reactantsProductsAndLeftoversStrings from '../../reactants-products-and-leftovers-strings.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SandwichesEquationNode from './SandwichesEquationNode.js';
import SandwichNode from './SandwichNode.js';

const afterSandwichString = reactantsProductsAndLeftoversStrings.afterSandwich;
const beforeSandwichString = reactantsProductsAndLeftoversStrings.beforeSandwich;

class SandwichesScreenView extends RPALScreenView {

  /**
   * @param {SandwichesModel} model
   */
  constructor( model ) {

    // compute the size of the largest sandwich, used for view layout
    const maxCoefficient = RPALConstants.SANDWICH_COEFFICIENT_RANGE.max;
    const maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient );
    const maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    super( model,

      /*
       * Creates an equation for a specified reaction.
       * @param {Reaction} reaction the reaction whose equation is displayed
       * @param {Dimension2} maxSandwichSize dimensions of largest sandwich
       * @returns {Node}
       */
      reaction => new SandwichesEquationNode( reaction, maxSandwichSize ),

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
            contentSize: RPALConstants.SANDWICHES_BEFORE_AFTER_BOX_SIZE,
            showSymbols: false,
            beforeTitle: beforeSandwichString,
            afterTitle: afterSandwichString,
            minIconSize: maxSandwichSize,
            boxYMargin: 8 // large enough to accommodate biggest sandwich
          } ) );
      }
    );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesScreenView', SandwichesScreenView );
export default SandwichesScreenView;