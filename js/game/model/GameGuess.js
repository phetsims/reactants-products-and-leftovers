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
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );

  /**
   * @param {Reaction} reaction
   * @param {BoxType} interactiveBox which box is interactive
   * @constructor
   */
  function GameGuess( reaction, interactiveBox ) {

    // validate so we can use if-else in private methods
    assert && assert( interactiveBox === BoxType.BEFORE || interactiveBox === BoxType.AFTER );

    this.reactants = createGuessReactants( reaction.reactants, interactiveBox );
    assert && assert( this.reactants.length === reaction.reactants.length );

    this.products = createGuessProducts( reaction.products, interactiveBox );
    assert && assert( this.products.length === reaction.products.length );
  }

  /**
   * Creates reactants for the user's guess.
   * Clones the reactants in the same order that they appear in the challenge.
   * Depending on the challenge type, either quantities or leftovers are initialized to zero.
   * @param {[Reactant]} reactants the challenge's reactants
   * @param {BoxType} interactiveBox box is interactive
   * @returns {[Reactants]}
   */
  var createGuessReactants = function( reactants, interactiveBox ) {
    var guessReactants = [];
    var guessReactant;
    for ( var i = 0; i < reactants.length; i++ ) {
      if ( RPALQueryParameters.PLAY_ALL ) {
        guessReactant = Reactant.clone( reactants[i] );
      }
      else if ( interactiveBox === BoxType.BEFORE ) {
        guessReactant = Reactant.withQuantity( reactants[i], 0 );
      }
      else { // BoxType.AFTER
        guessReactant = Reactant.withLeftovers( reactants[i], 0 );
      }
      guessReactants.push( guessReactant );
    }
    return guessReactants;
  };

  /**
   * Creates products for the user's guess.
   * Clones the products in the same order that they appear in the challenge.
   * Quantities are initialized to zero for 'After' challenges.
   * @param {[Product]} products the challenge's products
   * @param {BoxType} interactiveBox which box is interactive
   * @returns {[Product]}
   */
  var createGuessProducts = function( products, interactiveBox ) {
    var guessProducts = [];
    var guessProduct;
    for ( var i = 0; i < products.length; i++ ) {
      if ( interactiveBox === BoxType.BEFORE || RPALQueryParameters.PLAY_ALL ) {
        guessProduct = Product.clone( products[i] );
      }
      else { // BoxType.AFTER
        guessProduct = Product.withQuantity( products[i], 0 );
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