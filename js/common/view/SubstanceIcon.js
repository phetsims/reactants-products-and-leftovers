// Copyright 2014-2015, University of Colorado Boulder

/**
 * Displays a Substance's icon, which may change dynamically.
 * <p>
 * VERY IMPORTANT NOTES!
 * <p>
 * Scenery is a DAG and allows one instance of a Node to appear in the scenegraph in
 * multiple places, with 2 caveats: (1) a Node cannot be a sibling of itself, and (2)
 * transforming a node will do so everywhere that it appears. Because an icon can
 * appear in multiple places in the view, this type provides a convenient way to
 * wrap an icon, so that we don't accidentally make it a sibling of itself, or
 * attempt to position it.  It also ensures that the icon's origin (0,0) is at the
 * center of its bounds, which we take advantage of in layout code.
 * <p>
 * Substances typically have a lifetime that is longer than this node.
 * When this node is disposed of, the icon needs to be explicitly removed from its parent.
 * This is because scenery nodes keep a reference to their parent. If we don't explicitly
 * remove the icon from the scene graph, then all of its ancestors will be retained,
 * creating a memory leak.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<Node>} iconProperty
   * @param {Object} [options]
   * @constructor
   */
  function SubstanceIcon( iconProperty, options ) {

    var thisNode = this;
    Node.call( thisNode );

    // @private Add an additional wrapper, so that we can maintain the node's center.
    thisNode.wrapperNode = new Node();
    thisNode.addChild( thisNode.wrapperNode );

    thisNode.iconProperty = iconProperty; // @private
    thisNode.iconPropertyObserver = function( icon ) { // @private
      thisNode.wrapperNode.removeAllChildren();
      // icon must be removed in dispose, since scenery children keep a reference to their parents
      thisNode.wrapperNode.addChild( icon );
      thisNode.wrapperNode.center = Vector2.ZERO;
    };
    thisNode.iconProperty.link( this.iconPropertyObserver ); // must be unlinked in dispose

    thisNode.mutate( options );
  }

  reactantsProductsAndLeftovers.register( 'SubstanceIcon', SubstanceIcon );

  return inherit( Node, SubstanceIcon, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.iconProperty.unlink( this.iconPropertyObserver );
      this.wrapperNode.removeAllChildren(); // to disconnect from icon
    }
  } );
} );
