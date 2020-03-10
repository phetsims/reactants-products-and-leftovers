// Copyright 2014-2020, University of Colorado Boulder

/**
 * Phases of a game, mutually exclusive
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

const GamePhase = Enumeration.byKeys( [
  'SETTINGS', // user is choosing game settings (level, timer, ...)
  'PLAY',     // user is playing the game
  'RESULTS'   // user is viewing results at end of a game
] );

reactantsProductsAndLeftovers.register( 'GamePhase', GamePhase );

export default GamePhase;