// Copyright 2014-2017, University of Colorado Boulder

/**
 * View for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeforeAfterNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/BeforeAfterNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALScreenView' );
  var SandwichesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichesEquationNode' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );

  // strings
  var afterSandwichString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/afterSandwich' );
  var beforeSandwichString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/beforeSandwich' );

  /**
   * @param {SandwichesModel} model
   * @constructor
   */
  function SandwichesScreenView( model ) {

    // compute the size of the largest sandwich, used for view layout
    var maxCoefficient = RPALConstants.SANDWICH_COEFFICIENT_RANGE.max;
    var maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient );
    var maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    RPALScreenView.call( this, model,

      /*
       * Creates an equation for a specified reaction.
       * @param {Reaction} reaction the reaction whose equation is displayed
       * @param {Dimension2} maxSandwichSize dimensions of largest sandwich
       * @returns {Node}
       */
      function( reaction ) { return new SandwichesEquationNode( reaction, maxSandwichSize ); },

      /*
       * Creates the Before/After interface for a specified reaction.
       * @param {Reaction} reaction the reaction displayed in the boxes
       * @param {Property.<boolean>} beforeExpandedProperty is the 'Before' box expanded?
       * @param {Property.<boolean>} afterExpandedProperty is the 'After' box expanded?
       * @param {Object} [options]
       * @returns {Node}
       */
      function( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {
        return new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
          _.extend( {}, options, {
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

  reactantsProductsAndLeftovers.register( 'SandwichesScreenView', SandwichesScreenView );

  return inherit( RPALScreenView, SandwichesScreenView );
} );
