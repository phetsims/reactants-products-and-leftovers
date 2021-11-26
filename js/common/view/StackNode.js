// Copyright 2014-2021, University of Colorado Boulder

/**
 * A vertical stack of Substances, built from the bottom up.
 * To improve performance:
 * - Nodes are created as needed.
 * - Nodes are never removed; they remain as children for the lifetime of this node.
 * - The visibility of nodes is adjusted to show the correct quantity of the substance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Line } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SubstanceIcon from './SubstanceIcon.js';

class StackNode extends Node {

  /**
   * @param {number} height height of the stack
   * @param {Property.<Node>} iconProperty the icon to display
   * @param {Property.<number>} quantityProperty the number of nodes to display
   * @param {number} startCenterY the centerY of the bottom node in the stack
   * @param {number} deltaY the vertical spacing between nodes in the stack
   * @param {Object} [options]
   */
  constructor( height, iconProperty, quantityProperty, startCenterY, deltaY, options ) {

    super();

    /*
     * This line is not visible (has no stroke), but defines the height of the stack,
     * and ensures that the stack always has well-defined bounds, even when the stack
     * contains zero items. All other nodes will be horizontally centered on this line.
     */
    this.addChild( new Line( 0, 0, 0, height ) );

    // parent for all items in the stack
    const itemsParent = new Node();
    this.addChild( itemsParent );

    // {SubstanceIcon[]}
    const iconNodes = [];

    // update the number of nodes in the stack
    const quantityPropertyObserver = quantity => {

      const count = Math.max( quantity, itemsParent.getChildrenCount() );

      for ( let i = 0; i < count; i++ ) {
        if ( i < itemsParent.getChildrenCount() ) {
          // set visibility of a node that already exists
          itemsParent.getChildAt( i ).visible = ( i < quantity );
        }
        else {
          // add a node
          const iconNode = new SubstanceIcon( iconProperty, {
            centerX: 0,
            centerY: startCenterY - ( i * deltaY )
          } );
          itemsParent.addChild( iconNode );
          iconNodes.push( iconNode );
        }
      }
    };
    quantityProperty.link( quantityPropertyObserver ); // must be unlinked in dispose

    this.mutate( options );

    // @private
    this.disposeStackNode = () => {
      iconNodes.forEach( node => node.dispose() );
      iconNodes.length = 0;
      quantityProperty.unlink( quantityPropertyObserver );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeStackNode();
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'StackNode', StackNode );
export default StackNode;