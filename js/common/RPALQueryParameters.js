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
    EQUATION: getQueryParameter( 'equation' ) || 'top',

    // plays all challenges for each level of the game, to get 100% test coverage
    PLAY_ALL: getQueryParameter( 'playAll' ) || false,

    // shows the game reward regardless of score
    REWARD: getQueryParameter( 'reward' ) || false,

    /**
     * Molecules in game boxes are arranged in a grid. This controls how much the molecules are randomly offset from the center
     * of cells in the grid. Higher values make the layout look less grid-like, but result in more overlap of molecules (a trade-off).
     */
    RANDOM_OFFSET: parseInt( getQueryParameter( 'randomOffset' ), 10 ) || 8
  };

  return RPALQueryParameters;
} );
