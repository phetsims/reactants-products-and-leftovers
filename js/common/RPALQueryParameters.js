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

    // adds 'Test', 'Skip', 'Replay' buttons to Game, shows challenge answers at the bottom of the Game screen
    DEV: !!getQueryParameter( 'dev' ) || false,

    // plays all reactions for each level of the game
    PLAY_ALL: !!getQueryParameter( 'playAll' ) || false,

    // shows the game reward regardless of score
    REWARD: !!getQueryParameter( 'reward' ) || false,

    // shows challenge answers at the bottom of the Game screen
    CHEAT: !!getQueryParameter( 'cheat' ) || false,

    //TODO delete when #20 is closed
    RANDOM_OFFSET: parseInt( getQueryParameter( 'randomOffset' ), 10 ) || 8,

    //TODO delete when #22 is closed
    BUTTONS_OPACITY: parseFloat( getQueryParameter( 'buttonsOpacity' ), 10 ) || 0.75,

    //TODO delete when #22 is closed
    FACE_OPACITY: parseFloat( getQueryParameter( 'faceOpacity' ), 10 ) || 0.65
  };

  return RPALQueryParameters;
} );
