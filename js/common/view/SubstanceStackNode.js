// Copyright 2002-2014, University of Colorado Boulder

/**
 * A vertical stack of some Substance, built from the bottom up.
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
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {Substance} substance the substance in the stack
   * @param {number} centerX the centerX of the stack
   * @param {number} startCenterY the centerY of the bottom node in the stack
   * @param {number} deltaY the vertical spacing between nodes in the stack
   * @param {Object} [options]
   * @constructor
   */
  function SubstanceStackNode( substance, centerX, startCenterY, deltaY, options ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.substance = substance; // @private

    // @private When the quantity changes ...
    thisNode.quantityPropertyObserver = function( quantity ) {
      var count = Math.max( quantity, thisNode.getChildrenCount() );
      for ( var i = 0; i < count; i++ ) {
        if ( i < thisNode.getChildrenCount() ) {
          // set visibility of a node that already exists
          thisNode.getChildAt( i ).visible = ( i < quantity );
        }
        else {
          // add a node
          thisNode.addChild( new Node( {
            children: [ thisNode.substance.nodeProperty.get() ],
            centerX: centerX,
            centerY: startCenterY - ( i * deltaY )
          } ) );
        }
      }
    };
    substance.quantityProperty.link( thisNode.quantityPropertyObserver );

    // @private When the node that represents the substance changes ...
    thisNode.nodePropertyObserver = function( node ) {
      thisNode.removeAllChildren();
      thisNode.quantityPropertyObserver( substance.quantityProperty.get() );
    };
    substance.nodeProperty.link( thisNode.nodePropertyObserver );

    thisNode.mutate( options );
  }

  return inherit( Node, SubstanceStackNode, {

    // @public Unlinks all property observers. The node is no longer functional after calling this function.
    dispose: function() {
      this.substance.quantityProperty.unlink( this.quantityPropertyObserver );
      this.substance.nodeProperty.unlink( this.nodePropertyObserver );
    }
  } );
} );
