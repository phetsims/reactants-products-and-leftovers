// Copyright 2002-2014, University of Colorado Boulder

/**
 * Phases of a game, mutually exclusive
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // enum values: use {} for production, use strings for debugging
  var GamePhase = {
    SETTINGS: assert ? 'SETTINGS' : {}, // user is choosing game settings
    PLAY: assert ? 'PLAY' : {}, // user is playing the game
    RESULTS: assert ? 'RESULTS': {} // user is viewing results at end of a game
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( GamePhase ); }

  return GamePhase;
} );

