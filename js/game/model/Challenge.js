// Copyright 2014-2019, University of Colorado Boulder

/**
 * A challenge consists of a reaction (with specific before and after quantities), the user's 'guess',
 * and a specification of which part of the reaction (before or after) the user needs to guess.
 * This is essentially a data structure that keeps all of these associated things together.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const GameGuess = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GameGuess' );
  const merge = require( 'PHET_CORE/merge' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  class Challenge {

    /**
     * @param {Reaction} reaction
     * @param {BoxType} interactiveBox which box (Before or After) needs to be guessed
     * @param {Object} [options]
     */
    constructor( reaction, interactiveBox, options ) {

      options = merge( {
        moleculesVisible: true, // {boolean} are molecules visible when playing the challenge?
        numbersVisible: true // {boolean} are numbers visible when playing the challenge?
      }, options );

      // @public
      this.reaction = reaction;
      this.interactiveBox = interactiveBox;
      this.moleculesVisible = options.moleculesVisible;
      this.numbersVisible = options.numbersVisible;
      this.guess = new GameGuess( reaction, interactiveBox );
      this.points = 0;  // points awarded for this challenge
    }

    // @public Resets this challenge to its initial state.
    reset() {
      this.guess.reset();
      this.points = 0;
    }

    // @public Does the user's guess match the correct answer?
    isCorrect() {
      let i;
      let correct = true;
      // all reactants must be equal
      for ( i = 0; correct && i < this.reaction.reactants.length; i++ ) {
        correct = this.guess.reactants[ i ].equals( this.reaction.reactants[ i ] );
      }
      // all products must be equal
      for ( i = 0; correct && i < this.reaction.products.length; i++ ) {
        correct = this.guess.products[ i ].equals( this.reaction.products[ i ] );
      }
      // all leftovers must be equal
      for ( i = 0; correct && i < this.reaction.leftovers.length; i++ ) {
        correct = this.guess.leftovers[ i ].equals( this.reaction.leftovers[ i ] );
      }
      return correct;
    }

    // @public Reveals the correct answer by copying the reaction quantities to the guess.
    showAnswer() {
      let i;
      for ( i = 0; i < this.guess.reactants.length; i++ ) {
        this.guess.reactants[ i ].quantityProperty.set( this.reaction.reactants[ i ].quantityProperty.get() );
      }
      for ( i = 0; i < this.guess.products.length; i++ ) {
        this.guess.products[ i ].quantityProperty.set( this.reaction.products[ i ].quantityProperty.get() );
      }
      for ( i = 0; i < this.guess.leftovers.length; i++ ) {
        this.guess.leftovers[ i ].quantityProperty.set( this.reaction.leftovers[ i ].quantityProperty.get() );
      }
    }
  }

  return reactantsProductsAndLeftovers.register( 'Challenge', Challenge );
} );