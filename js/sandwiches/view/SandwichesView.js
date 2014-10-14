// Copyright 2002-2014, University of Colorado Boulder

//TODO this is very similar to MoleculeView
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
  var Node = require( 'SCENERY/nodes/Node' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ReactionBarNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBarNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var SandwichesBoxesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichesBoxesNode' );
  var SandwichesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichesEquationNode' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // strings
  var beforeSandwichString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/beforeSandwich' );
  var afterSandwichString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/afterSandwich' );

  /**
   * @param {SandwichesModel} model
   * @constructor
   */
  function SandwichesView( model ) {

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    var viewProperties = new PropertySet( {
      beforeExpanded: true,
      afterExpanded: true
    } );

    // static UI components
    var reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions,
      function( reaction ) { return new SandwichesEquationNode( reaction ); },
      { screenWidth: this.layoutBounds.width } );
    var resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      listener: function() {
        model.reset();
        viewProperties.reset();
      }
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node( { children: [
      reactionBarNode,
      resetAllButton
    ] } );
    thisView.addChild( rootNode );

    // layout of the reaction bar is determined by a query parameter
    var playAreaTop, playAreaBottom;
    if ( RPALQueryParameters.EQUATION === 'bottom' ) {
      reactionBarNode.bottom = this.layoutBounds.bottom;
      playAreaTop = this.layoutBounds.top;
      playAreaBottom = reactionBarNode.top;
    }
    else {
      reactionBarNode.top = this.layoutBounds.top;
      playAreaTop = reactionBarNode.bottom;
      playAreaBottom = this.layoutBounds.bottom;
    }

    // remainder of layout
    resetAllButton.left = this.layoutBounds.left + 10;
    resetAllButton.bottom = playAreaBottom - 10;

    // compute the size of the largest sandwich, used for layout of the 'custom' sandwich
    var maxCoefficient = RPALConstants.COEFFICIENT_RANGE.max;
    var maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient, { scale: RPALConstants.SANDWICH_IMAGE_SCALE } );
    var maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    var reactionBoxesNode;
    model.reactionProperty.link( function( reaction ) {

      // dispose of the previous box
      if ( reactionBoxesNode ) {
        reactionBoxesNode.dispose();
        rootNode.removeChild( reactionBoxesNode );
      }

      // options for the new box
      var boxOptions = {
        showSymbols: false,
        left: 40,
        top: playAreaTop + 10,
        beforeTitle: beforeSandwichString,
        afterTitle: afterSandwichString,
        maxImageSize: maxSandwichSize
      };
      if ( reaction.coefficientsMutable ) {
        boxOptions.boxYMargin = 12;
      }

      // create the new box
      reactionBoxesNode = new SandwichesBoxesNode( reaction, viewProperties.beforeExpandedProperty, viewProperties.afterExpandedProperty, boxOptions );
      rootNode.addChild( reactionBoxesNode );
    } );
  }

  return inherit( ScreenView, SandwichesView );
} );
