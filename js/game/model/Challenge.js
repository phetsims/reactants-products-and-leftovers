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
   * @param {BoxType} interactiveBox which box (Before or After) needs to be guessed
   * @param {Object} [options]
   * @constructor
   */
  function Challenge( reaction, interactiveBox, options ) {

    options = _.extend( {
      moleculesVisible: true, // {boolean} are molecules visible when playing the challenge?
      numbersVisible: true // {boolean} are numbers visible when playing the challenge?
    }, options );

    this.reaction = reaction;
    this.interactiveBox = interactiveBox;
    this.moleculesVisible = options.moleculesVisible;
    this.numbersVisible = options.numbersVisible;
    this.guess = new GameGuess( reaction, interactiveBox );
  }

  return inherit( Object, Challenge, {

    reset: function() {
      this.guess.reset();
    },

    // Does the user's guess match the correct answer?
    isCorrect: function() {
      var i;
      var correct = true;
      // all reactants must be equal
      for ( i = 0; correct && i < this.reaction.reactants.length; i++ ) {
        correct = this.guess.reactants[i].equals( this.reaction.reactants[i] );
      }
      // all products must be equal
      for ( i = 0; correct && i < this.reaction.products.length; i++ ) {
        correct = this.guess.products[i].equals( this.reaction.products[i] );
      }
      // all leftovers must be equal
      for ( i = 0; correct && i < this.reaction.leftovers.length; i++ ) {
        correct = this.guess.leftovers[i].equals( this.reaction.leftovers[i] );
      }
      return correct;
    },

    // Reveals the correct answer by copying the reaction quantities to the guess.
    showAnswer: function() {
      var i;
      for ( i = 0; i < this.guess.reactants.length; i++ ) {
        this.guess.reactants[i].quantity = this.reaction.reactants[i].quantity;
      }
      for ( i = 0; i < this.guess.products.length; i++ ) {
        this.guess.products[i].quantity = this.reaction.products[i].quantity;
      }
      for ( i = 0; i < this.guess.leftovers.length; i++ ) {
        this.guess.leftovers[i].quantity = this.reaction.leftovers[i].quantity;
      }
    }
  } );
} );