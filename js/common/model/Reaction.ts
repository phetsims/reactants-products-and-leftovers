// Copyright 2014-2023, University of Colorado Boulder

/**
 * A chemical reaction is a process that leads to the transformation of one set of
 * chemical substances (reactants) to another (products).
 * The reactants that do not transform to products are referred to herein as leftovers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import DevStringUtils from '../../dev/DevStringUtils.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import Substance from './Substance.js';

type SelfOptions = {
  nameProperty?: TReadOnlyProperty<string> | null; // optional name for the Reaction, displayed to the user
};

export type ReactionOptions = SelfOptions;

export default class Reaction {

  public readonly nameProperty: TReadOnlyProperty<string> | null;
  public readonly reactants: Substance[];
  public readonly products: Substance[];
  public readonly leftovers: Substance[]; // a leftover for each reactant, in the same order as reactants

  public constructor( reactants: Substance[], products: Substance[], providedOptions?: ReactionOptions ) {

    assert && assert( reactants.length > 1, 'a reaction requires at least 2 reactants' );
    assert && assert( products.length > 0, 'a reaction requires at least 1 product' );

    const options = optionize<ReactionOptions, SelfOptions>()( {
      nameProperty: null
    }, providedOptions );

    this.reactants = reactants;
    this.products = products;
    this.nameProperty = options.nameProperty;

    // Create a leftover for each reactant, in the same order.
    this.leftovers = [];
    this.reactants.forEach( reactant => {
      this.leftovers.push( new Substance( 1, reactant.symbol, reactant.iconProperty.value, 0 ) );
    } );

    //TODO https://github.com/phetsims/reactants-products-and-leftovers/issues/82 dispose needed?
    const quantityListener = this.updateQuantities.bind( this );
    this.reactants.forEach( reactant => reactant.quantityProperty.link( quantityListener ) );
  }

  public reset(): void {
    this.reactants.forEach( reactant => reactant.reset() );
    this.products.forEach( product => product.reset() );
    this.leftovers.forEach( leftover => leftover.reset() );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public toString(): string {
    return DevStringUtils.equationString( this );
  }

  /**
   * Formula is a reaction if more than one coefficient is non-zero, or if any coefficient is > 1.
   */
  public isReaction(): boolean {
    let greaterThanZero = 0;
    let greaterThanOne = 0;
    this.reactants.forEach( reactant => {
      if ( reactant.coefficientProperty.value > 0 ) { greaterThanZero++; }
      if ( reactant.coefficientProperty.value > 1 ) { greaterThanOne++; }
    } );
    return ( greaterThanZero > 1 || greaterThanOne > 0 );
  }

  /*
   * Updates the quantities of products and leftovers.
   */
  protected updateQuantities(): void {
    const numberOfReactions = this.getNumberOfReactions();
    this.products.forEach( product => {
      product.quantityProperty.value = numberOfReactions * product.coefficientProperty.value;
    } );
    // reactants and leftovers array have identical orders
    for ( let i = 0; i < this.reactants.length; i++ ) {
      this.leftovers[ i ].quantityProperty.value =
        this.reactants[ i ].quantityProperty.value - ( numberOfReactions * this.reactants[ i ].coefficientProperty.value );
    }
  }

  /**
   * Gets the number of reactions we have, based on the coefficients and reactant quantities.
   * For each reactant, we divide its quantity by its coefficient.
   * The smallest such value determines the number of reactions N that will occur.
   */
  private getNumberOfReactions(): number {
    let numberOfReactions = 0;
    if ( this.isReaction() ) {
      const possibleValues: number[] = [];
      this.reactants.forEach( reactant => {
        if ( reactant.coefficientProperty.value !== 0 ) {
          possibleValues.push( Math.floor( reactant.quantityProperty.value / reactant.coefficientProperty.value ) );
        }
      } );
      assert && assert( possibleValues.length > 0 );
      possibleValues.sort();
      numberOfReactions = possibleValues[ 0 ];
    }
    return numberOfReactions;
  }
}

reactantsProductsAndLeftovers.register( 'Reaction', Reaction );