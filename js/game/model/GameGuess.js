// Copyright 2002-2014, University of Colorado Boulder

/**
 * A 'guess' is the user's answer to a game challenge, and it may or may not be correct.
 * We call it a 'guess' to distinguish the user's answer from the correct answer.
 * (And yes, 'guess' is semantically incorrect, since a guess is uninformed. Live with it :-)
 * <p>
 * A guess is constructed based on a reaction and challenge type.
 * The guess will have the same number of reactants and products as the reaction,
 * and they are guaranteed to be in the same order.
 * Depending on the challenge type, values in the guess will be initialized to zero.
 * <p>
 * A guess is correct if the reaction and guess have the same quantities of reactants,
 * products and leftovers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BoxType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/BoxType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  /**
   * @param {Reaction} reaction
   * @param {BoxType} interactiveBox which box is interactive
   * @constructor
   */
  function GameGuess( reaction, interactiveBox ) {

    // validate so we can use if-else in private methods
    assert && assert( interactiveBox === BoxType.BEFORE || interactiveBox === BoxType.AFTER );

    // all of these are of type {[Substance]}
    this.reactants = createGuessReactants( reaction.reactants, interactiveBox );
    this.products = createGuessProducts( reaction.products, interactiveBox );
    this.leftovers = createGuessLeftovers( reaction.leftovers, interactiveBox );

    assert && assert( this.reactants.length === reaction.reactants.length );
    assert && assert( this.products.length === reaction.products.length );
    assert && assert( this.leftovers.length === reaction.leftovers.length );
  }

  /**
   * Creates reactants for the user's guess.
   * Clones the reactants in the same order that they appear in the challenge.
   * Quantities are initialized to zero for 'Before' challenges.
   * @param {[Substance]} reactants the challenge's reactants
   * @param {BoxType} interactiveBox box is interactive
   * @returns {[Substance]}
   */
  var createGuessReactants = function( reactants, interactiveBox ) {
    var guessReactants = [];
    var guessReactant;
    for ( var i = 0; i < reactants.length; i++ ) {
      if ( interactiveBox === BoxType.AFTER || RPALQueryParameters.PLAY_ALL ) {
        guessReactant = Substance.clone( reactants[i] );
      }
      else {
        guessReactant = Substance.withQuantity( reactants[i], 0 );
      }
      guessReactants.push( guessReactant );
    }
    return guessReactants;
  };

  /**
   * Creates products for the user's guess.
   * Clones the products in the same order that they appear in the challenge.
   * Quantities are initialized to zero for 'After' challenges.
   * @param {[Substance]} products the challenge's products
   * @param {BoxType} interactiveBox which box is interactive
   * @returns {[Substance]}
   */
  var createGuessProducts = function( products, interactiveBox ) {
    var guessProducts = [];
    var guessProduct;
    for ( var i = 0; i < products.length; i++ ) {
      if ( interactiveBox === BoxType.BEFORE || RPALQueryParameters.PLAY_ALL ) {
        guessProduct = Substance.clone( products[i] );
      }
      else {
        guessProduct = Substance.withQuantity( products[i], 0 );
      }
      guessProducts.push( guessProduct );
    }
    return guessProducts;
  };

  /**
   * Creates leftovers for the user's guess.
   * Clones the leftovers in the same order that they appear in the challenge.
   * Quantities are initialized to zero for 'After' challenges.
   * @param {[Substance]} leftovers the challenge's leftovers
   * @param {BoxType} interactiveBox which box is interactive
   * @returns {[Substance]}
   */
  var createGuessLeftovers = function( leftovers, interactiveBox ) {
    var guessLeftovers = [];
    var guessLeftover;
    for ( var i = 0; i < leftovers.length; i++ ) {
      if ( interactiveBox === BoxType.BEFORE || RPALQueryParameters.PLAY_ALL ) {
        guessLeftover = Substance.clone( leftovers[i] );
      }
      else {
        guessLeftover = Substance.withQuantity( leftovers[i], 0 );
      }
      guessLeftovers.push( guessLeftover );
    }
    return guessLeftovers;
  };

  return inherit( Object, GameGuess, {

    reset: function() {
      this.reactants.forEach( function( reactant ) { reactant.reset(); } );
      this.products.forEach( function( product ) { product.reset(); } );
      this.leftovers.forEach( function( leftover ) { leftover.reset(); } );
    }
  } );
} );