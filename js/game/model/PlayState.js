// Copyright 2014-2015, University of Colorado Boulder

/**
 * States during the 'play' phase of a game (GamePhase.PlayState), mutually exclusive.
 * For lack of better names, the state names correspond to the button that is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  var PlayState = {
    FIRST_CHECK: 'FIRST_CHECK', // 'Check' button is visible for the first time
    TRY_AGAIN: 'TRY_AGAIN', // 'Try Again' button is visible
    SECOND_CHECK: 'SECOND_CHECK', // 'Check' button is visible for the second time
    SHOW_ANSWER: 'SHOW_ANSWER', // 'Show Answer' button is visible
    NEXT: 'NEXT', // 'Next' button is visible
    NONE: 'NONE' // use this value when game is not in the 'play' phase
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( PlayState ); }

  reactantsProductsAndLeftovers.register( 'PlayState', PlayState );

  return PlayState;
} );

