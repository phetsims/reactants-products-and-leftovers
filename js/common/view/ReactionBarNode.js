// Copyright 2002-2014, University of Colorado Boulder

/**
 * Horizontal bar that contains a control for selecting a reaction,
 * and displays the formula for the reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ReactionChoiceNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionChoiceNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );

  // constants
  var X_MARGIN = 20;
  var Y_MARGIN = 10;

  /**
   * @param {Property.<Reaction>} reactionProperty the selected reaction
   * @param {Reaction[]} reactions the reaction choices
   * @param {function} createEquationNode takes one {Reaction} parameter, returns {Node}
   * @param {Object} [options]
   * @constructor
   */
  function ReactionBarNode( reactionProperty, reactions, createEquationNode, options ) {

    options = _.extend( {
      screenWidth: 1000, // width of the screen's safe area
      showSymbols: true // true = show molecule symbol, false = show molecule node
    }, options );

    // control for choosing a reaction
    var reactionChoiceNode = new ReactionChoiceNode( reactionProperty, reactions );

    // background, extra wide so that it will appear to fill the screen width for all but extreme window sizes
    var backgroundNode = new Rectangle( 0, 0, 4 * options.screenWidth, reactionChoiceNode.height + ( 2 * Y_MARGIN ),
      { fill: RPALColors.REACTION_BAR_COLOR, centerX: options.screenWidth / 2 } );

    // control at right, vertically centered
    reactionChoiceNode.right = options.screenWidth - X_MARGIN;
    reactionChoiceNode.centerY = backgroundNode.centerY;

    // parent for equation
    var equationParent = new Node();

    options.children = [ backgroundNode, equationParent, reactionChoiceNode ];
    Node.call( this, options );

    reactionProperty.link( function( reaction ) {

      // create the new equation node
      equationParent.removeAllChildren();
      equationParent.addChild( createEquationNode( reaction ) );
      equationParent.setScaleMagnitude( 1 );

      // scale the equation if it's too wide to fit the available space
      var availableWidth = reactionChoiceNode.left - ( 2 * X_MARGIN );
      var scale = Math.min( 1, availableWidth / equationParent.width );
      equationParent.setScaleMagnitude( scale );

      // center the equation in the space to the left of the controls
      equationParent.centerX = X_MARGIN + ( availableWidth / 2 );
      equationParent.centerY = backgroundNode.centerY;
    } );
  }

  return inherit( Node, ReactionBarNode );
} );
