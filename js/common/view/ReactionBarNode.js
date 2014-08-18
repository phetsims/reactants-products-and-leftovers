// Copyright 2002-2014, University of Colorado Boulder

/**
 * Horizontal bar that contains a control for selecting a reaction,
 * and displays the formula for the reaction.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ReactionChoiceNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionChoiceNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var X_MARGIN = 10;
  var Y_MARGIN = 10;

  function ReactionBarNode( reactionProperty, reactions, screenWidth, options ) {

    // control for choosing a reaction
    var reactionChoiceNode = new ReactionChoiceNode( reactionProperty, reactions );

    // background, extra wide so that it will appear to fill the screen width for all but extreme window sizes
    var backgroundNode = new Rectangle( 0, 0, 4 * screenWidth, reactionChoiceNode.height + ( 2 * Y_MARGIN ), { fill: '#3376c4', centerX: screenWidth / 2 } );

    //TODO display reaction formula

    // control at right, vertically centered
    reactionChoiceNode.right = screenWidth - X_MARGIN;
    reactionChoiceNode.centerY = backgroundNode.centerY;

    options.children = [ backgroundNode, reactionChoiceNode ];
    Node.call( this, options );
  }

  return inherit( Node, ReactionBarNode );
} );
