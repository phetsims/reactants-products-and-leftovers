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
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var SubstanceIcon = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceIcon' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {[BoxItem]} items the items in the box
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
      randomOffset: RPALQueryParameters.RANDOM_OFFSET
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
    var dx = Math.floor( ( options.boxSize.width - ( 2 * options.margin ) - ( 2 * options.randomOffset ) ) / columns );
    var dy = Math.floor( ( options.boxSize.height - ( 2 * options.margin ) - ( 2 * options.randomOffset ) ) / rows );
    for ( var column = 0; column < columns; column++ ) {
      for ( var row = 0; row < rows; row++ ) {
        var x = options.margin + options.randomOffset + ( dx / 2 ) + ( column * dx );
        var y = options.margin + options.randomOffset + ( dy / 2 ) + ( row * dy );
        positions.push( new Vector2( x, y ) );
      }
    }
    assert && assert( positions.length === rows * columns );

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
     * Puts a position back in the pool of positions.
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
    thisNode.itemLayers = []; // @private [{ItemLayer}] see dispose
    var parent = new Node();
    items.forEach( function( item ) {
      var itemLayer = new ItemLayer( item.iconProperty, item.quantityProperty, options.randomOffset, choosePosition, releasePosition );
      parent.addChild( itemLayer );
      thisNode.itemLayers.push( itemLayer );
    } );
    thisNode.addChild( parent );

    thisNode.mutate( options );
  }

  /**
   * Responsible for managing all nodes for one item type.
   *
   * @param {Property.<Node>} iconProperty
   * @param {Property.<number>} quantityProperty
   * @param {number} randomOffset
   * @param {function} choosePosition returns {Vector2}
   * @param {function} releasePosition @param {Vector2}
   * @constructor
   * @private
   */
  function ItemLayer( iconProperty, quantityProperty, randomOffset, choosePosition, releasePosition ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.quantityProperty = quantityProperty; // @private see dispose
    thisNode.iconNodes = []; // {[SubstanceIconWithPosition]} @private see dispose

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
            node.gridPositionProperty.set( choosePosition() );
          }
          else if ( !node.visible && nodeWasVisible ) {
            // when a visible node becomes invisible, make its position available
            releasePosition( node.gridPositionProperty.get() );
          }
        }
        else {
          // add a node
          var iconNode = new SubstanceIconWithPosition( iconProperty, choosePosition(), randomOffset );
          thisNode.addChild( iconNode );
          thisNode.iconNodes.push( iconNode );
        }
      }
    };
    thisNode.quantityProperty.link( thisNode.quantityPropertyObserver );
  }

  inherit( Node, ItemLayer, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.quantityProperty.unlink( this.quantityPropertyObserver );
      this.iconNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );

  /**
   * Specialization of SubstanceIcon that keeps track of its grid position,
   * and randomizes its position to make the grid look less regular.
   * @param {Property.<Node>} iconProperty
   * @param {Vector2} gridPosition
   * @param {number} randomOffset
   * @constructor
   * @private
   */
  function SubstanceIconWithPosition( iconProperty, gridPosition, randomOffset ) {

    var thisNode = this;
    SubstanceIcon.call( thisNode, iconProperty );

    thisNode.gridPositionProperty = new Property( gridPosition );
    thisNode.gridPositionProperty.link( function( gridPosition ) {
      // Move this node to the specified grid position, with some randomized offset.
      thisNode.centerX = gridPosition.x + _.random( -randomOffset, randomOffset );
      thisNode.centerY = gridPosition.y + _.random( -randomOffset, randomOffset );
    } );
  }

  inherit( SubstanceIcon, SubstanceIconWithPosition );

  return inherit( Node, RandomBox, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.itemLayers.forEach( function( node ) { node.dispose(); } );
    }
  } );
} );
