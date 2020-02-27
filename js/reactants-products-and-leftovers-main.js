// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the 'Reactants, Products and Leftovers' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import GameScreen from './game/GameScreen.js';
import MoleculesScreen from './molecules/MoleculesScreen.js';
import reactantsProductsAndLeftoversStrings from './reactants-products-and-leftovers-strings.js';
import SandwichesScreen from './sandwiches/SandwichesScreen.js';

const reactantsProductsAndLeftoversTitleString = reactantsProductsAndLeftoversStrings[ 'reactants-products-and-leftovers' ].title;

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