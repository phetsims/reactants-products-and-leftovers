// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays an icon that may change dynamically.
 * <p>
 * Scenery is a DAG and allows one instance of a Node to appear in the scenegraph in
 * multiple places, with 2 caveats: (1) a Node cannot be a sibling of itself, and (2)
 * transforming a node will do so everywhere that it appears. Because an icon can
 * appear in multiple places in the view, this type provides a convenient way to
 * wrap an icon, so that we don't accidentally make it a sibling of itself, or
 * attempt to position it.  It also ensures that the icon's origin (0,0) is at the
 * center of its bounds, which we take advantage of in layout code.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<Node>} iconProperty
   * @param {Object} [options]
   * @constructor
   */
  function DynamicIcon( iconProperty, options ) {

    Node.call( this );

    // Add an additional wrapper, so that we can maintain the node's center.
    var wrapperNode = new Node();
    this.addChild( wrapperNode );

    this.iconProperty = iconProperty; // @private
    this.iconPropertyObserver = function( node ) { // @private
      wrapperNode.removeAllChildren();
      wrapperNode.addChild( node );
      wrapperNode.center = Vector2.ZERO;
    };
    this.iconProperty.link( this.iconPropertyObserver ); // must be unlinked in dispose

    this.mutate( options );
  }

  return inherit( Node, DynamicIcon, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.iconProperty.unlink( this.iconPropertyObserver );
    }
  } );
} );
