// Copyright 2014-2015, University of Colorado Boulder

/**
 * Phases of a game, mutually exclusive
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  var GamePhase = {
    SETTINGS: 'SETTINGS', // user is choosing game settings (level, timer, ...)
    PLAY: 'PLAY', // user is playing the game
    RESULTS: 'RESULTS' // user is viewing results at end of a game
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( GamePhase ); }

  reactantsProductsAndLeftovers.register( 'GamePhase', GamePhase );

  return GamePhase;
} );

