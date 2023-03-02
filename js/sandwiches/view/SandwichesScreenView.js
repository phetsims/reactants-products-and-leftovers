// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * SandwichesScreenView is the view for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import RPALConstants from '../../common/RPALConstants.js';
import BeforeAfterNode from '../../common/view/BeforeAfterNode.js';
import RPALScreenView from '../../common/view/RPALScreenView.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import SandwichesEquationNode from './SandwichesEquationNode.js';
import SandwichNode from './SandwichNode.js';

export default class SandwichesScreenView extends RPALScreenView {

  /**
   * @param {SandwichesModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    // compute the size of the largest sandwich, used for view layout
    const maxCoefficient = RPALConstants.SANDWICH_COEFFICIENT_RANGE.max;
    const maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient );
    const maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    // Creates an equation for a specified reaction.
    const createEquationNode = reaction => new SandwichesEquationNode( reaction, maxSandwichSize );

    // Creates the Before/After interface for a specified reaction.
    const createBeforeAfterNode = ( reaction, beforeExpandedProperty, afterExpandedProperty, options ) => {
      return new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
        merge( {}, options, {
          contentSize: RPALConstants.SANDWICHES_BEFORE_AFTER_BOX_SIZE,
          showSymbols: false,
          beforeTitleProperty: ReactantsProductsAndLeftoversStrings.beforeSandwichStringProperty,
          afterTitleProperty: ReactantsProductsAndLeftoversStrings.afterSandwichStringProperty,
          minIconSize: maxSandwichSize,
          boxYMargin: 8 // large enough to accommodate the biggest sandwich
        } ) );
    };

    super( model, createEquationNode, createBeforeAfterNode, tandem );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesScreenView', SandwichesScreenView );