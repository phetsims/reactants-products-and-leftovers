// Copyright 2014-2023, University of Colorado Boulder

/**
 * Main entry point for the 'Reactants, Products and Leftovers' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import GameScreen from './game/GameScreen.js';
import MoleculesScreen from './molecules/MoleculesScreen.js';
import ReactantsProductsAndLeftoversStrings from './ReactantsProductsAndLeftoversStrings.js';
import SandwichesScreen from './sandwiches/SandwichesScreen.js';

simLauncher.launch( () => {

  const screens = [
    new SandwichesScreen(),
    new MoleculesScreen(),
    new GameScreen()
  ];

  const sim = new Sim( ReactantsProductsAndLeftoversStrings[ 'reactants-products-and-leftovers' ].titleStringProperty, screens, {
    credits: {
      leadDesign: 'Yuen-ying Carpenter, Kelly Lancaster',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Wendy Adams, Julia Chamberlain, Patricia Loeblein, Emily B. Moore, Robert Parson, Ariel Paul, ' +
            'Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan, Oliver Orejola, Benjamin Roberts, Bryan Yoelin'
    }
  } );

  sim.start();
} );