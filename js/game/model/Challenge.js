// Copyright 2002-2014, University of Colorado Boulder

/**
 * A challenge consists of a reaction (with specific before and after quantities), the user's 'guess',
 * and a specification of which part of the reaction (before or after) the user needs to guess.
 * This is essentially a data structure that keeps all of these associated things together.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeVisibility = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeVisibility' );
  var GameGuess = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GameGuess' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Reaction} reaction
   * @param {ChallengeType} challengeType
   * @param {ChallengeVisibility} challengeVisibility
   * @constructor
   */
  function Challenge( reaction, challengeType, challengeVisibility ) {
    this.reaction = reaction;
    this.challengeType = challengeType;
    this.challengeVisibility = challengeVisibility;
    this.guess = new GameGuess( reaction, challengeType );
  }

  return inherit( Object, Challenge, {

    // Does the user's guess match the correct answer?
    isCorrect: function() {
      var i;
      // all reactants must be equal
      for ( i = 0; i < this.reaction.reactants.length; i++ ) {
        if ( !this.guess.reactants[i].equals( this.reaction.reactants[i] ) ) {
          return false;
        }
      }
      // all products must be equal
      for ( i = 0; i < this.reaction.products.length; i++ ) {
        if ( !this.guess.products[i].equals( this.reaction.products[i] ) ) {
          return false;
        }
      }
      return true;
    },

    // Example: 2H2 + 1O2 -> 2H2O  : 2,2 -> 2,0,1 : 3,2 -> 2,1,1 : AFTER
    toString: function() {
      return this.reaction.toString() + ' : ' + this.guess.toString() + ' : ' + this.challengeType;
    },

    isMoleculesVisible: function() {
      return ( this.challengeVisibility === ChallengeVisibility.NUMBERS || this.challengeVisibility === ChallengeVisibility.BOTH );
    },

    isNumbersVisible: function() {
      return ( this.challengeVisibility === ChallengeVisibility.MOLECULES || this.challengeVisibility === ChallengeVisibility.BOTH );
    }
  } );
} );