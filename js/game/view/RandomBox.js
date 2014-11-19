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
   * Gets a random value from an array of values.
   * @param {[*]} coordinates
   * @returns {*}
   */
  var getRandomValue = function( values ) {
    assert && assert( values.length > 0 );
    var index = _.random( 0, values.length - 1 );
    return values[index];
  };

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
      margin: 30
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // Assume that the box is approximately square, so can have the same number of rows and columns.
    var rows = Math.round( Math.sqrt( items.length * maxQuantity ) );
    var columns = rows;
    console.log( 'row=' + rows + ' columns=' + columns );
    
    // Compute x and y coordinates
    var positions = [];
    var dx = Math.floor( ( options.boxSize.width - ( 2 * options.margin ) ) / columns );
    var dy = Math.floor( ( options.boxSize.height - ( 2 * options.margin ) ) / rows );
    for ( var column = 1; column <= columns; column++ ) {
      for ( var row = 1; row <= rows; row++ ) {
        positions.push( new Vector2( column * dx, row * dy ) );
      }
    }
    assert && assert( positions.length === rows * columns );
    positions = _.shuffle( positions );

    // choose a random position and remove it from further consideration
    var choosePosition = function() {
      assert && assert( positions.length > 0 );
      var index = _.random( 0, positions.length - 1 );
      var position = positions[ index ];
      positions.splice( index, 1 );
      return position;
    };

    // release a position, making it available for use by other nodes
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
      var randomNode = new RandomNode( item, choosePosition, releasePosition );
      parent.addChild( randomNode );
      thisNode.randomNodes.push( randomNode );
    } );
    thisNode.addChild( parent );

    thisNode.mutate( options );
  }

  /**
   * Responsible for managing all instances of one item.
   * @param item TODO type?
   * @param {function} choosePosition returns {Vector2}
   * @constructor
   */
  function RandomNode( item, choosePosition, releasePosition ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.quantityProperty = item.quantityProperty; // @private see dispose
    thisNode.substanceNodes = []; // @private see dispose

    thisNode.quantityPropertyObserver = function( quantity ) {

      var position; // explicitly hoist reused vars

      var count = Math.max( quantity, thisNode.getChildrenCount() );

      for ( var i = 0; i < count; i++ ) {
        if ( i < thisNode.getChildrenCount() ) {

          // show a node that already exists
          var node = thisNode.getChildAt( i );
          var nodeWasVisible = node.visible;
          node.visible = ( i < quantity );

          if ( node.visible && !nodeWasVisible ) {
            // when an existing node becomes visible, choose a new position for it
            position = choosePosition();
            node.centerX = position.x;
            node.centerY = position.y;
          }
          else if ( !node.visible && nodeWasVisible ) {
            // when a visible node becomes invisible, make its position available
            releasePosition( new Vector2( node.centerX, node.centerY ) );
          }
        }
        else {
          // add a node
          position = choosePosition();
          var substanceNode = new SubstanceNode( item.nodeProperty, { centerX: position.x, centerY: position.y } );
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

  return inherit( Node, RandomBox, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.randomNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );
} );
