// Copyright 2002-2014, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Range = require( 'DOT/Range' );

  return {
    SCREEN_VIEW_OPTIONS: { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 768, 504 ) },
    QUANTITY_RANGE: new Range( 0, 8 ),
    RESET_ALL_BUTTON_SCALE: 0.75
  };
} );
