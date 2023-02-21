// Copyright 2014-2021, University of Colorado Boulder

/**
 * Base type for the ScreenView used in the 'Sandwiches' and 'Molecules' screens.
 * The user interface is relatively expensive to create, and we have a small number of reactions.
 * So user-interface components are created on demand, then cached to improve the performance of
 * switching between reactions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import RPALConstants from '../RPALConstants.js';
import ReactionBarNode from './ReactionBarNode.js';

export default class RPALScreenView extends ScreenView {

  /**
   * @param {RPALBaseModel} model
   * @param {function} createEquationNode creates an equation for a specified reaction
   * @param {function} createBeforeAfterNode creates the Before/After boxes for a specified reaction
   */
  constructor( model, createEquationNode, createBeforeAfterNode ) {

    super( RPALConstants.SCREEN_VIEW_OPTIONS );

    this.model = model; // @private

    // Properties that are specific to the view
    const beforeExpandedProperty = new BooleanProperty( true ); // {boolean} is the Before box expanded?
    const afterExpandedProperty = new BooleanProperty( true ); // {boolean} is the After box expanded

    // Equation and reaction radio buttons at top of screen
    const reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions,
      createEquationNode,
      { screenWidth: this.layoutBounds.width } );
    this.addChild( reactionBarNode );
    reactionBarNode.top = this.layoutBounds.top;

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      listener: () => {
        model.reset();
        beforeExpandedProperty.reset();
        afterExpandedProperty.reset();
      }
    } );
    this.addChild( resetAllButton );
    resetAllButton.right = this.layoutBounds.right - 10;
    resetAllButton.bottom = this.layoutBounds.bottom - 10;

    // pdom - set the initial accessible order
    this.pdomPlayAreaNode.pdomOrder = [ reactionBarNode, resetAllButton ];

    /*
     * Updates the user interface to match the reaction.
     * BeforeAfterNodes are created on demand and cached for reuse.
     * Unlinking from reactionProperty is unnecessary because this node exists for the lifetime of the simulation.
     */
    this.beforeAfterCache = []; // @private { {Reaction} reaction, {Node} beforeAfterNode }[]
    model.reactionProperty.link( reaction => {

      // Create a BeforeAfterNode for this reaction, if one isn't already in the cache.
      if ( !_.find( this.beforeAfterCache, { reaction: reaction } ) ) {

        const beforeAfterNode = createBeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty, {
          centerX: this.layoutBounds.centerX,
          top: reactionBarNode.bottom + 12 // below the reaction equation
        } );
        this.addChild( beforeAfterNode );

        // cache it
        this.beforeAfterCache.push( { reaction: reaction, beforeAfterNode: beforeAfterNode } );

        // pdom - order should look like [ reactionBarNode, {{ALL_BEFORE_AFTER_NODES}}, resetAllButton ]
        this.pdomPlayAreaNode.pdomOrder = [ reactionBarNode ]
          .concat( this.beforeAfterCache.map( item => item.beforeAfterNode ) ) // map all beforeAfterNodes to an array
          .concat( [ resetAllButton ] );
      }

      // Make the reaction's BeforeAfterNode visible.
      this.beforeAfterCache.forEach( item => {
        item.beforeAfterNode.visible = ( item.reaction === reaction );
      } );
    } );
  }
}

reactantsProductsAndLeftovers.register( 'RPALScreenView', RPALScreenView );