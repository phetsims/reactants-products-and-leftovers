// Copyright 2014-2015, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  var RPALQueryParameters = QueryStringMachine.getAll( {

    // shows  answers at the bottom of the Game screen, and adds 'Test', 'Skip', 'Replay' buttons
    showAnswers: { type: 'flag' },

    // plays all reactions for each level of the game
    playAll: { type: 'flag' }
  } );

  reactantsProductsAndLeftovers.register( 'RPALQueryParameters', RPALQueryParameters );

  return RPALQueryParameters;
} );
