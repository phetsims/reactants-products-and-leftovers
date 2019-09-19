// Copyright 2014-2015, University of Colorado Boulder

/**
 * Symbols for the Substances that appear in this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ChemUtils = require( 'NITROGLYCERIN/ChemUtils' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  // Plain-text versions of the symbols (i18n not required)
  const SYMBOLS = [
    'C', 'C2H2', 'C2H4', 'C2H5Cl', 'C2H5OH', 'C2H6', 'CH2O', 'CH3OH', 'CH4', 'Cl2', 'CO', 'CO2', 'CS2',
    'F2', 'H2', 'H2O', 'H2S', 'HCl', 'HF', 'N2', 'N2O', 'NH3', 'NO', 'NO2', 'O2', 'OF2',
    'P4', 'PCl3', 'PCl5', 'PF3', 'PH3', 'S', 'SO2', 'SO3'
  ];

  // Create an object that has property names that match the plain-text symbols, values are HTML fragments.
  const RPALSymbols = {};
  SYMBOLS.forEach( function( symbol ) {
    RPALSymbols[ symbol ] = ChemUtils.toSubscript( symbol );
  } );

  reactantsProductsAndLeftovers.register( 'RPALSymbols', RPALSymbols );

  return RPALSymbols;
} );
