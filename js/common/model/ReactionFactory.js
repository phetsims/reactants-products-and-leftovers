// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory functions for creating specific chemical reactions.
 * <p>
 * Note that the function names all have a specific format.
 * For example, the function for creating reaction '2C + O2 -> 2CO' is named Reaction_2C_O2__2CO.
 * Underscore is substituted for '+'.
 * Double underscore is substituted for '->'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var MoleculeNodes = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculeNodes' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  var RPALSymbols = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALSymbols' );
  var Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  // strings
  var combustMethaneString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/combustMethane' );
  var makeAmmoniaString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeAmmonia' );
  var makeWaterString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeWater' );

  var ReactionFactory = {

    //---------------------------------------------------------------------------------------
    // Single-product reactions
    //---------------------------------------------------------------------------------------

    // 2H2 + O2 -> 2H2O (Make Water)
    makeWater: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.H2, MoleculeNodes.H2 ),
          new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.H2O, MoleculeNodes.H2O ) ],
        { name: makeWaterString } );
    },

    // N2 + 3H2 -> 2NH3 (Make Ammonia)
    makeAmmonia: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.N2, MoleculeNodes.N2 ),
          new Substance( 3, RPALSymbols.H2, MoleculeNodes.H2 ) ],
        [ new Substance( 2, RPALSymbols.NH3, MoleculeNodes.NH3 ) ],
        { name: makeAmmoniaString } );
    },

    // H2 + F2 -> 2HF
    Reaction_H2_F2__2HF: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.H2, MoleculeNodes.H2 ),
          new Substance( 1, RPALSymbols.F2, MoleculeNodes.F2 ) ],
        [ new Substance( 2, RPALSymbols.HF, MoleculeNodes.HF ) ] );
    },

    // H2 + Cl2 -> 2HCl
    Reaction_H2_Cl2__2HCl: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.H2, MoleculeNodes.H2 ),
          new Substance( 1, RPALSymbols.Cl2, MoleculeNodes.Cl2 ) ],
        [ new Substance( 2, RPALSymbols.HCl, MoleculeNodes.HCl ) ] );
    },

    // CO + 2H2 -> CH3OH
    Reaction_CO_2H2__CH3OH: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CO, MoleculeNodes.CO ),
          new Substance( 2, RPALSymbols.H2, MoleculeNodes.H2 ) ],
        [ new Substance( 1, RPALSymbols.CH3OH, MoleculeNodes.CH3OH ) ] );
    },

    // CH2O + H2 -> CH3OH
    Reaction_CH2O_H2__CH3OH: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CH2O, MoleculeNodes.CH2O ),
          new Substance( 1, RPALSymbols.H2, MoleculeNodes.H2 ) ],
        [ new Substance( 1, RPALSymbols.CH3OH, MoleculeNodes.CH3OH ) ] );
    },

    // C2H4 + H2 -> C2H6
    Reaction_C2H4_H2__C2H6: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H4, MoleculeNodes.C2H4 ),
          new Substance( 1, RPALSymbols.H2, MoleculeNodes.H2 ) ],
        [ new Substance( 1, RPALSymbols.C2H6, MoleculeNodes.C2H6 ) ] );
    },

    // C2H2 + 2H2 -> C2H6
    Reaction_C2H2_2H2__C2H6: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H2, MoleculeNodes.C2H2 ),
          new Substance( 2, RPALSymbols.H2, MoleculeNodes.H2 ) ],
        [ new Substance( 1, RPALSymbols.C2H6, MoleculeNodes.C2H6 ) ] );
    },

    // C + O2 -> CO2
    Reaction_C_O2__CO2: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C, MoleculeNodes.C ),
          new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 1, RPALSymbols.CO2, MoleculeNodes.CO2 ) ] );
    },

    // 2C + O2 -> 2CO
    Reaction_2C_O2__2CO: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.C, MoleculeNodes.C ),
          new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.CO, MoleculeNodes.CO ) ] );
    },

    // 2CO + O2 -> 2CO2
    Reaction_2CO_O2__2CO2: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.CO, MoleculeNodes.CO ),
          new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.CO2, MoleculeNodes.CO2 ) ] );
    },

    // C + CO2 -> 2CO
    Reaction_C_CO2__2CO: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C, MoleculeNodes.C ),
          new Substance( 1, RPALSymbols.CO2, MoleculeNodes.CO2 ) ],
        [ new Substance( 2, RPALSymbols.CO, MoleculeNodes.CO ) ] );
    },

    // C + 2S -> CS2
    Reaction_C_2S__CS2: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C, MoleculeNodes.C ),
          new Substance( 2, RPALSymbols.S, MoleculeNodes.S ) ],
        [ new Substance( 1, RPALSymbols.CS2, MoleculeNodes.CS2 ) ] );
    },

    // N2 + O2 -> 2NO
    Reaction_N2_O2__2NO: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.N2, MoleculeNodes.N2 ),
          new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.NO, MoleculeNodes.NO ) ] );
    },

    // 2NO + O2 -> 2NO2
    Reaction_2NO_O2__2NO2: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.NO, MoleculeNodes.NO ),
          new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.NO2, MoleculeNodes.NO2 ) ] );
    },

    // 2N2 + O2 -> 2N2O
    Reaction_2N2_O2__2N2O: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.N2, MoleculeNodes.N2 ),
          new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.N2O, MoleculeNodes.N2O ) ] );
    },

    // P4 + 6H2 -> 4PH3
    Reaction_P4_6H2__4PH3: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.P4, MoleculeNodes.P4 ),
          new Substance( 6, RPALSymbols.H2, MoleculeNodes.H2 ) ],
        [ new Substance( 4, RPALSymbols.PH3, MoleculeNodes.PH3 ) ] );
    },

    // P4 + 6F2 -> 4PF3
    Reaction_P4_6F2__4PF3: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.P4, MoleculeNodes.P4 ),
          new Substance( 6, RPALSymbols.F2, MoleculeNodes.F2 ) ],
        [ new Substance( 4, RPALSymbols.PF3, MoleculeNodes.PF3 ) ] );
    },

    // P4 + 6Cl2 -> 4PCl3
    Reaction_P4_6Cl2__4PCl3: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.P4, MoleculeNodes.P4 ),
          new Substance( 6, RPALSymbols.Cl2, MoleculeNodes.Cl2 ) ],
        [ new Substance( 4, RPALSymbols.PCl3, MoleculeNodes.PCl3 ) ] );
    },

    // PCl3 + Cl2 -> PCl5
    Reaction_PCl3_Cl2__PCl5: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.PCl3, MoleculeNodes.PCl3 ),
          new Substance( 1, RPALSymbols.Cl2, MoleculeNodes.Cl2 ) ],
        [ new Substance( 1, RPALSymbols.PCl5, MoleculeNodes.PCl5 ) ] );
    },

    // 2SO2 + O2 -> 2SO3
    Reaction_2SO2_O2__2SO3: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.SO2, MoleculeNodes.SO2 ),
          new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.SO3, MoleculeNodes.SO3 ) ] );
    },

    //---------------------------------------------------------------------------------------
    // Two-product reactions
    //---------------------------------------------------------------------------------------

    // CH4 + 2 O2 -> CO2 + 2 H2O (Combust Methane)
    combustMethane: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CH4, MoleculeNodes.CH4 ),
          new Substance( 2, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 1, RPALSymbols.CO2, MoleculeNodes.CO2 ),
          new Substance( 2, RPALSymbols.H2O, MoleculeNodes.H2O ) ],
        { name: combustMethaneString } );
    },

    // 2C + 2H2O -> CH4 + CO2
    Reaction_2C_2H2O__CH4_CO2: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.C, MoleculeNodes.C ),
          new Substance( 2, RPALSymbols.H2O, MoleculeNodes.H2O ) ],
        [ new Substance( 1, RPALSymbols.CH4, MoleculeNodes.CH4 ),
          new Substance( 1, RPALSymbols.CO2, MoleculeNodes.CO2 ) ] );
    },

    // CH4 + H2O -> 3H2 + CO
    Reaction_CH4_H2O__3H2_CO: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CH4, MoleculeNodes.CH4 ),
          new Substance( 1, RPALSymbols.H2O, MoleculeNodes.H2O ) ],
        [ new Substance( 3, RPALSymbols.H2, MoleculeNodes.H2 ),
          new Substance( 1, RPALSymbols.CO, MoleculeNodes.CO ) ] );
    },

    // 2C2H6 + 7O2 -> 4CO2 + 6H2O
    Reaction_2C2H6_7O2__4CO2_6H2O: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.C2H6, MoleculeNodes.C2H6 ),
          new Substance( 7, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 4, RPALSymbols.CO2, MoleculeNodes.CO2 ),
          new Substance( 6, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // C2H4 + 3O2 -> 2CO2 + 2H2O
    Reaction_C2H4_3O2__2CO2_2H2O: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H4, MoleculeNodes.C2H4 ),
          new Substance( 3, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.CO2, MoleculeNodes.CO2 ),
          new Substance( 2, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // 2C2H2 + 5O2 -> 4CO2 + 2H2O
    Reaction_2C2H2_5O2__4CO2_2H2O: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.C2H2, MoleculeNodes.C2H2 ),
          new Substance( 5, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 4, RPALSymbols.CO2, MoleculeNodes.CO2 ),
          new Substance( 2, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // C2H5OH + 3O2 -> 2CO2 + 3H2O
    Reaction_C2H5OH_3O2__2CO2_3H2O: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H5OH, MoleculeNodes.C2H5OH ),
          new Substance( 3, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.CO2, MoleculeNodes.CO2 ),
          new Substance( 3, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // C2H6 + Cl2 -> C2H5Cl + HCl
    Reaction_C2H6_Cl2__C2H5Cl_HCl: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H6, MoleculeNodes.C2H6 ),
          new Substance( 1, RPALSymbols.Cl2, MoleculeNodes.Cl2 ) ],
        [ new Substance( 1, RPALSymbols.C2H5Cl, MoleculeNodes.C2H5Cl ),
          new Substance( 1, RPALSymbols.HCl, MoleculeNodes.HCl ) ] );
    },

    // CH4 + 4S -> CS2 + 2H2S
    Reaction_CH4_4S__CS2_2H2S: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CH4, MoleculeNodes.CH4 ),
          new Substance( 4, RPALSymbols.S, MoleculeNodes.S )],
        [ new Substance( 1, RPALSymbols.CS2, MoleculeNodes.CS2 ),
          new Substance( 2, RPALSymbols.H2S, MoleculeNodes.H2S ) ] );
    },

    // CS2 + 3O2 -> CO2 + 2SO2
    Reaction_CS2_3O2__CO2_2SO2: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CS2, MoleculeNodes.CS2 ),
          new Substance( 3, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 1, RPALSymbols.CO2, MoleculeNodes.CO2 ),
          new Substance( 2, RPALSymbols.SO2, MoleculeNodes.SO2 ) ] );
    },

    // 4NH3 + 3O2 -> 2N2 + 6H2O
    Reaction_4NH3_3O2__2N2_6H2O: function() {
      return new Reaction(
        [ new Substance( 4, RPALSymbols.NH3, MoleculeNodes.NH3 ),
          new Substance( 3, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 2, RPALSymbols.N2, MoleculeNodes.N2 ),
          new Substance( 6, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // 4NH3 + 5O2 -> 4NO + 6H2O
    Reaction_4NH3_5O2__4NO_6H2O: function() {
      return new Reaction(
        [ new Substance( 4, RPALSymbols.NH3, MoleculeNodes.NH3 ),
          new Substance( 5, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 4, RPALSymbols.NO, MoleculeNodes.NO ),
          new Substance( 6, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // 4NH3 + 7O2 -> 4NO2 + 6H2O
    Reaction_4NH3_7O2__4NO2_6H2O: function() {
      return new Reaction(
        [ new Substance( 4, RPALSymbols.NH3, MoleculeNodes.NH3 ),
          new Substance( 7, RPALSymbols.O2, MoleculeNodes.O2 ) ],
        [ new Substance( 4, RPALSymbols.NO2, MoleculeNodes.NO2 ),
          new Substance( 6, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // 4NH3 + 6NO -> 5N2 + 6H2O
    Reaction_4NH3_6NO__5N2_6H2O: function() {
      return new Reaction(
        [ new Substance( 4, RPALSymbols.NH3, MoleculeNodes.NH3 ),
          new Substance( 6, RPALSymbols.NO, MoleculeNodes.NO ) ],
        [ new Substance( 5, RPALSymbols.N2, MoleculeNodes.N2 ),
          new Substance( 6, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // SO2 + 2H2 -> S + 2H2O
    Reaction_SO2_2H2__S_2H2O: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.SO2, MoleculeNodes.SO2 ),
          new Substance( 2, RPALSymbols.H2, MoleculeNodes.H2 ) ],
        [ new Substance( 1, RPALSymbols.S, MoleculeNodes.S ),
          new Substance( 2, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // SO2 + 3H2 -> H2S + 2H2O
    Reaction_SO2_3H2__H2S_2H2O: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.SO2, MoleculeNodes.SO2 ),
          new Substance( 3, RPALSymbols.H2, MoleculeNodes.H2 ) ],
        [ new Substance( 1, RPALSymbols.H2S, MoleculeNodes.H2S ),
          new Substance( 2, RPALSymbols.H2O, MoleculeNodes.H2O ) ] );
    },

    // 2F2 + H2O -> OF2 + 2HF
    Reaction_2F2_H2O__OF2_2HF: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.F2, MoleculeNodes.F2 ),
          new Substance( 1, RPALSymbols.H2O, MoleculeNodes.H2O ) ],
        [ new Substance( 1, RPALSymbols.OF2, MoleculeNodes.OF2 ),
          new Substance( 2, RPALSymbols.HF, MoleculeNodes.HF ) ] );
    },

    // OF2 + H2O -> O2 + 2HF
    Reaction_OF2_H2O__O2_2HF: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.OF2, MoleculeNodes.OF2 ),
          new Substance( 1, RPALSymbols.H2O, MoleculeNodes.H2O ) ],
        [ new Substance( 1, RPALSymbols.O2, MoleculeNodes.O2 ),
          new Substance( 2, RPALSymbols.HF, MoleculeNodes.HF ) ] );
    }
  };

  return ReactionFactory;
} );