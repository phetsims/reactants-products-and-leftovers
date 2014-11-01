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
  var GameGuess = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GameGuess' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Reaction} reaction
   * @param {ChallengeType} challengeType
   * @param {Object} [options]
   * @constructor
   */
  function Challenge( reaction, challengeType, options ) {

    options = _.extend( {
      moleculesVisible: true, // {boolean} are molecules visible when playing the challenge?
      numbersVisible: true // {boolean} are numbers visible when playing the challenge?
    }, options );

    this.reaction = reaction;
    this.challengeType = challengeType;
    this.moleculesVisible = options.moleculesVisible;
    this.numbersVisible = options.numbersVisible;
    this.guess = new GameGuess( reaction, challengeType );
  }

  return inherit( Object, Challenge, {

    reset: function() {
      this.reaction.reset();
      this.guess.reset();
    },

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

    // Example: 2H2 + 1O2 -> 2H2O : 2,2 -> 2,0,1 : 3,2 -> 2,1,1 : AFTER
    toString: function() {
      return this.reaction.toString() + ' : ' + this.guess.toString() + ' : ' + this.challengeType;
    }
  } );
} );