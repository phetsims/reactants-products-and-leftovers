// Copyright 2014-2019, University of Colorado Boulder

/**
 * A vertical stack of Substances, built from the bottom up.
 * To improve performance:
 * - Nodes are created as needed.
 * - Nodes are never removed; they remain as children for the lifetime of this node.
 * - The visibility of nodes is adjusted to show the correct quantity of the substance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const SubstanceIcon = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceIcon' );

  /**
   * @param {number} height height of the stack
   * @param {Property.<Node>} iconProperty the icon to display
   * @param {Property.<number>} quantityProperty the number of nodes to display
   * @param {number} startCenterY the centerY of the bottom node in the stack
   * @param {number} deltaY the vertical spacing between nodes in the stack
   * @param {Object} [options]
   * @constructor
   */
  function StackNode( height, iconProperty, quantityProperty, startCenterY, deltaY, options ) {

    const self = this;
    Node.call( this );

    /*
     * This line is not visible (has no stroke), but defines the height of the stack,
     * and ensures that the stack always has well-defined bounds, even when the stack
     * contains zero items. All other nodes will be horizontally centered on this line.
     */
    this.addChild( new Line( 0, 0, 0, height ) );

    // parent for all items in the stack
    const itemsParent = new Node();
    this.addChild( itemsParent );

    // update the number of nodes in the stack
    this.iconNodes = []; // @private {SubstanceIcon[]}
    this.quantityPropertyObserver = function( quantity ) { // @private

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
          self.iconNodes.push( iconNode );
        }
      }
    };
    this.quantityProperty = quantityProperty; // @private
    this.quantityProperty.link( this.quantityPropertyObserver ); // must be unlinked in dispose

    this.mutate( options );
  }

  reactantsProductsAndLeftovers.register( 'StackNode', StackNode );

  return inherit( Node, StackNode, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.iconNodes.forEach( function( node ) { node.dispose(); } );
      this.iconNodes = null;
      this.quantityProperty.unlink( this.quantityPropertyObserver );
      Node.prototype.dispose.call( this );
    }
  } );
} );
