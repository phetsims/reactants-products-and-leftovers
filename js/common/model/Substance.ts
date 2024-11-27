// Copyright 2014-2024, University of Colorado Boulder

/**
 * A substance is a participant in a chemical reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { Node } from '../../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

export default class Substance {

  public readonly symbol: string;

  // substance's coefficient in the reaction equation, mutable to support 'Custom' sandwich
  public readonly coefficientProperty: Property<number>;

  // how much of the substance we have
  public readonly quantityProperty: Property<number>;

  // visual representation of the substance, mutable to support the 'Custom' sandwich
  public readonly iconProperty: Property<Node>;

  //TODO https://github.com/phetsims/reactants-products-and-leftovers/issues/78 Substances should have a tandem, and this should be unnecessary
  public readonly tandemName: string;

  /**
   * @param coefficient - substance's coefficient in the reaction equation
   * @param symbol - used in reaction equation
   * @param icon - visual representation of the substance
   * @param [quantity] - how much of a substance we have, defaults to zero
   */
  public constructor( coefficient: number, symbol: string, icon: Node, quantity = 0 ) {

    assert && assert( coefficient >= 0 );
    assert && assert( quantity >= 0 );

    this.symbol = symbol;

    this.coefficientProperty = new NumberProperty( coefficient, {
      numberType: 'Integer'
    } );

    this.quantityProperty = new NumberProperty( quantity, {
      numberType: 'Integer'
    } );

    this.iconProperty = new Property( icon );

    // The tandem name is the symbol with HTML tags removed. Examples:
    // 'cheese' => 'cheese'
    // 'H<sub>2</sub>O' => H2O
    this.tandemName = symbol.replace( /(<([^>]+)>)/ig, '' );
    assert && assert( this.tandemName.length > 0 );
  }

  public reset(): void {
    this.coefficientProperty.reset();
    this.quantityProperty.reset();
    this.iconProperty.reset();
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  /*
   * Are 2 substances the same? AXON.Property observers are not considered.
   */
  public equals( substance: Substance ): boolean {
    return ( this.symbol === substance.symbol &&
             this.coefficientProperty.value === substance.coefficientProperty.value &&
             this.iconProperty.value === substance.iconProperty.value &&
             this.quantityProperty.value === substance.quantityProperty.value );
  }

  /**
   * Creates a shallow copy of this Substance. AXON.Property observers are not copied.
   * @param quantity - optional quantity, to override this.quantityProperty.value
   */
  public clone( quantity?: number ): Substance {
    return new Substance( this.coefficientProperty.value, this.symbol, this.iconProperty.value,
      ( quantity === undefined ) ? this.quantityProperty.value : 0 );
  }
}

reactantsProductsAndLeftovers.register( 'Substance', Substance );