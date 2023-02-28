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

import merge from '../../../../phet-core/js/merge.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import Reaction from '../../common/model/Reaction.js';
import Substance from '../../common/model/Substance.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SandwichNode from '../view/SandwichNode.js';

// constants
// used when the product is undefined, this can be any non-visible node with well-defined bounds
const NO_SANDWICH_NODE = new Rectangle( 0, 0, 5, 5 );

export default class SandwichRecipe extends Reaction {

  /**
   * @param {TReadOnlyProperty.<string>} nameProperty
   * @param {number} breadCount
   * @param {number} meatCount
   * @param {number} cheeseCount
   * @param {Object} [options]
   */
  constructor( nameProperty, breadCount, meatCount, cheeseCount, options ) {

    assert && assert( breadCount >= 0 && meatCount >= 0 && cheeseCount >= 0 );

    options = merge( {
      coefficientsMutable: false // {boolean} can coefficients of the ingredients can be changed?
    }, options );

    // sandwich ingredients (symbols are internal for sandwiches, no i18n required)
    const ingredients = [];
    const bread = new Substance( breadCount, 'bread', SandwichNode.createBreadNode() );
    const meat = new Substance( meatCount, 'meat', SandwichNode.createMeatNode() );
    const cheese = new Substance( cheeseCount, 'cheese', SandwichNode.createCheeseNode() );
    if ( breadCount > 0 || options.coefficientsMutable ) { ingredients.push( bread ); }
    if ( meatCount > 0 || options.coefficientsMutable ) { ingredients.push( meat ); }
    if ( cheeseCount > 0 || options.coefficientsMutable ) { ingredients.push( cheese ); }

    // sandwich image will be updated below
    const sandwich = new Substance( 1, 'sandwich',
      options.coefficientsMutable ? NO_SANDWICH_NODE : new SandwichNode( breadCount, meatCount, cheeseCount ) );

    super( ingredients, [ sandwich ], { nameProperty: nameProperty } );

    if ( options.coefficientsMutable ) {

      // Update the sandwich image to match the coefficients.
      const updateSandwichNode = () => {
        if ( this.isReaction() ) {
          sandwich.iconProperty.set(
            new SandwichNode( bread.coefficientProperty.value, meat.coefficientProperty.value, cheese.coefficientProperty.value ) );
        }
        else {
          sandwich.iconProperty.set( NO_SANDWICH_NODE );
        }
      };

      ingredients.forEach( ingredient => {
        // unlink is unnecessary because these properties exist for the lifetime of the simulation
        ingredient.coefficientProperty.link( this.updateQuantities.bind( this ) );
        ingredient.coefficientProperty.link( updateSandwichNode );
      } );
    }
    else {
      assert && assert( this.isReaction() );
    }

    // @public (read-only)
    this.sandwich = sandwich;
    this.coefficientsMutable = options.coefficientsMutable;
  }
}

reactantsProductsAndLeftovers.register( 'SandwichRecipe', SandwichRecipe );