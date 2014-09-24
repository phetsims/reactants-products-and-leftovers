// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Reactants, Products and Leftovers' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GameScreen = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/GameScreen' );
  var MoleculesScreen = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/MoleculesScreen' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SandwichesScreen = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/SandwichesScreen' );

  // strings
  var title = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants-products-and-leftovers.name' );

  var screens = [ new SandwichesScreen(), new MoleculesScreen(), new GameScreen() ];

  var options = {
    credits: {
      leadDesign: 'Yuen-ying Carpenter',
      softwareDevelopment: 'Chris Malley',
      team: 'Julia Chamberlain, Patricia Loeblein, Emily B. Moore, Ariel Paul, Kathy Perkins'
    }
  };

  // developer-only features
  if ( RPALQueryParameters.DEV ) {
    options = _.extend( {
      showHomeScreen: false,
      screenIndex: 0
    }, options );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( title, screens, options );
    sim.start();
  } );
} );