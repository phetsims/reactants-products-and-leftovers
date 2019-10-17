// Copyright 2014-2019, University of Colorado Boulder

/**
 * Box that is placed over things that are 'hidden' while playing a challenge.
 * Has a dashed border and a 'closed eye' icon in the center of the box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HideBox( options ) {

    options = merge( {
      boxSize: new Dimension2( 100, 100 ),
      iconHeight: 35,
      cornerRadius: 0
    }, options );

    // dashed box
    const rectangleNode = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, options.cornerRadius, options.cornerRadius, {
      fill: 'white',
      stroke: 'rgb(180,180,180)',
      lineDash: [ 14, 14 ]
    } );

    // closed-eye icon
    const eyeNode = new FontAwesomeNode( 'eye_close', { fill: 'rgb(180,180,180)' } );
    eyeNode.setScaleMagnitude( options.iconHeight / eyeNode.height );
    eyeNode.center = rectangleNode.center;

    options.children = [ rectangleNode, eyeNode ];
    Node.call( this, options );
  }

  reactantsProductsAndLeftovers.register( 'HideBox', HideBox );

  return inherit( Node, HideBox );
} );
