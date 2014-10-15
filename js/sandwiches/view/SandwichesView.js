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
  var ReactionView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionView' );
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

    var thisView = this;
    ReactionView.call( thisView, model,
      function( reaction ) { return new SandwichesEquationNode( reaction ); } );

    // compute the size of the largest sandwich, used for layout of boxes
    var maxCoefficient = RPALConstants.COEFFICIENT_RANGE.max;
    var maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient, { scale: RPALConstants.SANDWICH_IMAGE_SCALE } );
    var maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    // When the reaction changes, create new Before/After boxes
    var beforeAfterNode;
    model.reactionProperty.link( function( reaction ) {

      // dispose of the previous boxes
      if ( beforeAfterNode ) {
        beforeAfterNode.dispose();
        thisView.removeChild( beforeAfterNode );
      }

      // options for the new boxes
      var boxOptions = {
        showSymbols: false,
        left: 40,
        top: thisView.playAreaTop + 10,
        beforeTitle: beforeSandwichString,
        afterTitle: afterSandwichString,
        maxImageSize: maxSandwichSize
      };
      if ( reaction.coefficientsMutable ) {
        boxOptions.boxYMargin = 12;
      }

      // create the new boxes
      beforeAfterNode = new SandwichesBeforeAfterNode( reaction,
        thisView.viewProperties.beforeExpandedProperty,
        thisView.viewProperties.afterExpandedProperty,
        boxOptions );
      thisView.addChild( beforeAfterNode );
    } );
  }

  return inherit( ReactionView, SandwichesView );
} );
