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
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
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

    // @private BeforeAfterNodes will be created on demand, then cached here
    thisView.beforeAfterCache = []; // { {Reaction} reaction, {Node} beforeAfterNode }[]

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
    resetAllButton.left = thisView.layoutBounds.left + 10;
    resetAllButton.bottom = thisView.layoutBounds.bottom - 10;

    // When the reaction changes, update the user interface
    var beforeAfterNode;
    model.reactionProperty.link( function( reaction ) {

      //TODO #18 flush the cache while we're debugging memory leaks.
      if ( RPALQueryParameters.LEAK_STEP > 0 ) {
        thisView.beforeAfterCache.forEach( function( item ) {
          thisView.removeChild( item.beforeAfterNode );
        } );
        thisView.beforeAfterCache = [];
      }

      // Create a BeforeAfterNode for this reaction, if one isn't already in the cache.
      if ( !_.find( thisView.beforeAfterCache, { 'reaction': reaction } ) ) {

        beforeAfterNode = createBeforeAfterNode( reaction,
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

  return inherit( ScreenView, RPALScreenView, {

    //TODO #18 Cycle through the reactions, for memory-leak debugging.
    steps: 0,
    reactionIndex: 0,
    step: function( dt ) {
      if ( RPALQueryParameters.LEAK_STEP > 0 ) {
        this.steps++;
        if ( this.steps % RPALQueryParameters.LEAK_STEP === 0 ) {
          this.model.reaction = this.model.reactions[this.reactionIndex++];
          if ( this.reactionIndex >= this.model.reactions.length ) {
            this.reactionIndex = 0;
          }
        }
      }
    }
  } );
} );
