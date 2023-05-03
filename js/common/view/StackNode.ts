// Copyright 2014-2023, University of Colorado Boulder

/**
 * StackNode is a vertical stack of Substances, built from the bottom up.
 * To improve performance:
 * - Nodes are created as needed.
 * - Nodes are never removed; they remain as children for the lifetime of this node.
 * - The visibility of nodes is adjusted to show the correct quantity of the substance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Line, Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SubstanceIcon from './SubstanceIcon.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

type SelfOptions = EmptySelfOptions;

type StackNodeOptions = SelfOptions & NodeTranslationOptions;

export default class StackNode extends Node {

  private readonly disposeStackNode: () => void;

  /**
   * @param height - height of the stack
   * @param iconProperty - the icon to display
   * @param quantityProperty - the number of nodes to display
   * @param startCenterY - the centerY of the bottom node in the stack
   * @param deltaY - the vertical spacing between nodes in the stack
   * @param [providedOptions]
   */
  public constructor( height: number, iconProperty: TReadOnlyProperty<Node>, quantityProperty: NumberProperty,
                      startCenterY: number, deltaY: number, providedOptions?: StackNodeOptions ) {

    const options = optionize<StackNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    /*
     * This line is not visible (has no stroke), but defines the height of the stack,
     * and ensures that the stack always has well-defined bounds, even when the stack
     * contains zero items. All other nodes will be horizontally centered on this line.
     */
    const line = new Line( 0, 0, 0, height );

    // Eagerly create the maximum number of nodes in the stack, positioned from the bottom up.
    const iconNodes: SubstanceIcon[] = [];
    for ( let i = 0; i < quantityProperty.range.max; i++ ) {
      const iconNode = new SubstanceIcon( iconProperty, {
        centerX: 0,
        centerY: startCenterY - ( i * deltaY )
      } );
      iconNodes.push( iconNode );
    }

    // Make the proper number of nodes visible in the stack, from the bottom up.
    const quantityPropertyObserver = ( quantity: number ) => {
      for ( let i = 0; i < iconNodes.length; i++ ) {
        iconNodes[ i ].visible = ( i < quantity );
      }
    };
    quantityProperty.link( quantityPropertyObserver ); // must be unlinked in dispose

    options.children = [ line, ...iconNodes ];

    super( options );

    this.disposeStackNode = () => {
      iconNodes.forEach( node => node.dispose() );
      iconNodes.length = 0;
      if ( quantityProperty.hasListener( quantityPropertyObserver ) ) {
        quantityProperty.unlink( quantityPropertyObserver );
      }
    };
  }

  public override dispose(): void {
    this.disposeStackNode();
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'StackNode', StackNode );