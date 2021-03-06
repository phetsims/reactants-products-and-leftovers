// Copyright 2014-2020, University of Colorado Boulder

/**
 * Box that is placed over things that are 'hidden' while playing a challenge.
 * Has a dashed border and a 'closed eye' icon in the center of the box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

class HideBox extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

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
    super( options );
  }
}

reactantsProductsAndLeftovers.register( 'HideBox', HideBox );
export default HideBox;