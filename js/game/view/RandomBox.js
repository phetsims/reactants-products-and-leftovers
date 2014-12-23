// Copyright 2002-2014, University of Colorado Boulder

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
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/MoleculesNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );

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
      stroke: RPALColors.BOX_STROKE
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // the box
    var boxNode = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, options.cornerRadius, options.cornerRadius, {
      fill: options.fill,
      stroke: options.stroke
    } );
    thisNode.addChild( boxNode );

    // molecules in the box
    thisNode.moleculesNode = new MoleculesNode( substances, new Bounds2( 0, 0, options.boxSize.width, options.boxSize.height ), {
      boxSize: options.boxSize,
      maxQuantity: options.maxQuantity
    } );
    thisNode.addChild( thisNode.moleculesNode );

    thisNode.mutate( options );
  }

  return inherit( Node, RandomBox, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.moleculesNode.dispose();
      this.moleculesNode = null;
    }
  } );
} );
