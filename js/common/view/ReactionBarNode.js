// Copyright 2002-2014, University of Colorado Boulder

/**
 * Horizontal bar that contains a control for selecting a reaction, and displays the reaction's equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ReactionRadioButtons = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionRadioButtons' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );

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
      xMargin: 20,
      yMargin: 10,
      fill: RPALColors.PANEL_FILL,
      showSymbols: true // true = show symbols, false = show nodes
    }, options );

    var thisNode = this;

    // radio buttons for choosing a reaction, scaled to fit for i18n
    var radioButtons = new ReactionRadioButtons( reactionProperty, reactions );
    radioButtons.setScaleMagnitude( Math.min( 1, 0.25 * options.screenWidth / radioButtons.width ) );

    // background, extra wide so that it will appear to fill the window for all but extreme window sizes
    var backgroundNode = new Rectangle( 0, 0, 4 * options.screenWidth, radioButtons.height + ( 2 * options.yMargin ),
      { fill: options.fill, centerX: options.screenWidth / 2 } );

    // radio buttons at right, vertically centered
    radioButtons.right = options.screenWidth - options.xMargin;
    radioButtons.centerY = backgroundNode.centerY;

    options.children = [ backgroundNode, radioButtons ];
    Node.call( thisNode, options );

    // update the equation to match the reaction
    var equationNode = null;
    reactionProperty.link( function( reaction ) {

      // dispose of previous equation
      if ( equationNode ) {
        thisNode.removeChild( equationNode );
        equationNode.dispose && equationNode.dispose(); // dispose of the node, if supported
      }

      // create equation for the reaction
      equationNode = createEquationNode( reaction );
      thisNode.addChild( equationNode );

      // scale the equation if it's too wide to fit the available space
      var availableWidth = radioButtons.left - ( 2 * options.xMargin );
      var scale = Math.min( 1, availableWidth / equationNode.width );
      equationNode.setScaleMagnitude( scale );

      // center the equation in the space to the left of the controls
      equationNode.centerX = options.xMargin + ( availableWidth / 2 );
      equationNode.centerY = backgroundNode.centerY;
    } );
  }

  return inherit( Node, ReactionBarNode );
} );
