// Copyright 2014-2015, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  var getQueryParameter = phet.chipper.getQueryParameter;

  var RPALQueryParameters = {

    // adds 'Test', 'Skip', 'Replay' buttons to the Game, shows challenge answers at the bottom of the Game screen
    DEV:           !!getQueryParameter( 'dev' ) || false,

    // plays all reactions for each level of the game
    PLAY_ALL:      !!getQueryParameter( 'playAll' ) || false,

    // initializes game spinners to the correct answer
    GUESS_CORRECT: !!getQueryParameter( 'guessCorrect' ) || false,

    // shows the game reward, regardless of score
    SHOW_REWARD:   !!getQueryParameter( 'showReward' ) || false
  };

  reactantsProductsAndLeftovers.register( 'RPALQueryParameters', RPALQueryParameters );

  return RPALQueryParameters;
} );
