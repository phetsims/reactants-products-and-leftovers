// Copyright 2002-2014, University of Colorado Boulder

/**
 * States during the 'play' phase of a game, mutually exclusive. (See GamePhase.)
 * For lack of better names, the state names correspond to the button that is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // enum values: use {} for production, use strings for debugging
  var PlayState = {
    FIRST_CHECK: assert ? 'FIRST_CHECK' : {}, // 'Check' button is visible for the first time
    TRY_AGAIN: assert ? 'TRY_AGAIN' : {}, // 'Try Again' button is visible
    SECOND_CHECK: assert ? 'SECOND_CHECK' : {}, // 'Check' button is visible for the second time
    SHOW_ANSWER: assert ? 'SHOW_ANSWER' : {}, // 'Show Answer' button is visible
    NEXT: assert ? 'NEXT' : {}, // 'Next' button is visible
    NONE: assert ? 'NONE' : {} // use this value when game is not in the 'play' phase
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( PlayState ); }

  return PlayState;
} );

