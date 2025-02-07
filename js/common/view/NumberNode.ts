// Copyright 2014-2023, University of Colorado Boulder

/**
 * Displays a dynamic numeric value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

type SelfOptions = {
  decimalPlaces?: number; // number of decimal places to be displayed
};

type NumberNodeOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<TextOptions, 'font' | 'tandem' | 'phetioVisiblePropertyInstrumented'>;

export default class NumberNode extends Text {

  private readonly disposeNumberNode: () => void;

  public constructor( numberProperty: TReadOnlyProperty<number>, providedOptions?: NumberNodeOptions ) {

    const options = optionize<NumberNodeOptions, SelfOptions, TextOptions>()( {

      // SelfOptions
      decimalPlaces: 0
    }, providedOptions );

    super( '' );

    const numberPropertyObserver = ( value: number ) => {
      this.string = Utils.toFixed( value, options.decimalPlaces );
    };
    numberProperty.link( numberPropertyObserver ); // must be unlinked in dispose

    this.mutate( options );

    this.disposeNumberNode = () => {
      if ( numberProperty.hasListener( numberPropertyObserver ) ) {
        numberProperty.unlink( numberPropertyObserver );
      }
    };

    //TODO https://github.com/phetsims/reactants-products-and-leftovers/issues/78 link to numberProperty
  }

  public override dispose(): void {
    this.disposeNumberNode();
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'NumberNode', NumberNode );