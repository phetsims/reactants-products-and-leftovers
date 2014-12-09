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
    DEV: getQueryParameter( 'dev' ) || false,

    // plays all reactions for each level of the game
    PLAY_ALL: getQueryParameter( 'playAll' ) || false,

    // shows the game reward regardless of score
    REWARD: getQueryParameter( 'reward' ) || false,

    // shows challenge answers at the bottom of the Game screen
    CHEAT: getQueryParameter( 'cheat' ) || false,

    /**
     * Molecules in game boxes are arranged in a grid. This controls how much the molecules are randomly offset from the center
     * of cells in the grid. Higher values make the layout look less grid-like, but result in more overlap of molecules (a trade-off).
     */
    RANDOM_OFFSET: parseInt( getQueryParameter( 'randomOffset' ), 10 ) || 8,

    //TODO delete when #22 is closed
    // opacity of buttons in Game, 0 (invisible) to 1 (opaque)
    BUTTONS_OPACITY: parseFloat( getQueryParameter( 'buttonsOpacity' ), 10 ) || 0.75,

    //TODO delete when #22 is closed
    // opacity of face in Game, 0 (invisible) to 1 (opaque)
    FACE_OPACITY: parseFloat( getQueryParameter( 'faceOpacity' ), 10 ) || 0.65
  };

  return RPALQueryParameters;
} );
