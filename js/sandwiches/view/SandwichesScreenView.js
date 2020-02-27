// Copyright 2014-2019, University of Colorado Boulder

/**
 * View for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BeforeAfterNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/BeforeAfterNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const RPALScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALScreenView' );
  const SandwichesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichesEquationNode' );
  const SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );

  // strings
  const afterSandwichString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/afterSandwich' );
  const beforeSandwichString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/beforeSandwich' );

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

  return reactantsProductsAndLeftovers.register( 'SandwichesScreenView', SandwichesScreenView );
} );
