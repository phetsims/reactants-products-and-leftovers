// Copyright 2014-2015, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );

  // constants
  var DARK_BLUE = new Color( 51, 118, 196 );

  var RPALColors = {
    SCREEN_BACKGROUND: 'rgb(218,236,255)',
    PANEL_FILL: DARK_BLUE,
    BOX_STROKE: DARK_BLUE.withAlpha( 0.3 ),
    BOX_FILL: 'white',
    GAME_BUTTON: 'yellow'
  };

  return RPALColors;
} );