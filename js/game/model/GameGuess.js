// Copyright 2002-2014, University of Colorado Boulder

/**
 * A 'guess' is the user's answer to a game challenge, and it may or may not be correct.
 * We call it a 'guess' to distinguish the user's answer from the correct answer.
 * (And yes, 'guess' is semantically incorrect, since a guess is uninformed. Live with it.)
 * <p>
 * A guess is correct if all of the reactants and products in the guess are equal to
 * the reactants and products in the reaction (the correct answer), as defined by method equals.
 * <p>
 * A guess is constructed based on a reaction and challenge type.
 * The guess will have the same number of reactants and products as the reaction,
 * and they are guaranteed to be in the same order.
 * Depending on the challenge type, values in the guess will be initialized to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );

  /**
   * @param {Reaction} reaction
   * @param {ChallengeType} challengeType
   * @constructor
   */
  function GameGuess( reaction, challengeType ) {
    assert && assert( challengeType === ChallengeType.BEFORE || challengeType === ChallengeType.AFTER );
    this.reactants = createGuessReactants( reaction.reactants, challengeType );
    this.products = createGuessProducts( reaction.products, challengeType );
  }

  /**
   * Creates reactants for the user's guess.
   * Clones the reactants in the same order that they appear in the challenge.
   * Depending on the challenge type, either quantities or leftovers are initialized to zero.
   * @param {[Reactant]} reactants the challenge's reactants
   * @param {ChallengeType} challengeType
   * @returns {[Reactants]}
   */
  var createGuessReactants = function( reactants, challengeType ) {
    var guessReactants = [];
    var guessReactant;
    for ( var i = 0; i < reactants.length; i++ ) {
      if ( challengeType === ChallengeType.BEFORE ) {
        guessReactant = Reactant.cloneWithQuantity( reactants[i], 0 );
      }
      else {
        guessReactant = Reactant.cloneWithLeftovers( reactants[i], 0 );
      }
      guessReactants.push( guessReactant );
    }
    assert && assert( guessReactants.length === reactants.length );
    return guessReactants;
  };

  /**
   * Creates products for the user's guess.
   * Clones the products in the same order that they appear in the challenge.
   * Quantities are initialized to zero for 'After' challenges.
   * @param {[Product]} products the challenge's products
   * @param {ChallengeType} challengeType
   * @returns {[Product]}
   */
  var createGuessProducts = function( products, challengeType ) {
    var guessProducts = [];
    var guessProduct;
    for ( var i = 0; i < products.length; i++ ) {
      if ( challengeType === ChallengeType.BEFORE  ) {
        guessProduct = Product.clone( products[i] )
      }
      else {
        guessProduct = Product.cloneWithQuantity( products[i], 0 );
      }
      guessProducts.push( guessProduct );
    }
    return guessProducts;
  };

  return inherit( Object, GameGuess, {

    reset: function() {
      this.reactants.forEach( function( reactant ) { reactant.reset(); } );
      this.products.forEach( function( product ) { product.reset(); } );
    }
  } );
} );