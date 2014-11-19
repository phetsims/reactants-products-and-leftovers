// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays items at random positions in a box.
 * To improve performance:
 * <ul>
 * <li>Nodes are created as needed.</li>
 * <li>Nodes are never removed; they remain as children for the lifetime of this node.</li>
 * <li>The visibility of nodes is adjusted to show the correct quantity of the substance.</li>
 * <li>When a node becomes visible, it is assigned a position in the grid.
 * </ul>
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var SubstanceNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param items the items in the box TODO type?
   * @param {number} maxQuantity the maximum quantity of each item in the box
   * @param {Object} [options]
   * @constructor
   */
  function RandomBox( items, maxQuantity, options ) {

    options = _.extend( {
      boxSize: new Dimension2( 100, 100 ),
      cornerRadius: 3,
      fill: 'white',
      stroke: RPALColors.BOX_STROKE,
      margin: 5, // margin around the inside edge of the box
      /*
       * Maximum x- and y-offset of molecules from the center of a cell in the grid.
       * Larger numbers make the layout look less like a grid, but increase overlapping.
       */
      randomOffset: 8
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    /*
     * Compute the size of the grid needed to accommodate the maximum number of items.
     * Assume that the box is approximately square, so can have the same number of rows and columns.
     */
    var rows = Math.round( Math.sqrt( items.length * maxQuantity ) );
    var columns = rows;

    // Compute positions in the grid, this is our 'pool' of positions.
    var positions = [];
    var x, y;
    var dx = Math.floor( ( options.boxSize.width - ( 2 * options.margin ) - ( 2 * options.randomOffset ) ) / columns );
    var dy = Math.floor( ( options.boxSize.height - ( 2 * options.margin ) - ( 2 * options.randomOffset ) ) / rows );
    for ( var column = 0; column < columns; column++ ) {
      for ( var row = 0; row < rows; row++ ) {
        x = options.margin + options.randomOffset + ( dx / 2 ) + ( column * dx );
        y = options.margin + options.randomOffset + ( dy / 2 ) + ( row * dy );
        positions.push( new Vector2( x, y ) );
      }
    }
    assert && assert( positions.length === rows * columns );
    positions = _.shuffle( positions );

    /**
     * Chooses a random position and remove it from the pool of positions.
     * @returns {Vector2}
     */
    var choosePosition = function() {
      assert && assert( positions.length > 0 );
      var index = _.random( 0, positions.length - 1 );
      var position = positions[ index ];
      positions.splice( index, 1 );
      return position;
    };

    /**
     * Puts a position back in the pool of position.
     * @param {Vector2} position
     */
    var releasePosition = function( position ) {
      positions.push( position );
    };

    // the box
    var boxNode = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, options.cornerRadius, options.cornerRadius, {
      fill: options.fill,
      stroke: options.stroke
    } );
    thisNode.addChild( boxNode );

    // items inside the box
    thisNode.randomNodes = []; // @private see dispose
    var parent = new Node();
    items.forEach( function( item ) {
      var randomNode = new RandomNode( item.nodeProperty, item.quantityProperty, options.randomOffset, choosePosition, releasePosition );
      parent.addChild( randomNode );
      thisNode.randomNodes.push( randomNode );
    } );
    thisNode.addChild( parent );

    thisNode.mutate( options );
  }

  /**
   * Responsible for managing all nodes for one item.
   * @param {Property.<Node>} nodeProperty
   * @param {Property.<number> quantityProperty
   * @param {number} randomOffset
   * @param {function} choosePosition returns {Vector2}
   * @param {function} releasePosition @param {Vector2}
   * @constructor
   */
  function RandomNode( nodeProperty, quantityProperty, randomOffset, choosePosition, releasePosition ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.quantityProperty = quantityProperty; // @private see dispose
    thisNode.substanceNodes = []; // {[SubstanceNodeWithPosition]} @private see dispose

    thisNode.quantityPropertyObserver = function( quantity ) {

      var count = Math.max( quantity, thisNode.getChildrenCount() );

      for ( var i = 0; i < count; i++ ) {

        if ( i < thisNode.getChildrenCount() ) {

          // node already exists
          var node = thisNode.getChildAt( i );
          var nodeWasVisible = node.visible;
          node.visible = ( i < quantity );

          if ( node.visible && !nodeWasVisible ) {
            // when an existing node becomes visible, choose a new position for it
            node.setGridPosition( choosePosition() );
          }
          else if ( !node.visible && nodeWasVisible ) {
            // when a visible node becomes invisible, make its position available
            releasePosition( node.gridPosition );
          }
        }
        else {
          // add a node
          var substanceNode = new SubstanceNodeWithPosition( nodeProperty, randomOffset, choosePosition() );
          thisNode.addChild( substanceNode );
          thisNode.substanceNodes.push( substanceNode );
        }
      }
    };
    thisNode.quantityProperty.link( thisNode.quantityPropertyObserver );
  }

  inherit( Node, RandomNode, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.quantityProperty.unlink( this.quantityPropertyObserver );
      this.substanceNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );

  /**
   * Specialization of SubstanceNode that keeps track of its grid position,
   * and randomizes it position to make the grid look less regular.
   * @param {Property.<Node>} nodeProperty
   * @param {number} randomOffset
   * @param {Vector2} gridPosition
   * @constructor
   */
  function SubstanceNodeWithPosition( nodeProperty, randomOffset, gridPosition ) {
    SubstanceNode.call( this, nodeProperty );
    this.randomOffset = randomOffset;
    this.setGridPosition( gridPosition );
  }

  inherit( SubstanceNode, SubstanceNodeWithPosition, {

    setGridPosition: function( gridPosition ) {
      this.gridPosition = gridPosition; // keep track of this so that it can be returned to the pool
      // randomize the position to make the grid look less regular
      this.centerX = gridPosition.x + _.random( -this.randomOffset, this.randomOffset );
      this.centerY = gridPosition.y + _.random( -this.randomOffset, this.randomOffset );
    }
  } );

  return inherit( Node, RandomBox, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.randomNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );
} );
