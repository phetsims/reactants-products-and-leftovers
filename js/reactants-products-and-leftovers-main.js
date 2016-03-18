// Copyright 2014-2015, University of Colorado Boulder

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
  var SandwichesScreen = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/SandwichesScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var reactantsProductsAndLeftoversTitleString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants-products-and-leftovers.title' );

  var options = {
    credits: {
      leadDesign: 'Yuen-ying Carpenter, Kelly Lancaster',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Wendy Adams, Julia Chamberlain, Patricia Loeblein, Emily B. Moore,\n' +
            'Robert Parson, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan,\nOliver Orejola, Benjamin Roberts, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    var screens = [
      new SandwichesScreen(),
      new MoleculesScreen(),
      new GameScreen()
    ];
    var sim = new Sim( reactantsProductsAndLeftoversTitleString, screens, options );
    sim.start();
  } );
} );