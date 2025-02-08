// Copyright 2014-2025, University of Colorado Boulder

/**
 * An arrow that points from left to right, used in equations to point from reactants to products.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

type SelfOptions = {
  length?: number;
};

export type RightArrowNodeOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<ArrowNodeOptions, 'fill' | 'stroke' | 'scale' | 'tandem'>;

export default class RightArrowNode extends ArrowNode {

  public constructor( providedOptions?: RightArrowNodeOptions ) {

    const options = optionize<RightArrowNodeOptions, SelfOptions, ArrowNodeOptions>()( {

      // SelfOptions
      length: 70,

      // ArrowNodeOptions
      tailWidth: 15,
      headWidth: 35,
      headHeight: 30,
      isDisposable: false
    }, providedOptions );

    super( 0, 0, options.length, 0, options );
  }
}

reactantsProductsAndLeftovers.register( 'RightArrowNode', RightArrowNode );