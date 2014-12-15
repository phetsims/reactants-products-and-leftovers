// Copyright 2002-2014, University of Colorado Boulder

/**
 * Box that is placed over things that are 'hidden' while playing a challenge.
 * Has a dashed border and a 'closed eye' icon in the center of the box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HideBox( options ) {

    options = _.extend( {
      boxSize: new Dimension2( 100, 100 ),
      iconHeight: 35,
      cornerRadius: 0
    }, options );

    // dashed box
    var rectangleNode = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, options.cornerRadius, options.cornerRadius, {
      fill: 'white',
      stroke: 'rgb(180,180,180)',
      lineDash: [ 14, 14 ]
    } );

    // closed-eye icon
    var eyeNode = new FontAwesomeNode( 'eye_close', { fill: 'rgb(180,180,180)' } );
    eyeNode.setScaleMagnitude( options.iconHeight / eyeNode.height );
    eyeNode.center = rectangleNode.center;

    options.children = [ rectangleNode, eyeNode ];
    Node.call( this, options );
  }

  return inherit( Node, HideBox );
} );
