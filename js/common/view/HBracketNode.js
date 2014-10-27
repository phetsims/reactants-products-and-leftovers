// Copyright 2002-2014, University of Colorado Boulder

/**
 * Horizontal bracket with a text label centered below it.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var BRACKET_END_HEIGHT = 5;
  var BRACKET_TIP_WIDTH = 6;
  var BRACKET_TIP_HEIGHT = 6;

  /**
   * @param {SCENERY.Node} labelNode node that is used to label the bracket
   * @param {Object} [options]
   * @constructor
   */
  function HBracketNode( labelNode, options ) {

    options = _.extend( {
      bracketWidth: 100,
      bracketColor: 'black',
      ySpacing: 2
    }, options );

    // bracket, tip points down
    var bracketShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, BRACKET_END_HEIGHT )
      .lineTo( ( options.bracketWidth - BRACKET_TIP_WIDTH ) / 2, BRACKET_END_HEIGHT )
      .lineTo( ( options.bracketWidth / 2 ), ( BRACKET_END_HEIGHT + BRACKET_TIP_HEIGHT ) )
      .lineTo( ( options.bracketWidth + BRACKET_TIP_WIDTH ) / 2, BRACKET_END_HEIGHT )
      .lineTo( options.bracketWidth, BRACKET_END_HEIGHT )
      .lineTo( options.bracketWidth, 0 );
    var bracketNode = new Path( bracketShape, {
      stroke: options.bracketColor
    } );

    // label, centered below bracket
    labelNode.centerX = bracketNode.centerX;
    labelNode.top = bracketNode.bottom + options.ySpacing;

    options.children = [ bracketNode, labelNode ];
    Node.call( this, options );
  }

  return inherit( Node, HBracketNode );
} );