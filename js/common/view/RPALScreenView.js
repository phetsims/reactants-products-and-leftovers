// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for the ScreenView used in the 'Sandwiches' and 'Molecules' screens.
 * <p>
 * The user interface is relatively expensive to create, and we have a small number of reactions.
 * So user-interface components are created on demand, then cached to improve the performance of
 * switching between reactions.
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
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {RPALBaseModel} model
   * @param {function} createEquationNode creates an equation for a specified reaction
   * @param {function} createBeforeAfterNode creates the Before/After boxes for a specified reaction
   * @constructor
   */
  function RPALScreenView( model, createEquationNode, createBeforeAfterNode ) {

    this.model = model; // @private

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    // Properties that are specific to the view
    var viewProperties = new PropertySet( {
      beforeExpanded: true, // {boolean} is the Before box expanded?
      afterExpanded: true  // {boolean} is the After box expanded
    } );

    // Equation and reaction radio buttons at top of screen
    var reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions,
      createEquationNode,
      { screenWidth: thisView.layoutBounds.width } );
    thisView.addChild( reactionBarNode );
    reactionBarNode.top = thisView.layoutBounds.top;

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      listener: function() {
        model.reset();
        viewProperties.reset();
      }
    } );
    thisView.addChild( resetAllButton );
    resetAllButton.right = thisView.layoutBounds.right - 10;
    resetAllButton.bottom = thisView.layoutBounds.bottom - 10;

    /*
     * Updates the user interface to match the reaction.
     * BeforeAfterNodes are created on demand and cached for reuse.
     * Unlinking from reactionProperty is unnecessary because this node exists for the lifetime of the simulation.
     */
    thisView.beforeAfterCache = []; // @private { {Reaction} reaction, {Node} beforeAfterNode }[]
    model.reactionProperty.link( function( reaction ) {

      // Create a BeforeAfterNode for this reaction, if one isn't already in the cache.
      if ( !_.find( thisView.beforeAfterCache, { 'reaction': reaction } ) ) {

        var beforeAfterNode = createBeforeAfterNode( reaction,
          viewProperties.beforeExpandedProperty,
          viewProperties.afterExpandedProperty, {
            centerX: thisView.layoutBounds.centerX,
            top: reactionBarNode.bottom + 12 // below the reaction equation
          } );
        thisView.addChild( beforeAfterNode );

        // cache it
        thisView.beforeAfterCache.push( { reaction: reaction, beforeAfterNode: beforeAfterNode } );
      }

      // Make the reaction's BeforeAfterNode visible.
      thisView.beforeAfterCache.forEach( function( item ) {
        item.beforeAfterNode.visible = ( item.reaction === reaction );
      } );
    } );
  }

  return inherit( ScreenView, RPALScreenView );
} );
