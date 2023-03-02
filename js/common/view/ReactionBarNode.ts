// Copyright 2014-2023, University of Colorado Boulder

/**
 * Horizontal bar that contains radio buttons for selecting a reaction, and displays the selected reaction's equation.
 * Equations are relatively expensive to create, and we have a small number of reactions.
 * So equations are created on demand, then cached to improve the performance of switching between reactions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import Reaction from '../model/Reaction.js';
import RPALColors from '../RPALColors.js';
import ReactionRadioButtonGroup from './ReactionRadioButtonGroup.js';

const X_MARGIN = 20;
const Y_MARGIN = 10;

export type CreateEquationNodeFunction<R extends Reaction = Reaction> = ( reaction: R ) => Node;

type SelfOptions = {
  screenWidth: number;
};

type ReactionBarNodeOptions = SelfOptions;

export default class ReactionBarNode<R extends Reaction = Reaction> extends Node {

  private readonly equationNodeCache: Map<R, Node>;

  public constructor( reactionProperty: Property<R>, reactions: R[],
                      createEquationNode: CreateEquationNodeFunction<R>, providedOptions: ReactionBarNodeOptions ) {

    const options = optionize<ReactionBarNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    // radio buttons for choosing a reaction, scaled to fit for i18n
    const radioButtonGroup = new ReactionRadioButtonGroup( reactionProperty, reactions );

    // background, extra wide so that it will appear to fill the window for all but extreme window sizes
    //TODO https://github.com/phetsims/reactants-products-and-leftovers/issues/82 update to fit the window width
    const backgroundNode = new Rectangle( 0, 0, 4 * options.screenWidth, radioButtonGroup.height + ( 2 * Y_MARGIN ), {
      fill: RPALColors.PANEL_FILL,
      centerX: options.screenWidth / 2
    } );

    // radio buttons at right, vertically centered
    radioButtonGroup.boundsProperty.link( bounds => {
      radioButtonGroup.right = options.screenWidth - X_MARGIN;
      radioButtonGroup.centerY = backgroundNode.centerY;
    } );

    options.children = [ backgroundNode, radioButtonGroup ];

    super( options );

    /*
     * Updates the equation to match the reaction.
     * Equations are created on demand and cached for reuse.
     * Unlinking from reactionProperty is unnecessary because this node exists for the lifetime of the simulation.
     */
    this.equationNodeCache = new Map();
    reactionProperty.link( reaction => {

      // Create an equation for this reaction, if one isn't already in the cache.
      const cachedNode = this.equationNodeCache.get( reaction );
      if ( !cachedNode ) {

        // create equation for the reaction
        const equationNode = createEquationNode( reaction );
        this.addChild( equationNode );

        // scale the equation if it's too wide to fit the available space
        const availableWidth = radioButtonGroup.left - ( 2 * X_MARGIN );
        const scale = Math.min( 1, availableWidth / equationNode.width );
        equationNode.setScaleMagnitude( scale );

        // center the equation in the space to the left of the controls
        equationNode.centerX = X_MARGIN + ( availableWidth / 2 );
        equationNode.centerY = backgroundNode.centerY;

        // cache it
        this.equationNodeCache.set( reaction, equationNode );
      }

      // Make only the reaction's equation visible, hide other equations.
      this.equationNodeCache.forEach( ( node: Node, key: R ) => {
        node.visible = ( key === reaction );
      } );
    } );
  }
}

reactantsProductsAndLeftovers.register( 'ReactionBarNode', ReactionBarNode );