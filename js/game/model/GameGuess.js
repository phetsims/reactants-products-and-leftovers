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

  /**
   * @param {Reaction} reaction
   * @param {ChallengeType} challengeType
   * @constructor
   */
  function GameGuess( reaction, challengeType ) {

    // @private
    this.observer = function() {
      //TODO notify other observers that some aspect of the guess has changed
    };

    this.reaction = reaction;
    this.reactants = createGuessReactants( reaction.reactants, challengeType, this.observer );
    this.products = createGuessProducts( reaction.products, challengeType, this.observer );
  }

  /**
   * Creates reactants for the user's guess.
   * Clones the reactants in the same order that they appear in the challenge.
   * Depending on the challenge type, either quantities or leftovers are initialized to zero.
   * @param {[Reactant]} reactants the challenge's reactants
   * @param {ChallengeType} challengeType
   * @param {function} observer
   * @returns {[Reactants]}
   */
  var createGuessReactants = function( reactants, challengeType, observer ) {
    var guessReactants = [];
    for ( var i = 0; i < reactants.length; i++ ) {
      guessReactants.push( Reactant.clone( reactants[i] ) );
      if ( challengeType === ChallengeType.AFTER ) {
        guessReactants[i].leftovers = 0;
      }
      else {
        guessReactants[i].quantity = 0;
      }
      guessReactants[i].quantityProperty.link( observer );
      guessReactants[i].leftoversProperty.link( observer );
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
   * @param {function} observer
   * @returns {[Product]}
   */
  var createGuessProducts = function( products, challengeType, observer ) {
    var guessProducts = [];
    for ( var i = 0; i < products.length; i++ ) {
      guessProducts[i] = Product.clone( products[i] );
      if ( challengeType === ChallengeType.AFTER ) {
        guessProducts[i].quantity = 0;
      }
      guessProducts[i].quantityProperty.link( observer );
    }
    return guessProducts;
  };

  return inherit( Object, GameGuess, {

    //TODO identical to Reaction.getQuantitiesString
    /**
     * Example: 4,1 -> 1,2,2,0
     * @returns {string}
     */
    toString: function() {
      var s = '';
      var i = 0;
      // reactants
      for ( i = 0; i < this.reactants.length; i++ ) {
        if ( i !== 0 ) { s += ','; }
        s += this.reactants[i].quantity;
      }
      // arrow
      s += ' -> ';
      // products
      for ( i = 0; i < this.products.length; i++ ) {
        if ( i !== 0 ) { s += ','; }
        s += this.products[i].quantity;
      }
      // leftovers
      for ( i = 0; i < this.reactants.length; i++ ) {
        s += ',';
        s += this.reactants[i].leftovers;
      }
      return s;
    }
  } );
} );