// Copyright 2002-2014, University of Colorado Boulder

/**
 * Horizontal bracket with optional label centered below it.
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

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HBracketNode( options ) {

    options = _.extend( {
      labelNode: null, // optional {Node} label that will be centered below bracket's tip
      bracketWidth: 100,
      bracketEndHeight: 5,
      bracketCurveXOffset: 5, // x-offset of the bracket's curved segments
      bracketTipWidth: 6,
      bracketTipHeight: 6,
      bracketColor: 'black',
      ySpacing: 2 // vertical space between label and tip of bracket
    }, options );

    Node.call( this );

    // bracket, create shape left-to-right
    var bracketShape = new Shape()
      // left end curves up
      .moveTo( 0, 0 )
      .quadraticCurveTo( 0, options.bracketEndHeight, options.bracketCurveXOffset, options.bracketEndHeight )
      .lineTo( ( ( options.bracketWidth - options.bracketTipWidth ) / 2 ) - options.bracketCurveXOffset, options.bracketEndHeight )
      // tip points down
      .quadraticCurveTo( options.bracketWidth / 2, options.bracketEndHeight,
        options.bracketWidth / 2, ( options.bracketEndHeight + options.bracketTipHeight ) )
      .quadraticCurveTo( ( options.bracketWidth / 2 ), options.bracketEndHeight,
        ( ( options.bracketWidth + options.bracketTipWidth ) / 2 ) + options.bracketCurveXOffset, options.bracketEndHeight )
      // right end curves up
      .lineTo( options.bracketWidth - options.bracketCurveXOffset, options.bracketEndHeight )
      .quadraticCurveTo( options.bracketWidth, options.bracketEndHeight, options.bracketWidth, 0 );
    var bracketNode = new Path( bracketShape, {
      stroke: options.bracketColor
    } );
    this.addChild( bracketNode );

    // optional label, centered below bracket
    if ( options.labelNode ) {
      this.addChild( options.labelNode );
      options.labelNode.centerX = bracketNode.centerX;
      options.labelNode.top = bracketNode.bottom + options.ySpacing;
    }

    this.mutate( options );
  }

  return inherit( Node, HBracketNode );
} );