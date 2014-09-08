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
   * @param {Property<number>} quantityProperty
   * @param {Node} imageNode
   * @param {number} centerX the centerX of all molecules in the stack
   * @param {number} startCenterY the centerY of the molecule at the bottom of the stack
   * @param {number} deltaY the vertical spacing between the centers of molecules in the stack
   * @param {Object} options
   * @constructor
   */
  function MoleculeStackNode( quantityProperty, imageNode, centerX, startCenterY, deltaY, options ) {

    var thisNode = this;
    Node.call( thisNode );

    // When the quantity changes ...
    var quantityPropertyObserver = function( quantity ) {
      var count = Math.max( quantity, thisNode.getChildrenCount() );
      for ( var i = 0; i < count; i++ ) {
        if ( i < thisNode.getChildrenCount() ) {
          // set visibility of a molecule that already exists
          thisNode.getChildAt( i ).visible = ( i < quantity );
        }
        else {
          // add a molecule
          thisNode.addChild( new Node( {
            children: [ imageNode ],
            centerX: centerX,
            centerY: startCenterY - ( i * deltaY )
          } ) );
        }
      }
    };
    quantityProperty.link( quantityPropertyObserver );

    // @public Unlinks all property observers. The node is no longer functional after calling this function.
    thisNode.unlink = function() {
      quantityProperty.unlink( quantityPropertyObserver );
    };

    thisNode.mutate( options );
  }

  return inherit( Node, MoleculeStackNode );
} );
