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

    // plays the first challenge in the pool repeatedly, with maximum quantities, for performance testing
    PLAY_ONE: !!getQueryParameter( 'playOne' ) || false,

    // shows the game reward, regardless of score
    REWARD: !!getQueryParameter( 'reward' ) || false,

    // shows challenge answers at the bottom of the Game screen
    CHEAT: !!getQueryParameter( 'cheat' ) || false,

    // enables console output related to instantiation and disposal of top-level objects
    MEMORY_DEBUG: !!getQueryParameter( 'memoryDebug' ) || false
  };

  assert && assert( !( RPALQueryParameters.PLAY_ALL && RPALQueryParameters.PLAY_ONE ), 'playAll and playOne are mutually exclusive' );

  return RPALQueryParameters;
} );
