// Copyright 2002-2014, University of Colorado Boulder

/**
 * A vertical stack of Substances, built from the bottom up.
 * To improve performance:
 * <ul>
 * <li>Nodes are created as needed.</li>
 * <li>Nodes are never removed; they remain as children for the lifetime of this node.</li>
 * <li>The visibility of nodes is adjusted to show the correct quantity of the substance.</li>
 * </ul>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DynamicIcon = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/DynamicIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );

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

    var thisNode = this;
    Node.call( thisNode );

    /*
     * This line is not visible (has no stroke), but defines the height of the stack,
     * and ensures that the stack always has well-defined bounds, even when the stack
     * contains zero items. All other nodes will be horizontally centered on this line.
     */
    thisNode.addChild( new Line( 0, 0, 0, height ) );

    // parent for all items in the stack
    var itemsParent = new Node();
    thisNode.addChild( itemsParent );

    // update the number of nodes in the stack
    thisNode.iconNodes = []; // @private {DynamicIcon[]}
    thisNode.quantityPropertyObserver = function( quantity ) { // @private

      var count = Math.max( quantity, itemsParent.getChildrenCount() );

      for ( var i = 0; i < count; i++ ) {
        if ( i < itemsParent.getChildrenCount() ) {
          // set visibility of a node that already exists
          itemsParent.getChildAt( i ).visible = ( i < quantity );
        }
        else {
          // add a node
          var iconNode = new DynamicIcon( iconProperty, {
            centerX: 0,
            centerY: startCenterY - ( i * deltaY )
          } );
          itemsParent.addChild( iconNode );
          thisNode.iconNodes.push( iconNode );
        }
      }
    };
    thisNode.quantityProperty = quantityProperty; // @private
    thisNode.quantityProperty.link( thisNode.quantityPropertyObserver ); // must be unlinked in dispose

    thisNode.mutate( options );
  }

  return inherit( Node, StackNode, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.iconNodes.forEach( function( node ) { node.dispose(); } );
      this.iconNodes = null;
      this.quantityProperty.unlink( this.quantityPropertyObserver );
    }
  } );
} );
