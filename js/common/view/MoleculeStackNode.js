// Copyright 2002-2014, University of Colorado Boulder

/**
 * A vertical stack of molecules, built from the bottom up.
 * To improve performance:
 * <ul>
 * <li>Molecules are created as needed.</li>
 * <li>Molecules are never removed; they remain as children for the lifetime of this node.</li>
 * <li>The visibility of molecules is adjusted to show the correct number of molecules.</li>
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
   * @param {Property.<number>} quantityProperty the number of nodes in the stack
   * @param {Property.<Node>} nodeProperty the node that we're stacking
   * @param {number} centerX the centerX of all molecules in the stack
   * @param {number} startCenterY the centerY of the molecule at the bottom of the stack
   * @param {number} deltaY the vertical spacing between the centers of molecules in the stack
   * @param {Object} [options]
   * @constructor
   */
  function MoleculeStackNode( quantityProperty, nodeProperty, centerX, startCenterY, deltaY, options ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.quantityProperty = quantityProperty; // @private
    thisNode.nodeProperty = nodeProperty; // @private

    // @private When the quantity changes ...
    thisNode.quantityPropertyObserver = function( quantity ) {
      var count = Math.max( quantity, thisNode.getChildrenCount() );
      for ( var i = 0; i < count; i++ ) {
        if ( i < thisNode.getChildrenCount() ) {
          // set visibility of a molecule that already exists
          thisNode.getChildAt( i ).visible = ( i < quantity );
        }
        else {
          // add a molecule
          thisNode.addChild( new Node( {
            children: [ nodeProperty.get() ],
            centerX: centerX,
            centerY: startCenterY - ( i * deltaY )
          } ) );
        }
      }
    };
    quantityProperty.link( thisNode.quantityPropertyObserver );

    // @private When the node changes
    thisNode.nodePropertyObserver = function( node ) {
      thisNode.removeAllChildren();
      thisNode.quantityPropertyObserver( quantityProperty.get() );
    };
    nodeProperty.link( thisNode.nodePropertyObserver );

    thisNode.mutate( options );
  }

  return inherit( Node, MoleculeStackNode, {

    // @public Unlinks all property observers. The node is no longer functional after calling this function.
    dispose: function() {
      this.quantityProperty.unlink( this.quantityPropertyObserver );
      this.nodeProperty.unlink( this.nodePropertyObserver );
    }
  } );
} );
