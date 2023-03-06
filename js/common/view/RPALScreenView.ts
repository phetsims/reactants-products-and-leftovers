// Copyright 2014-2023, University of Colorado Boulder

/**
 * Base class for the ScreenView used in the 'Sandwiches' and 'Molecules' screens.
 * The user interface is relatively expensive to create, and we have a small number of reactions.
 * So user-interface components are created on demand, then cached to improve the performance of
 * switching between reactions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import RPALBaseModel from '../model/RPALBaseModel.js';
import RPALConstants from '../RPALConstants.js';
import ReactionBarNode, { CreateEquationNodeFunction } from './ReactionBarNode.js';
import Reaction from '../model/Reaction.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { BeforeAfterNodeOptions } from './BeforeAfterNode.js';

export type CreateBeforeAfterNodeFunction = (
  reaction: Reaction,
  beforeExpandedProperty: Property<boolean>,
  afterExpandedProperty: Property<boolean>,
  providedOptions?: BeforeAfterNodeOptions
) => Node;

export default class RPALScreenView<R extends Reaction = Reaction> extends ScreenView {

  private readonly beforeAfterCache: Map<R, Node>;

  /**
   * @param model
   * @param createEquationNode - creates an equation for a specified reaction
   * @param createBeforeAfterNode - creates the Before/After boxes for a specified reaction
   * @param tandem
   */
  protected constructor( model: RPALBaseModel<R>,
                         createEquationNode: CreateEquationNodeFunction<R>,
                         createBeforeAfterNode: CreateBeforeAfterNodeFunction,
                         tandem: Tandem ) {

    super( {
      layoutBounds: RPALConstants.SCREEN_VIEW_LAYOUT_BOUNDS,
      tandem: tandem
    } );

    // Properties that are specific to the view
    const beforeExpandedProperty = new BooleanProperty( true ); // is the Before box expanded?
    const afterExpandedProperty = new BooleanProperty( true ); // is the After box expanded

    // Equation and reaction radio buttons at top of screen
    const reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions, createEquationNode, {
      layoutBounds: this.layoutBounds,
      visibleBoundsProperty: this.visibleBoundsProperty,
      top: this.layoutBounds.top
    } );
    this.addChild( reactionBarNode );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10,
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
        beforeExpandedProperty.reset();
        afterExpandedProperty.reset();
      }
    } );
    this.addChild( resetAllButton );

    /*
     * Updates the user interface to match the reaction.
     * BeforeAfterNodes are created on demand and cached for reuse.
     * Unlinking from reactionProperty is unnecessary because this node exists for the lifetime of the simulation.
     */
    this.beforeAfterCache = new Map();
    model.reactionProperty.link( reaction => {

      // Create a BeforeAfterNode for this reaction, if one isn't already in the cache.
      const cachedNode = this.beforeAfterCache.get( reaction );
      if ( !cachedNode ) {

        const beforeAfterNode = createBeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty, {
          centerX: this.layoutBounds.centerX,
          top: reactionBarNode.bottom + 12 // below the reaction equation
        } );
        this.addChild( beforeAfterNode );

        // cache it
        this.beforeAfterCache.set( reaction, beforeAfterNode );
      }

      // Make only the reaction's BeforeAfterNode visible, hide other nodes.
      this.beforeAfterCache.forEach( ( beforeAfterNode: Node, key: Reaction ) => {
        beforeAfterNode.visible = ( key === reaction );
      } );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'RPALScreenView', RPALScreenView );