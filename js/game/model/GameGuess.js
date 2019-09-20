// Copyright 2014-2019, University of Colorado Boulder

/**
 * A 'guess' is the user's answer to a game challenge, and it may or may not be correct.
 * We call it a 'guess' to distinguish the user's answer from the correct answer.
 * (And yes, 'guess' is semantically incorrect, since a guess is uninformed. Live with it :-)
 *
 * A guess is constructed based on a reaction and challenge type.
 * The guess will have the same number of reactants and products as the reaction,
 * and they are guaranteed to be in the same order.
 * Depending on the challenge type, values in the guess will be initialized to zero.
 *
 * A guess is correct if the reaction and guess have the same quantities of reactants,
 * products and leftovers.
 *
 * Run with the 'playAll' or 'playOne' query parameter to fill in the correct answer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BoxType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/BoxType' );
  const inherit = require( 'PHET_CORE/inherit' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  /**
   * @param {Reaction} reaction
   * @param {BoxType} interactiveBox which box is interactive
   * @constructor
   */
  function GameGuess( reaction, interactiveBox ) {

    assert && assert( interactiveBox === BoxType.BEFORE || interactiveBox === BoxType.AFTER );

    const self = this;

    // @public Clone reactants, quantities are initialized to zero for 'Before' challenges.
    this.reactants = [];
    reaction.reactants.forEach( function( reactant ) {
      self.reactants.push( ( interactiveBox === BoxType.BEFORE ) ? Substance.withQuantity( reactant, 0 ) : Substance.clone( reactant ) );
    } );

    // @public Clone products, quantities are initialized to zero for 'After' challenges.
    this.products = [];
    reaction.products.forEach( function( product ) {
      self.products.push( ( interactiveBox === BoxType.AFTER ) ? Substance.withQuantity( product, 0 ) : Substance.clone( product ) );
    } );

    // @public Clone leftovers, quantities are initialized to zero for 'After' challenges.
    this.leftovers = [];
    reaction.leftovers.forEach( function( leftover ) {
      self.leftovers.push( ( interactiveBox === BoxType.AFTER ) ? Substance.withQuantity( leftover, 0 ) : Substance.clone( leftover ) );
    } );

    assert && assert( this.reactants.length === reaction.reactants.length );
    assert && assert( this.products.length === reaction.products.length );
    assert && assert( this.leftovers.length === reaction.leftovers.length );
  }

  reactantsProductsAndLeftovers.register( 'GameGuess', GameGuess );

  return inherit( Object, GameGuess, {

    // @public
    reset: function() {
      this.reactants.forEach( function( reactant ) { reactant.reset(); } );
      this.products.forEach( function( product ) { product.reset(); } );
      this.leftovers.forEach( function( leftover ) { leftover.reset(); } );
    }
  } );
} );