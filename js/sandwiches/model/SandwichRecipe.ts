// Copyright 2014-2023, University of Colorado Boulder

/**
 * Recipe for a sandwich.
 *
 * For the purposes of the 'sandwiches' analogy:
 * - sandwich recipe == reaction
 * - ingredients == reactants
 * - sandwich == product
 *
 * A 'custom' sandwich has mutable reactant coefficients, and the sandwich image changes based on those coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import Reaction, { ReactionOptions } from '../../common/model/Reaction.js';
import Substance from '../../common/model/Substance.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SandwichNode from '../view/SandwichNode.js';

// Used when the product is undefined. This can be any non-visible node with well-defined bounds
const NO_SANDWICH_NODE = new Rectangle( 0, 0, 5, 5 );

type SelfOptions = {
  coefficientsMutable?: boolean; // Can coefficients of the ingredients can be changed?
};

type SandwichRecipeOptions = SelfOptions;

export default class SandwichRecipe extends Reaction {

  public readonly sandwich: Substance;
  public readonly coefficientsMutable: boolean;

  public constructor( nameProperty: TReadOnlyProperty<string>,
                      breadCount: number, meatCount: number, cheeseCount: number,
                      providedOptions?: SandwichRecipeOptions ) {

    assert && assert( Number.isInteger( breadCount ) && Number.isInteger( meatCount ) && Number.isInteger( cheeseCount ) );
    assert && assert( breadCount >= 0 && meatCount >= 0 && cheeseCount >= 0 );

    const options = optionize<SandwichRecipeOptions, SelfOptions, ReactionOptions>()( {

      // SelfOptions
      coefficientsMutable: false
    }, providedOptions );

    // Reactants: ingredients (symbols are internal, no i18n required)
    const ingredients = [];
    const bread = new Substance( breadCount, 'bread', SandwichNode.createBreadIcon() );
    const meat = new Substance( meatCount, 'meat', SandwichNode.createMeatIcon() );
    const cheese = new Substance( cheeseCount, 'cheese', SandwichNode.createCheeseIcon() );
    if ( breadCount > 0 || options.coefficientsMutable ) { ingredients.push( bread ); }
    if ( meatCount > 0 || options.coefficientsMutable ) { ingredients.push( meat ); }
    if ( cheeseCount > 0 || options.coefficientsMutable ) { ingredients.push( cheese ); }

    // Product: sandwich
    const sandwich = new Substance( 1, 'sandwich',
      options.coefficientsMutable ? NO_SANDWICH_NODE : new SandwichNode( breadCount, meatCount, cheeseCount ) );

    super( ingredients, [ sandwich ], { nameProperty: nameProperty } );

    if ( options.coefficientsMutable ) {

      // Update the sandwich image to match the coefficients.
      const updateSandwichNode = () => {
        if ( this.isReaction() ) {
          sandwich.iconProperty.value =
            new SandwichNode( bread.coefficientProperty.value, meat.coefficientProperty.value, cheese.coefficientProperty.value );
        }
        else {
          sandwich.iconProperty.value = NO_SANDWICH_NODE;
        }
      };

      ingredients.forEach( ingredient => ingredient.coefficientProperty.link( updateSandwichNode ) );
    }
    else {
      assert && assert( this.isReaction() );
    }

    this.sandwich = sandwich;
    this.coefficientsMutable = options.coefficientsMutable;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'SandwichRecipe', SandwichRecipe );