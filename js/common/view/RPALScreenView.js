// Copyright 2014-2017, University of Colorado Boulder

/**
 * Base type for the ScreenView used in the 'Sandwiches' and 'Molecules' screens.
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
  var Property = require( 'AXON/Property' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
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

    var self = this;
    ScreenView.call( this, RPALConstants.SCREEN_VIEW_OPTIONS );

    // Properties that are specific to the view
    var beforeExpandedProperty = new Property( true ); // {boolean} is the Before box expanded?
    var afterExpandedProperty = new Property( true ); // {boolean} is the After box expanded

    // Equation and reaction radio buttons at top of screen
    var reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions,
      createEquationNode,
      { screenWidth: this.layoutBounds.width } );
    this.addChild( reactionBarNode );
    reactionBarNode.top = this.layoutBounds.top;

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      listener: function() {
        model.reset();
        beforeExpandedProperty.reset();
        afterExpandedProperty.reset();
      }
    } );
    this.addChild( resetAllButton );
    resetAllButton.right = this.layoutBounds.right - 10;
    resetAllButton.bottom = this.layoutBounds.bottom - 10;

    /*
     * Updates the user interface to match the reaction.
     * BeforeAfterNodes are created on demand and cached for reuse.
     * Unlinking from reactionProperty is unnecessary because this node exists for the lifetime of the simulation.
     */
    this.beforeAfterCache = []; // @private { {Reaction} reaction, {Node} beforeAfterNode }[]
    model.reactionProperty.link( function( reaction ) {

      // Create a BeforeAfterNode for this reaction, if one isn't already in the cache.
      if ( !_.find( self.beforeAfterCache, { 'reaction': reaction } ) ) {

        var beforeAfterNode = createBeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty, {
          centerX: self.layoutBounds.centerX,
          top: reactionBarNode.bottom + 12 // below the reaction equation
        } );
        self.addChild( beforeAfterNode );

        // cache it
        self.beforeAfterCache.push( { reaction: reaction, beforeAfterNode: beforeAfterNode } );
      }

      // Make the reaction's BeforeAfterNode visible.
      self.beforeAfterCache.forEach( function( item ) {
        item.beforeAfterNode.visible = ( item.reaction === reaction );
      } );
    } );
  }

  reactantsProductsAndLeftovers.register( 'RPALScreenView', RPALScreenView );

  return inherit( ScreenView, RPALScreenView );
} );
