// Copyright 2002-2014, University of Colorado Boulder

/**
 * Box that is placed over things that are 'hidden' while playing a challenge.
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
  function HiddenBox( options ) {

    options = _.extend( {
      boxSize: new Dimension2( 300, 50 ),
      iconScale: 1 //TODO would rather specify width and compute scale, but FontAwesomeNode.setScaleMagnitude is buggy
    }, options );

    var rectangleNode = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, {
      fill: 'white',
      stroke: 'rgb(180,180,180)',
      lineDash: [ 4, 4 ]
    } );

    var iconNode = new FontAwesomeNode( 'eye_close', {
      fill: 'rgb(180,180,180)',
      scale: options.iconScale,
      center: rectangleNode.center
    } );

    options.children = [ rectangleNode, iconNode ];
    Node.call( this, options );
  }

  return inherit( Node, HiddenBox );
} );
