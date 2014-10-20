// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory functions for creating specific chemical reactions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  var RPALSymbols = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALSymbols' );

  // modules (molecules)
  var CNode = require( 'NITROGLYCERIN/nodes/CNode' );
  var C2H2Node = require( 'NITROGLYCERIN/nodes/C2H2Node' );
  var C2H4Node = require( 'NITROGLYCERIN/nodes/C2H4Node' );
  var C2H5ClNode = require( 'NITROGLYCERIN/nodes/C2H5ClNode' );
  var C2H5OHNode = require( 'NITROGLYCERIN/nodes/C2H5OHNode' );
  var C2H6Node = require( 'NITROGLYCERIN/nodes/C2H6Node' );
  var CH2ONode = require( 'NITROGLYCERIN/nodes/CH2ONode' );
  var CH3OHNode = require( 'NITROGLYCERIN/nodes/CH3OHNode' );
  var CH4Node = require( 'NITROGLYCERIN/nodes/CH4Node' );
  var Cl2Node = require( 'NITROGLYCERIN/nodes/Cl2Node' );
  var CONode = require( 'NITROGLYCERIN/nodes/CONode' );
  var CO2Node = require( 'NITROGLYCERIN/nodes/CO2Node' );
  var CS2Node = require( 'NITROGLYCERIN/nodes/CS2Node' );
  var F2Node = require( 'NITROGLYCERIN/nodes/F2Node' );
  var H2Node = require( 'NITROGLYCERIN/nodes/H2Node' );
  var H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  var H2SNode = require( 'NITROGLYCERIN/nodes/H2SNode' );
  var HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  var HFNode = require( 'NITROGLYCERIN/nodes/HFNode' );
  var N2Node = require( 'NITROGLYCERIN/nodes/N2Node' );
  var N2ONode = require( 'NITROGLYCERIN/nodes/N2ONode' );
  var NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  var NONode = require( 'NITROGLYCERIN/nodes/NONode' );
  var NO2Node = require( 'NITROGLYCERIN/nodes/NO2Node' );
  var O2Node = require( 'NITROGLYCERIN/nodes/O2Node' );
  var OF2Node = require( 'NITROGLYCERIN/nodes/OF2Node' );
  var P4Node = require( 'NITROGLYCERIN/nodes/P4Node' );
  var PCl3Node = require( 'NITROGLYCERIN/nodes/PCl3Node' );
  var PCl5Node = require( 'NITROGLYCERIN/nodes/PCl5Node' );
  var PF3Node = require( 'NITROGLYCERIN/nodes/PF3Node' );
  var PH3Node = require( 'NITROGLYCERIN/nodes/PH3Node' );
  var SNode = require( 'NITROGLYCERIN/nodes/SNode' );
  var SO2Node = require( 'NITROGLYCERIN/nodes/SO2Node' );
  var SO3Node = require( 'NITROGLYCERIN/nodes/SO3Node' );

  // strings
  var combustMethaneString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/combustMethane' );
  var makeAmmoniaString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeAmmonia' );
  var makeWaterString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeWater' );

  // constants
  var ATOM_OPTIONS = { stroke: 'black', lineWidth: 0.5, scale: 1 };

  return {

    //---------------------------------------------------------------------------------------
    // Single-product reactions
    //---------------------------------------------------------------------------------------

    // 2H2 + O2 -> 2H2O (Make Water)
    makeWater: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ],
        { name: makeWaterString } );
    },

    // N2 + 3H2 -> 2NH3 (Make Ammonia)
    makeAmmonia: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.N2, new N2Node( ATOM_OPTIONS ) ),
          new Reactant( 3, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.NH3, new NH3Node( ATOM_OPTIONS ) ) ],
        { name: makeAmmoniaString } );
    },

    // H2 + F2 -> 2HF
    Reaction_H2_F2__2HF: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.F2, new F2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.HF, new HFNode( ATOM_OPTIONS ) ) ] );
    },

    // H2 + Cl2 -> 2HCl
    Reaction_H2_Cl2__2HCl: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.Cl2, new Cl2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.HCl, new HClNode( ATOM_OPTIONS ) ) ] );
    },

    // CO + 2H2 -> CH3OH
    Reaction_CO_2H2__CH3OH: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.CO, new CONode( ATOM_OPTIONS ) ),
          new Reactant( 2, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.CH3OH, new CH3OHNode( ATOM_OPTIONS ) ) ] );
    },

    // CH2O + H2 -> CH3OH
    Reaction_CH2O_H2__CH3OH: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.CH2O, new CH2ONode( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.CH3OH, new CH3OHNode( ATOM_OPTIONS ) ) ] );
    },

    // C2H4 + H2 -> C2H6
    Reaction_C2H4_H2__C2H6: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.C2H4, new C2H4Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.C2H6, new C2H6Node( ATOM_OPTIONS ) ) ] );
    },

    // C2H2 + 2H2 -> C2H6
    Reaction_C2H2_2H2__C2H6: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.C2H2, new C2H2Node( ATOM_OPTIONS ) ),
          new Reactant( 2, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.C2H6, new C2H6Node( ATOM_OPTIONS ) ) ] );
    },

    // C + O2 -> CO2
    Reaction_C_O2__CO2: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.C, new CNode( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ) ] );
    },

    // 2C + O2 -> 2CO
    Reaction_2C_O2__2CO: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.C, new CNode( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.CO, new CONode( ATOM_OPTIONS ) ) ] );
    },

    // 2CO + O2 -> 2CO2
    Reaction_2CO_O2__2CO2: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.CO, new CONode( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ) ] );
    },

    // C + CO2 -> 2CO
    Reaction_C_CO2__2CO: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.C, new CNode( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.CO, new CONode( ATOM_OPTIONS ) ) ] );
    },

    // C + 2S -> CS2
    Reaction_C_2S__CS2: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.C, new CNode( ATOM_OPTIONS ) ),
          new Reactant( 2, RPALSymbols.S, new SNode( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.CS2, new CS2Node( ATOM_OPTIONS ) ) ] );
    },

    // N2 + O2 -> 2NO
    Reaction_N2_O2__2NO: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.N2, new N2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.NO, new NONode( ATOM_OPTIONS ) ) ] );
    },

    // 2NO + O2 -> 2NO2
    Reaction_2NO_O2__2NO2: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.NO, new NONode( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.NO2, new NO2Node( ATOM_OPTIONS ) ) ] );
    },

    // 2N2 + O2 -> 2N2O
    Reaction_2N2_O2__2N2O: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.N2, new N2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.N2O, new N2ONode( ATOM_OPTIONS ) ) ] );
    },

    // P4 + 6H2 -> 4PH3
    Reaction_P4_6H2__4PH3: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.P4, new P4Node( ATOM_OPTIONS ) ),
          new Reactant( 6, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 4, RPALSymbols.PH3, new PH3Node( ATOM_OPTIONS ) ) ] );
    },

    // P4 + 6F2 -> 4PF3
    Reaction_P4_6F2__4PF3: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.P4, new P4Node( ATOM_OPTIONS ) ),
          new Reactant( 6, RPALSymbols.F2, new F2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 4, RPALSymbols.PF3, new PF3Node( ATOM_OPTIONS ) ) ] );
    },

    // P4 + 6Cl2 -> 4PCl3
    Reaction_P4_6Cl2__4PCl3: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.P4, new P4Node( ATOM_OPTIONS ) ),
          new Reactant( 6, RPALSymbols.Cl2, new Cl2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 4, RPALSymbols.PCl3, new PCl3Node( ATOM_OPTIONS ) ) ] );
    },

    //TODO quantities only go to 8. Are we dropping this?
    // P4 + 10Cl2 -> 4PCl5
    Reaction_P4_10Cl2__4PCl5: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.P4, new P4Node( ATOM_OPTIONS ) ),
          new Reactant( 10, RPALSymbols.Cl2, new Cl2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 4, RPALSymbols.PCl5, new PCl5Node( ATOM_OPTIONS ) ) ] );
    },

    // PCl3 + Cl2 -> PCl5
    Reaction_PCl3_Cl2__PCl5: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.PCl3, new PCl3Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.Cl2, new Cl2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.PCl5, new PCl5Node( ATOM_OPTIONS ) ) ] );
    },

    // 2SO2 + O2 -> 2SO3
    Reaction_2SO2_O2__2SO3: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.SO2, new SO2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.SO3, new SO3Node( ATOM_OPTIONS ) ) ] );
    },

    //---------------------------------------------------------------------------------------
    // Two-product reactions
    //---------------------------------------------------------------------------------------

    // CH4 + 2 O2 -> CO2 + 2 H2O (Combust Methane)
    combustMethane: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.CH4, new CH4Node( ATOM_OPTIONS ) ),
          new Reactant( 2, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ],
        { name: combustMethaneString } );
    },

    // 2C + 2H2O -> CH4 + CO2
    Reaction_2C_2H2O__CH4_CO2: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.C, new CNode( ATOM_OPTIONS ) ),
          new Reactant( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.CH4, new CH4Node( ATOM_OPTIONS ) ),
          new Product( 1, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ) ] );
    },

    // CH4 + H2O -> 3H2 + CO
    Reaction_CH4_H2O__3H2_CO: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.CH4, new CH4Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ],
        [ new Product( 3, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ),
          new Product( 1, RPALSymbols.CO, new CONode( ATOM_OPTIONS ) ) ] );
    },

    // 2C2H6 + 7O2 -> 4CO2 + 6H2O
    Reaction_2C2H6_7O2__4CO2_6H2O: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.C2H6, new C2H6Node( ATOM_OPTIONS ) ),
          new Reactant( 7, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 4, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ),
          new Product( 6, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // C2H4 + 3O2 -> 2CO2 + 2H2O
    Reaction_C2H4_3O2__2CO2_2H2O: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.C2H4, new C2H4Node( ATOM_OPTIONS ) ),
          new Reactant( 3, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // 2C2H2 + 5O2 -> 4CO2 + 2H2O
    Reaction_2C2H2_5O2__4CO2_2H2O: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.C2H2, new C2H2Node( ATOM_OPTIONS ) ),
          new Reactant( 5, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 4, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // C2H5OH + 3O2 -> 2CO2 + 3H2O
    Reaction_C2H5OH_3O2__2CO2_3H2O: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.C2H5OH, new C2H5OHNode( ATOM_OPTIONS ) ),
          new Reactant( 3, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ),
          new Product( 3, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // C2H6 + Cl2 -> C2H5Cl + HCl
    Reaction_C2H6_Cl2__C2H5Cl_HCl: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.C2H6, new C2H6Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.Cl2, new Cl2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.C2H5Cl, new C2H5ClNode( ATOM_OPTIONS ) ),
          new Product( 1, RPALSymbols.HCl, new HClNode( ATOM_OPTIONS ) ) ] );
    },

    // CH4 + 4S -> CS2 + 2H2S
    Reaction_CH4_4S__CS2_2H2S: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.CH4, new CH4Node( ATOM_OPTIONS ) ),
          new Reactant( 4, RPALSymbols.S, new SNode( ATOM_OPTIONS ) )],
        [ new Product( 1, RPALSymbols.CS2, new CS2Node( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.H2S, new H2SNode( ATOM_OPTIONS ) ) ] );
    },

    // CS2 + 3O2 -> CO2 + 2SO2
    Reaction_CS2_3O2__CO2_2SO2: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.CS2, new CS2Node( ATOM_OPTIONS ) ),
          new Reactant( 3, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.SO2, new SO2Node( ATOM_OPTIONS ) ) ] );
    },

    // 4NH3 + 3O2 -> 2N2 + 6H2O
    Reaction_4NH3_3O2__2N2_6H2O: function() {
      return new Reaction(
        [ new Reactant( 4, RPALSymbols.NH3, new NH3Node( ATOM_OPTIONS ) ),
          new Reactant( 3, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 2, RPALSymbols.N2, new N2Node( ATOM_OPTIONS ) ),
          new Product( 6, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // 4NH3 + 5O2 -> 4NO + 6H2O
    Reaction_4NH3_5O2__4NO_6H2O: function() {
      return new Reaction(
        [ new Reactant( 4, RPALSymbols.NH3, new NH3Node( ATOM_OPTIONS ) ),
          new Reactant( 5, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 4, RPALSymbols.NO, new NONode( ATOM_OPTIONS ) ),
          new Product( 6, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // 4NH3 + 7O2 -> 4NO2 + 6H2O
    Reaction_4NH3_7O2__4NO2_6H2O: function() {
      return new Reaction(
        [ new Reactant( 4, RPALSymbols.NH3, new NH3Node( ATOM_OPTIONS ) ),
          new Reactant( 7, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 4, RPALSymbols.NO2, new NO2Node( ATOM_OPTIONS ) ),
          new Product( 6, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // 4NH3 + 6NO -> 5N2 + 6H2O
    Reaction_4NH3_6NO__5N2_6H2O: function() {
      return new Reaction(
        [ new Reactant( 4, RPALSymbols.NH3, new NH3Node( ATOM_OPTIONS ) ),
          new Reactant( 6, RPALSymbols.NO, new NONode( ATOM_OPTIONS ) ) ],
        [ new Product( 5, RPALSymbols.N2, new N2Node( ATOM_OPTIONS ) ),
          new Product( 6, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // SO2 + 2H2 -> S + 2H2O
    Reaction_SO2_2H2__S_2H2O: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.SO2, new SO2Node( ATOM_OPTIONS ) ),
          new Reactant( 2, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.S, new SNode( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // SO2 + 3H2 -> H2S + 2H2O
    Reaction_SO2_3H2__H2S_2H2O: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.SO2, new SO2Node( ATOM_OPTIONS ) ),
          new Reactant( 3, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.H2S, new H2SNode( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ] );
    },

    // 2F2 + H2O -> OF2 + 2HF
    Reaction_2F2_H2O__OF2_2HF: function() {
      return new Reaction(
        [ new Reactant( 2, RPALSymbols.F2, new F2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.OF2, new OF2Node( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.HF, new HFNode( ATOM_OPTIONS ) ) ] );
    },

    // OF2 + H2O -> O2 + 2HF
    Reaction_OF2_H2O__O2_2HF: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.OF2, new OF2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ],
        [ new Product( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.HF, new HFNode( ATOM_OPTIONS ) ) ] );
    }
  };
} );