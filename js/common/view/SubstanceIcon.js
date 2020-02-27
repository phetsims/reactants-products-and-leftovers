// Copyright 2014-2019, University of Colorado Boulder

/**
 * Displays a Substance's icon, which may change dynamically.
 *
 * VERY IMPORTANT NOTES!
 *
 * Scenery is a DAG and allows one instance of a Node to appear in the scenegraph in
 * multiple places, with 2 caveats: (1) a Node cannot be a sibling of itself, and (2)
 * transforming a node will do so everywhere that it appears. Because an icon can
 * appear in multiple places in the view, this type provides a convenient way to
 * wrap an icon, so that we don't accidentally make it a sibling of itself, or
 * attempt to position it.  It also ensures that the icon's origin (0,0) is at the
 * center of its bounds, which we take advantage of in layout code.
 *
 * Substances typically have a lifetime that is longer than this node.
 * When this node is disposed of, the icon needs to be explicitly removed from its parent.
 * This is because scenery nodes keep a reference to their parent. If we don't explicitly
 * remove the icon from the scene graph, then all of its ancestors will be retained,
 * creating a memory leak.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Vector2 = require( 'DOT/Vector2' );

  class SubstanceIcon extends Node {

    /**
     * @param {Property.<Node>} iconProperty
     * @param {Object} [options]
     */
    constructor( iconProperty, options ) {

      super();

      // @private Add an additional wrapper, so that we can maintain the node's center.
      this.wrapperNode = new Node();
      this.addChild( this.wrapperNode );

      this.iconProperty = iconProperty; // @private
      this.iconPropertyObserver = icon => { // @private
        this.wrapperNode.removeAllChildren();
        // icon must be removed in dispose, since scenery children keep a reference to their parents
        this.wrapperNode.addChild( icon );
        this.wrapperNode.center = Vector2.ZERO;
      };
      this.iconProperty.link( this.iconPropertyObserver ); // must be unlinked in dispose

      this.mutate( options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      this.iconProperty.unlink( this.iconPropertyObserver );
      this.wrapperNode.removeAllChildren(); // to disconnect from icon
      super.dispose();
    }
  }

  return reactantsProductsAndLeftovers.register( 'SubstanceIcon', SubstanceIcon );
} );
