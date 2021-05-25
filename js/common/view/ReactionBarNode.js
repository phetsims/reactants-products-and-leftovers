// Copyright 2014-2021, University of Colorado Boulder

/**
 * Horizontal bar that contains radio buttons for selecting a reaction, and displays the selected reaction's equation.
 * Equations are relatively expensive to create, and we have a small number of reactions.
 * So equations are created on demand, then cached to improve the performance of switching between reactions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import RPALColors from '../RPALColors.js';
import ReactionRadioButtonGroup from './ReactionRadioButtonGroup.js';

class ReactionBarNode extends Node {

  /**
   * @param {Property.<Reaction>} reactionProperty the selected reaction
   * @param {Reaction[]} reactions the reaction choices
   * @param {function} createEquationNode takes one {Reaction} parameter, returns {Node}
   * @param {Object} [options]
   */
  constructor( reactionProperty, reactions, createEquationNode, options ) {

    options = merge( {
      screenWidth: 1000, // width of the screen's safe area
      xMargin: 20,
      yMargin: 10,
      fill: RPALColors.PANEL_FILL,
      showSymbols: true // true = show symbols, false = show nodes
    }, options );

    // radio buttons for choosing a reaction, scaled to fit for i18n
    const radioButtonGroup = new ReactionRadioButtonGroup( reactionProperty, reactions, {
      maxWidth: 0.25 * options.screenWidth // constrain width for i18n
    } );

    // background, extra wide so that it will appear to fill the window for all but extreme window sizes
    const backgroundNode = new Rectangle( 0, 0, 4 * options.screenWidth, radioButtonGroup.height + ( 2 * options.yMargin ), {
      fill: options.fill,
      centerX: options.screenWidth / 2
    } );

    // radio buttons at right, vertically centered
    radioButtonGroup.right = options.screenWidth - options.xMargin;
    radioButtonGroup.centerY = backgroundNode.centerY;

    options.children = [ backgroundNode, radioButtonGroup ];
    super( options );

    // pdom - set the initial accessible order
    this.pdomOrder = [ radioButtonGroup ];
    /*
     * Updates the equation to match the reaction.
     * Equations are created on demand and cached for reuse.
     * Unlinking from reactionProperty is unnecessary because this node exists for the lifetime of the simulation.
     */
    this.equationCache = []; // @private { {Reaction} reaction, {Node} equationNode }[]
    reactionProperty.link( reaction => {

      // Create an equation for this reaction, if one isn't already in the cache.
      if ( !_.find( this.equationCache, { reaction: reaction } ) ) {

        // create equation for the reaction
        const equationNode = createEquationNode( reaction );
        this.addChild( equationNode );

        // pdom - as the equations are created, we want them all to be before the radio buttons in focus order
        this.pdomOrder = [ equationNode ].concat( this.pdomOrder );

        // scale the equation if it's too wide to fit the available space
        const availableWidth = radioButtonGroup.left - ( 2 * options.xMargin );
        const scale = Math.min( 1, availableWidth / equationNode.width );
        equationNode.setScaleMagnitude( scale );

        // center the equation in the space to the left of the controls
        equationNode.centerX = options.xMargin + ( availableWidth / 2 );
        equationNode.centerY = backgroundNode.centerY;

        // cache it
        this.equationCache.push( { reaction: reaction, equationNode: equationNode } );
      }

      // Make the reaction's equation visible.
      this.equationCache.forEach( item => {
        item.equationNode.visible = ( item.reaction === reaction );
      } );
    } );
  }
}

reactantsProductsAndLeftovers.register( 'ReactionBarNode', ReactionBarNode );
export default ReactionBarNode;