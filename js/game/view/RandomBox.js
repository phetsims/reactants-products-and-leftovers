// Copyright 2014-2015, University of Colorado Boulder

/**
 * Displays substances at random positions in a box.
 * This is used for the 'Before' and 'After' boxes in the Game screen.
 * <p>
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
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var SubstanceIcon = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceIcon' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Substance[]} substances the substances in the box
   * @param {Object} [options]
   * @constructor
   */
  function RandomBox( substances, options ) {

    options = _.extend( {
      boxSize: new Dimension2( 100, 100 ),
      maxQuantity: 4, // the maximum quantity of each substance in the box
      cornerRadius: 3,
      fill: RPALColors.BOX_FILL,
      stroke: RPALColors.BOX_STROKE,
      margin: 5, // margin around the inside edge of the box
      /**
       * Molecules in the box are arranged in a grid. This option controls how much the molecules are randomly offset from the center
       * of the grid's cells. Higher values make the layout look less grid-like, but result in more overlap of molecules (a trade-off).
       */
      randomOffset: 8
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    /*
     * Compute the size of the grid needed to accommodate the maximum number of nodes.
     * Assume that the box is square-ish, so can have the same number of rows and columns.
     */
    var rows = Math.round( Math.sqrt( substances.length * options.maxQuantity ) );
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

    // substances inside the box
    thisNode.substanceLayers = []; // @private [{SubstanceLayer}]
    var parent = new Node();
    substances.forEach( function( substance ) {
      var substanceLayer = new SubstanceLayer( substance.iconProperty, substance.quantityProperty, options.randomOffset, choosePosition, releasePosition );
      parent.addChild( substanceLayer );
      thisNode.substanceLayers.push( substanceLayer );
    } );
    thisNode.addChild( parent );

    thisNode.mutate( options );
  }

  reactantsProductsAndLeftovers.register( 'RandomBox', RandomBox );

  /**
   * Responsible for managing all nodes for one substance type.
   *
   * @param {Property.<Node>} iconProperty
   * @param {Property.<number>} quantityProperty
   * @param {number} randomOffset
   * @param {function} choosePosition returns {Vector2}
   * @param {function} releasePosition @param {Vector2}
   * @constructor
   * @private
   */
  function SubstanceLayer( iconProperty, quantityProperty, randomOffset, choosePosition, releasePosition ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.cellNodes = []; // @private {CellNode[]}

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
            releasePosition( node.getGridPosition() );
          }
        }
        else {
          // add a node
          var cellNode = new CellNode( iconProperty, choosePosition(), randomOffset );
          thisNode.addChild( cellNode );
          thisNode.cellNodes.push( cellNode );
        }
      }
    };
    thisNode.quantityProperty = quantityProperty; // @private
    thisNode.quantityProperty.link( thisNode.quantityPropertyObserver ); // must be unlinked in dispose
  }

  reactantsProductsAndLeftovers.register( 'RandomBox.SubstanceLayer', SubstanceLayer );

  inherit( Node, SubstanceLayer, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.cellNodes.forEach( function( node ) { node.dispose(); } );
      this.cellNodes = null;
      this.quantityProperty.unlink( this.quantityPropertyObserver );
    }
  } );

  /**
   * Icon that occupies a cell in the grid, randomizes its position to make the grid look less regular.
   * @param {Property.<Node>} iconProperty
   * @param {Vector2} gridPosition
   * @param {number} randomOffset
   * @constructor
   * @private
   */
  function CellNode( iconProperty, gridPosition, randomOffset ) {

    SubstanceIcon.call( this, iconProperty );

    this.gridPosition = gridPosition; // @private
    this.randomOffset = randomOffset; // @private

    this.setGridPosition( gridPosition ); // initialize position
  }

  reactantsProductsAndLeftovers.register( 'RandomBox.CellNode', CellNode );

  inherit( SubstanceIcon, CellNode, {

    getGridPosition: function() { return this.gridPosition; },

    setGridPosition: function( gridPosition ) {
      this.gridPosition = gridPosition;
      // Move this node to the specified grid position, with some randomized offset.
      this.centerX = gridPosition.x + _.random( -this.randomOffset, this.randomOffset );
      this.centerY = gridPosition.y + _.random( -this.randomOffset, this.randomOffset );
    }
  } );

  return inherit( Node, RandomBox, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.substanceLayers.forEach( function( node ) { node.dispose(); } );
      this.substanceLayers = null;
    }
  } );
} );
