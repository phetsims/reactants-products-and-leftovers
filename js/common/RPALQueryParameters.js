// Copyright 2002-2014, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  var getQueryParameter = window.phetcommon.getQueryParameter;

  var RPALQueryParameters = {

    // enables developer-only features
    DEV: getQueryParameter( 'dev' ) || false,

    // puts the equation at the 'top' or 'bottom' of the screen
    EQUATION: getQueryParameter( 'equation' ) || 'bottom',

    // plays all challenges for each level of the game, to get 100% test coverage
    PLAY_ALL: getQueryParameter( 'playAll' ) || false,

    // shows the game reward regardless of score
    REWARD: getQueryParameter( 'reward' ) || false,

    // enables console output for debugging, particularly useful for the Game screen
    CONSOLE: getQueryParameter( 'console' ) || false,

    // runs a sanity test on challenge generation at startup, output goes to console
    TEST_GAME: getQueryParameter( 'testGame' ) || false
  };

  return RPALQueryParameters;
} );
