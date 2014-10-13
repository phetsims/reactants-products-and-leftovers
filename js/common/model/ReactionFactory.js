// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory functions for creating specific chemical reactions
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CustomSandwich = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/CustomSandwich' );
  var MoleculeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/MoleculeFactory' );
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );

  // strings
  var cheeseString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/cheese' );
  var meatAndCheeseString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/meatAndCheese' );
  var combustMethaneString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/combustMethane' );
  var makeAmmoniaString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeAmmonia' );
  var makeWaterString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeWater' );

  return {

    //---------------------------------------------------------------------------------------
    // Sandwich 'reactions'
    //---------------------------------------------------------------------------------------

    cheeseSandwich: function() {
      return new Reaction(
        [ new Reactant( 2, MoleculeFactory.bread() ), new Reactant( 1, MoleculeFactory.cheese() ) ],
        [ new Product( 1, MoleculeFactory.sandwich( 'cheeseSandwich', 2, 0, 1 ) ) ],
        { name: cheeseString } );
    },

    meatAndCheeseSandwich: function() {
      return new Reaction(
        [ new Reactant( 2, MoleculeFactory.bread() ), new Reactant( 1, MoleculeFactory.meat() ), new Reactant( 1, MoleculeFactory.cheese() ) ],
        [ new Product( 1, MoleculeFactory.sandwich( 'meatAndCheeseSandwich', 2, 1, 1 ) ) ],
        { name: meatAndCheeseString } );
    },

    customSandwich: function() {
      return new CustomSandwich();
    },

    //---------------------------------------------------------------------------------------
    // Single-product reactions
    //---------------------------------------------------------------------------------------

    // 2H2 + O2 -> 2H2O (Make Water)
    makeWater: function() {
      return new Reaction(
        [ new Reactant( 2, MoleculeFactory.H2() ), new Reactant( 1, MoleculeFactory.O2() ) ],
        [ new Product( 2, MoleculeFactory.H2O() ) ],
        { name: makeWaterString } );
    },

    // N2 + 3H2 -> 2NH3 (Make Ammonia)
    makeAmmonia: function() {
      return new Reaction(
        [ new Reactant( 1, MoleculeFactory.N2() ), new Reactant( 3, MoleculeFactory.H2() ) ],
        [ new Product( 2, MoleculeFactory.NH3() ) ],
        { name: makeAmmoniaString } );
    },

    // H2 + F2 -> 2HF
    H2_F2__2HF: function() {
      return new Reaction(
        [ new Reactant( 1, MoleculeFactory.H2() ), new Reactant( 1, MoleculeFactory.F2() ) ],
        [ new Product( 2, MoleculeFactory.HF() ) ] );
    },

    // H2 + Cl2 -> 2HCl
    H2_Cl2__2HCl: function() {
      return new Reaction(
        [ new Reactant( 1, MoleculeFactory.H2() ), new Reactant( 1, MoleculeFactory.Cl2() ) ],
        [ new Product( 2, MoleculeFactory.HCl() ) ] );
    },

    //TODO add additional reactions from java.OneProductReactions

    //---------------------------------------------------------------------------------------
    // Two-product reactions
    //---------------------------------------------------------------------------------------

    // CH4 + 2 O2 -> CO2 + 2 H2O (Combust Methane)
    combustMethane: function() {
      return new Reaction(
        [ new Reactant( 1, MoleculeFactory.CH4() ), new Reactant( 2, MoleculeFactory.O2() ) ],
        [ new Product( 1, MoleculeFactory.CO2() ), new Product( 2, MoleculeFactory.H2O() ) ],
        { name: combustMethaneString } );
    }

    //TODO add additional reactions from java.TwoProductReactions
  };
} );