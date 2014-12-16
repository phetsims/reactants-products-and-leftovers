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
      labelNode: null, // {Node|null} optional label that will be centered below bracket's tip
      bracketWidth: 100,
      bracketEndRadius: 5, // radius of the arcs at the ends of the bracket
      bracketTipRadius: 6, // radius of the arcs at the tip (center) of the bracket
      bracketStroke: 'black',
      ySpacing: 2 // vertical space between label and tip of bracket
    }, options );

    Node.call( this );

    // bracket shape, created left-to-right
    var bracketShape = new Shape()
      // left end curves up
      .arc( options.bracketEndRadius, 0, options.bracketEndRadius, Math.PI, 0.5 * Math.PI, true )
      .lineTo( ( options.bracketWidth / 2 ) - options.bracketTipRadius, options.bracketEndRadius )
      // tip points down
      .arc( ( options.bracketWidth / 2 ) - options.bracketTipRadius, options.bracketEndRadius + options.bracketTipRadius, options.bracketTipRadius, 1.5 * Math.PI, 0 )
      .arc( ( options.bracketWidth / 2 ) + options.bracketTipRadius, options.bracketEndRadius + options.bracketTipRadius, options.bracketTipRadius, Math.PI, 1.5 * Math.PI )
      // right end curves up
      .lineTo( options.bracketWidth - options.bracketEndRadius, options.bracketEndRadius )
      .arc( options.bracketWidth - options.bracketEndRadius, 0, options.bracketEndRadius, 0.5 * Math.PI, 0, true );

    // bracket node
    var bracketNode = new Path( bracketShape, {
      stroke: options.bracketStroke
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