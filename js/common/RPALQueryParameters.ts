// Copyright 2014-2025, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import getGameLevelsSchema from '../../../vegas/js/getGameLevelsSchema.js';

const RPALQueryParameters = QueryStringMachine.getAll( {

  // The levels to show in the Game screen.
  gameLevels: getGameLevelsSchema( 3 ),

  // Plays all reactions for each level of the game.
  // For internal use only.
  playAll: { type: 'flag' },

  // Show the game reward regardless of score.
  // For internal use only.
  showReward: { type: 'flag' }
} );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `RPALQueryParameters: ${JSON.stringify( RPALQueryParameters, null, 2 )}` );

export default RPALQueryParameters;
