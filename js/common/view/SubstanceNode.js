// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays a substance's Node.
 * <p>
 * Scenery is a DAG and allows one instance of a Node to appear in the scenegraph in
 * multiple places, with 2 caveats: (1) a Node cannot be a sibling of itself, and (2)
 * transforming a node will do so everywhere that it appears. Because a Substance will
 * appear in multiple places in the view, this type provides a convenient way to
 * wrap a substance's Node, so that we don't accidentally make it a sibling of itself, or
 * attempt to position it.
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
   * @param {Substance} substance
   * @param {Object} [options]
   * @constructor
   */
  function SubstanceNode( substance, options ) {

    options = _.extend( {
      centerY: 0
    }, options );

    Node.call( this );

    // Add an additional wrapper, so that we can maintain the node's center.
    var wrapperNode = new Node();
    this.addChild( wrapperNode );

    this.nodeProperty = substance.nodeProperty;
    this.nodePropertyObserver = function( node ) {
      wrapperNode.removeAllChildren();
      wrapperNode.addChild( node );
      wrapperNode.center = Vector2.ZERO;
    };
    this.nodeProperty.link( this.nodePropertyObserver );

    this.mutate( options );
  }

  return inherit( Node, SubstanceNode, {

    // Unlinks property observers. The node is no longer functional after calling this function.
    dispose: function() {
      this.nodeProperty.unlink( this.nodePropertyObserver );
    }
  } );
} );
