// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for the view used in the 'Sandwiches' and 'Molecules' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ReactionBarNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBarNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {SandwichesModel|MoleculesModel} model
   * @constructor
   */
  function ReactionView( model, createEquationNode ) {

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    // @protected
    thisView.viewProperties = new PropertySet( {
      beforeExpanded: true,
      afterExpanded: true
    } );

    // reaction bar, location is determined by a query parameter
    var reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions,
      createEquationNode,
      { screenWidth: thisView.layoutBounds.width } );
    thisView.addChild( reactionBarNode );

    thisView.playAreaTop; // @protected
    var playAreaBottom;
    if ( RPALQueryParameters.EQUATION === 'bottom' ) {
      reactionBarNode.bottom = thisView.layoutBounds.bottom;
      thisView.playAreaTop = thisView.layoutBounds.top;
      playAreaBottom = reactionBarNode.top;
    }
    else {
      reactionBarNode.top = thisView.layoutBounds.top;
      thisView.playAreaTop = reactionBarNode.bottom;
      playAreaBottom = thisView.layoutBounds.bottom;
    }

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      listener: function() {
        model.reset();
        thisView.viewProperties.reset();
      }
    } );
    thisView.addChild( resetAllButton );
    resetAllButton.left = thisView.layoutBounds.left + 10;
    resetAllButton.bottom = playAreaBottom - 10;
  }

  return inherit( ScreenView, ReactionView );
} );
