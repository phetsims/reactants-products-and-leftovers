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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var BRACKET_END_HEIGHT = 5;
  var BRACKET_TIP_WIDTH = 6;
  var BRACKET_TIP_HEIGHT = 6;

  function BracketNode( label, options ) {

    options = _.extend( {
      font: new PhetFont( 16 ),
      textColor: 'black',
      bracketWidth: 100,
      bracketColor: 'rgb(46,107,178)', // dark blue
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
    var labelNode = new Text( label, {
      font: options.font,
      fill: options.textColor,
      centerX: bracketNode.centerX,
      top: bracketNode.bottom + options.ySpacing
    } );

    options.children = [ bracketNode, labelNode ];
    Node.call( this, options );
  }

  return inherit( Node, BracketNode );
} );