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
      designTeam: 'Julia Chamberlain, Patricia Loeblein, Emily B. Moore, Ariel Paul, Kathy Perkins'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    options = _.extend( {
      // add dev-specific options here
      showHomeScreen: false,
      screenIndex: 1
    }, options );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( title, screens, options );
    sim.start();
  } );
} );