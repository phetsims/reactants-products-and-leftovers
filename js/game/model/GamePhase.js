// Copyright 2014-2019, University of Colorado Boulder

/**
 * Phases of a game, mutually exclusive
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

const GamePhase = {
  SETTINGS: 'SETTINGS', // user is choosing game settings (level, timer, ...)
  PLAY: 'PLAY', // user is playing the game
  RESULTS: 'RESULTS' // user is viewing results at end of a game
};

// verify that enum is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( GamePhase ); }

reactantsProductsAndLeftovers.register( 'GamePhase', GamePhase );

export default GamePhase;