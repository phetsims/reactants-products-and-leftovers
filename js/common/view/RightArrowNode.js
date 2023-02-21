// Copyright 2014-2020, University of Colorado Boulder

/**
 * An arrow that points from left to right, used in equations to point from reactants to products.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

export default class RightArrowNode extends ArrowNode {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      length: 70,
      tailWidth: 15,
      headWidth: 35,
      headHeight: 30
    }, options );

    super( 0, 0, options.length, 0, options );
  }
}

reactantsProductsAndLeftovers.register( 'RightArrowNode', RightArrowNode );