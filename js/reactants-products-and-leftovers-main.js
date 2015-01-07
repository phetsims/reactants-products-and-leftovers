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
  var SandwichesScreen = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/SandwichesScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var title = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants-products-and-leftovers.name' );

  var screens = [ new SandwichesScreen(), new MoleculesScreen(), new GameScreen() ];

  var options = {
    credits: {
      leadDesign: 'Yuen-ying Carpenter, Kelly Lancaster',
      softwareDevelopment: 'Chris Malley',
      team: 'Wendy Adams, Julia Chamberlain, Patricia Loeblein, Emily B. Moore,\n' +
            'Robert Parson, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Oliver Orejola, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( title, screens, options );
    sim.start();
  } );
} );