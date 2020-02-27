// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the 'Reactants, Products and Leftovers' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const GameScreen = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/GameScreen' );
  const MoleculesScreen = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/MoleculesScreen' );
  const SandwichesScreen = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/SandwichesScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const reactantsProductsAndLeftoversTitleString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants-products-and-leftovers.title' );

  const options = {
    credits: {
      leadDesign: 'Yuen-ying Carpenter, Kelly Lancaster',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Wendy Adams, Julia Chamberlain, Patricia Loeblein, Emily B. Moore, Robert Parson, Ariel Paul, ' +
            'Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan, Oliver Orejola, Benjamin Roberts, Bryan Yoelin'
    }
  };

  SimLauncher.launch( () => {
    const screens = [
      new SandwichesScreen(),
      new MoleculesScreen(),
      new GameScreen()
    ];
    const sim = new Sim( reactantsProductsAndLeftoversTitleString, screens, options );
    sim.start();
  } );
} );