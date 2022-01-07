// Copyright 2014-2022, University of Colorado Boulder

/**
 * Phases of a game, mutually exclusive
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

const GamePhase = EnumerationDeprecated.byKeys( [
  'SETTINGS', // user is choosing game settings (level, timer, ...)
  'PLAY',     // user is playing the game
  'RESULTS'   // user is viewing results at end of a game
] );

reactantsProductsAndLeftovers.register( 'GamePhase', GamePhase );

export default GamePhase;