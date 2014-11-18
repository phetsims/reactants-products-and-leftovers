// Copyright 2002-2014, University of Colorado Boulder

//TODO lots to do here
/**
 * Displays items in a grid.
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

  // constants
  //TODO 4x5 (20) is not enough to handle 2x8 products + 2x8 leftovers (32)
  var ROWS = 4;
  var COLUMNS = 5;
  var BOX_MARGIN = 5; // margin of space around the inside edge of the box
  var CELL_MARGIN = 1; // margin of space around the inside edge of each cell

  function GridBox( items, options ) {

    options = _.extend( {
      boxSize: new Dimension2( 200, 200 ),
      cornerRadius: 3,
      fill: 'white',
      stroke: RPALColors.BOX_STROKE
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // multi-dimensional array of cells
    var cells = [];
    for ( var i = 0; i < COLUMNS; i++ ) {
      cells.push( [] );
    }

    // compute cell size
    var cellWidth = ( options.boxSize.width - ( 2 * BOX_MARGIN ) ) / COLUMNS;
    var cellHeight = ( options.boxSize.height - ( 2 * BOX_MARGIN ) ) / ROWS;
    var cellSize = new Dimension2( cellWidth, cellHeight );

    // the box
    var boxNode = new Rectangle( 0, 0, options.boxSize.width.options.boxSize.height, options.cornerRadius, options.cornerRadius, {
      fill: options.fill,
      stroke: options.stroke
    } );
    thisNode.addChild( boxNode );

    // parent for all molecules in the box
    var moleculesParent = new Node();
    thisNode.addChild( moleculesParent );

    this.mutate( options );
  }

  return inherit( Node, GridBox, {

    dispose: function() {
      //TODO
    }
  } );
} );
