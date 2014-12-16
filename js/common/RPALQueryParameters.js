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

    // adds 'Test', 'Skip', 'Replay' buttons to the Game, shows challenge answers at the bottom of the Game screen
    DEV: !!getQueryParameter( 'dev' ) || false,

    // plays all reactions for each level of the game
    PLAY_ALL: !!getQueryParameter( 'playAll' ) || false,

    // shows the game reward, regardless of score
    REWARD: !!getQueryParameter( 'reward' ) || false,

    // shows challenge answers at the bottom of the Game screen
    CHEAT: !!getQueryParameter( 'cheat' ) || false,

    // enables console output related to instantiation and disposal of top-level objects
    MEMORY_DEBUG: !!getQueryParameter( 'memoryDebug' ) || false,

    //TODO remove this and related code in RPALScreenView when #18 is resolved
    // number of animation steps to wait before automatically switching reactions, to test for memory leaks. 0 disables this feature.
    LEAK_STEP: parseInt( getQueryParameter( 'leakStep' ), 10 ) || 0
  };

  return RPALQueryParameters;
} );
