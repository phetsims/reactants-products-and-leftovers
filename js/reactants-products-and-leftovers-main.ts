// Copyright 2014-2024, University of Colorado Boulder

/**
 * Main entry point for the 'Reactants, Products and Leftovers' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GameScreen from './game/GameScreen.js';
import MoleculesScreen from './molecules/MoleculesScreen.js';
import ReactantsProductsAndLeftoversStrings from './ReactantsProductsAndLeftoversStrings.js';
import SandwichesScreen from './sandwiches/SandwichesScreen.js';

simLauncher.launch( () => {

  const titleStringProperty = ReactantsProductsAndLeftoversStrings[ 'reactants-products-and-leftovers' ].titleStringProperty;

  const screens = [
    new SandwichesScreen( Tandem.ROOT.createTandem( 'sandwichesScreen' ) ),
    new MoleculesScreen( Tandem.ROOT.createTandem( 'moleculesScreen' ) ),
    new GameScreen( Tandem.ROOT.createTandem( 'gameScreen' ) )
  ];

  const options: SimOptions = {
    credits: {
      leadDesign: 'Yuen-ying Carpenter, Kelly Lancaster',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Wendy Adams, Julia Chamberlain, Patricia Loeblein, Emily B. Moore, Robert Parson, Ariel Paul, ' +
            'Kathy Perkins, Amy Rouinfar',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Matthew Moore, Elise Morgan, Ashton Morris, Oliver Orejola, ' +
                        'Benjamin Roberts, Nancy Salpepi, Kathryn Woessner, Bryan Yoelin'
    }
  };

  const sim = new Sim( titleStringProperty, screens, options );

  sim.start();
} );