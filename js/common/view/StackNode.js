// Copyright 2002-2014, University of Colorado Boulder

/**
 * A vertical stack of some item, built from the bottom up.
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
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SubstanceNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceNode' );

  /**
   * @param {number} height height of the stack
   * @param {Property.<Node>} nodeProperty the node to display
   * @param {Property.<number>} quantityProperty the number of nodes to display
   * @param {number} startCenterY the centerY of the bottom node in the stack
   * @param {number} deltaY the vertical spacing between nodes in the stack
   * @param {Object} [options]
   * @constructor
   */
  function StackNode( height, nodeProperty, quantityProperty, startCenterY, deltaY, options ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.quantityProperty = quantityProperty; // @private see dispose
    thisNode.substanceNodes = []; // @private see dispose

    /*
     * This line is not visible (has no stroke), but defines the height of the stack,
     * and ensures that the stack always has well-defined bounds.
     */
    thisNode.addChild( new Line( 0, 0, 0, height ) );

    // parent for all items in the stack
    var itemsParent = new Node();
    thisNode.addChild( itemsParent );

    // @private When the quantity changes ...
    thisNode.quantityPropertyObserver = function( quantity ) {

      var count = Math.max( quantity, itemsParent.getChildrenCount() );

      for ( var i = 0; i < count; i++ ) {
        if ( i < itemsParent.getChildrenCount() ) {
          // set visibility of a node that already exists
          itemsParent.getChildAt( i ).visible = ( i < quantity );
        }
        else {
          // add a node
          var substanceNode = new SubstanceNode( nodeProperty, {
            centerX: 0,
            centerY: startCenterY - ( i * deltaY )
          } );
          itemsParent.addChild( substanceNode );
          thisNode.substanceNodes.push( substanceNode );
        }
      }
    };
    thisNode.quantityProperty.link( thisNode.quantityPropertyObserver );

    thisNode.mutate( options );
  }

  return inherit( Node, StackNode, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.quantityProperty.unlink( this.quantityPropertyObserver );
      this.substanceNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );
} );
