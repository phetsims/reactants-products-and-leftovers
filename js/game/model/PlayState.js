// Copyright 2014-2022, University of Colorado Boulder

/**
 * States during the 'play' phase of a game (GamePhase.PlayState), mutually exclusive.
 * For lack of better names, the state names correspond to the button that is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

const PlayState = EnumerationDeprecated.byKeys( [
  'FIRST_CHECK',  // 'Check' button is visible for the first time
  'TRY_AGAIN',    // 'Try Again' button is visible
  'SECOND_CHECK', // 'Check' button is visible for the second time
  'SHOW_ANSWER',  // 'Show Answer' button is visible
  'NEXT',         // 'Next' button is visible
  'NONE'          // use this value when game is not in the 'play' phase
] );

reactantsProductsAndLeftovers.register( 'PlayState', PlayState );

export default PlayState;