// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/view/MoleculesEquationNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ReactionBarNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBarNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ReactionBoxesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBoxesNode' );

  /**
   * @param {MoleculesModel} model
   * @constructor
   */
  function MoleculesView( model ) {

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    var viewProperties = new PropertySet( {
      beforeExpanded: true,
      afterExpanded: true
    } );

    // static UI components
    var reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions,
      function( reaction ) { return new MoleculesEquationNode( reaction ); },
      { screenWidth: thisView.layoutBounds.width } );
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
      reactionBarNode.bottom = thisView.layoutBounds.bottom;
      playAreaTop = thisView.layoutBounds.top;
      playAreaBottom = reactionBarNode.top;
    }
    else {
      reactionBarNode.top = thisView.layoutBounds.top;
      playAreaTop = reactionBarNode.bottom;
      playAreaBottom = thisView.layoutBounds.bottom;
    }

    // remainder of layout
    resetAllButton.left = thisView.layoutBounds.left + 10;
    resetAllButton.bottom = playAreaBottom - 10;

    var reactionBoxesNode;
    model.reactionProperty.link( function( reaction ) {
      if ( reactionBoxesNode ) {
        reactionBoxesNode.dispose();
        rootNode.removeChild( reactionBoxesNode );
      }
      reactionBoxesNode = new ReactionBoxesNode( reaction,
        viewProperties.beforeExpandedProperty, viewProperties.afterExpandedProperty,
        { left: 40, top: playAreaTop + 10 } );
      rootNode.addChild( reactionBoxesNode );
    } );
  }

  return inherit( ScreenView, MoleculesView );
} );
