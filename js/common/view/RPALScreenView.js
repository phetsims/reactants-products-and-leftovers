// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for the ScreenView used in the 'Sandwiches' and 'Molecules' screens.
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
   * @param {RPALBaseModel} model
   * @param {function} createEquationNode creates an equation for a specified reaction
   * @param {function} createBeforeAfterNode creates the Before/After boxes for a specified reaction
   * @constructor
   */
  function RPALScreenView( model, createEquationNode, createBeforeAfterNode ) {

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    // Properties that are specific to the view
    var viewProperties = new PropertySet( {
      beforeExpanded: true, // {boolean} is the Before box expanded?
      afterExpanded: true  // {boolean} is the After box expanded
    } );

    // reaction bar, location is determined by a query parameter
    var reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions,
      createEquationNode,
      { screenWidth: thisView.layoutBounds.width } );
    thisView.addChild( reactionBarNode );

    // play area top/bottom varies depending on where reaction bar is located
    var playAreaTop = null;
    var playAreaBottom;
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

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      listener: function() {
        model.reset();
        viewProperties.reset();
      }
    } );
    thisView.addChild( resetAllButton );
    resetAllButton.left = thisView.layoutBounds.left + 10;
    resetAllButton.bottom = playAreaBottom - 10;

    // When the reaction changes, create new Before/After boxes
    var beforeAfterNode;
    model.reactionProperty.link( function( reaction ) {

      // dispose of the previous boxes
      if ( beforeAfterNode ) {
        thisView.removeChild( beforeAfterNode );
        beforeAfterNode.dispose && beforeAfterNode.dispose(); // dispose of the node, if supported
      }

      // create the new boxes
      beforeAfterNode = createBeforeAfterNode( reaction,
        viewProperties.beforeExpandedProperty,
        viewProperties.afterExpandedProperty, {
          left: 40,
          top: playAreaTop + 12
        } );
      thisView.addChild( beforeAfterNode );
    } );
  }

  return inherit( ScreenView, RPALScreenView );
} );
