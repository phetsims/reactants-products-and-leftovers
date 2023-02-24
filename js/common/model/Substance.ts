// Copyright 2014-2023, University of Colorado Boulder

/**
 * A substance is a participant in a chemical reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

export default class Substance {

  public readonly symbol: string;

  // substance's coefficient in the reaction equation, mutable to support 'Custom' sandwich
  public readonly coefficientProperty: Property<number>;

  // how much of the substance we have
  public readonly quantityProperty: Property<number>;

  // visual representation of the substance, mutable to support the 'Custom' sandwich
  public readonly iconProperty: Property<Node>;

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

    this.coefficientProperty = new NumberProperty( coefficient );
    this.quantityProperty = new NumberProperty( quantity );
    this.iconProperty = new Property( icon );
  }

  public reset(): void {
    this.coefficientProperty.reset();
    this.quantityProperty.reset();
    this.iconProperty.reset();
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
   * Creates a shallow copy of a substance. AXON.Property observers are not copied.
   */
  public static clone( substance: Substance ): Substance {
    return new Substance( substance.coefficientProperty.value, substance.symbol, substance.iconProperty.value, substance.quantityProperty.value );
  }

  /**
   * Creates a shallow copy of a substance with a specified quantity. AXON.Property observers are not copied.
   */
  public static withQuantity( substance: Substance, quantity: number ): Substance {
    return new Substance( substance.coefficientProperty.value, substance.symbol, substance.iconProperty.value, quantity );
  }
}

reactantsProductsAndLeftovers.register( 'Substance', Substance );