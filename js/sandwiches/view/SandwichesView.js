// Copyright 2002-2014, University of Colorado Boulder

//TODO this is very similar to MoleculeView, except: custom reaction, and showSymbols: false
/**
 * View for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CustomSandwich = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/CustomSandwich' );
  var CustomSandwichEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/CustomSandwichEquationNode' );
  var EquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/EquationNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ReactionBarNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBarNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ReactionBoxesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBoxesNode' );

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
      function( reaction ) {
        if ( reaction instanceof CustomSandwich ) {
          return new CustomSandwichEquationNode( reaction );
        }
        else {
          return new EquationNode( reaction, { showSymbols: false } );
        }
      },
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

    var reactionBoxesNode;
    model.reactionProperty.link( function( reaction ) {
      if ( reactionBoxesNode ) {
        reactionBoxesNode.dispose();
        rootNode.removeChild( reactionBoxesNode );
      }
      reactionBoxesNode = new ReactionBoxesNode( reaction,
        viewProperties.beforeExpandedProperty, viewProperties.afterExpandedProperty,
        { showSymbols: false, left: 40, top: playAreaTop + 10, beforeTitle: beforeSandwichString, afterTitle: afterSandwichString } );
      rootNode.addChild( reactionBoxesNode );
    } );
  }

  return inherit( ScreenView, SandwichesView );
} );
