// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RPALBaseView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALBaseView' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var SandwichesBeforeAfterNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichesBeforeAfterNode' );
  var SandwichesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichesEquationNode' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );

  // strings
  var beforeSandwichString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/beforeSandwich' );
  var afterSandwichString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/afterSandwich' );

  /**
   * @param {SandwichesModel} model
   * @constructor
   */
  function SandwichesView( model ) {

    // compute the size of the largest sandwich, used for layout of Before/After boxes
    var maxCoefficient = RPALConstants.SANDWICH_COEFFICIENT_RANGE.max;
    var maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient );
    var maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    RPALBaseView.call( this, model,

      /*
       * Creates an equation for a specified reaction.
       * @param {Reaction} reaction the reaction whose equation is displayed
       * @returns {SCENERY.Node}
       */
      function( reaction ) { return new SandwichesEquationNode( reaction ); },

      /*
       * Creates the Before/After boxes for a specified reaction.
       * @param {Reaction} reaction the reaction displayed in the boxes
       * @param {Property.<boolean>} beforeExpandedProperty is the 'Before' box expanded?
       * @param {Property.<boolean>} afterExpandedProperty is the 'After' box expanded?
       * @param {Object} [options]
       * @returns {SCENERY.Node}
       */
      function( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {
        return new SandwichesBeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
          _.extend( {}, options, {
            showSymbols: false,
            beforeTitle: beforeSandwichString,
            afterTitle: afterSandwichString,
            maxImageSize: maxSandwichSize,
            boxYMargin: 8 // large enough to accommodate biggest sandwich
          } ) );
      }
    );
  }

  return inherit( RPALBaseView, SandwichesView );
} );
