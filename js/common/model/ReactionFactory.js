// Copyright 2014-2019, University of Colorado Boulder

/**
 * Factory functions for creating specific chemical reactions.
 *
 * Note that the function names all have a specific format.
 * For example, the function for creating reaction '2C + O2 -> 2CO' is named Reaction_2C_O2__2CO.
 * Underscore is substituted for '+'.
 * Double underscore is substituted for '->'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const RPALSymbols = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALSymbols' );
  const Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  // modules (atoms & molecules)
  const C2H2Node = require( 'NITROGLYCERIN/nodes/C2H2Node' );
  const C2H4Node = require( 'NITROGLYCERIN/nodes/C2H4Node' );
  const C2H5ClNode = require( 'NITROGLYCERIN/nodes/C2H5ClNode' );
  const C2H5OHNode = require( 'NITROGLYCERIN/nodes/C2H5OHNode' );
  const C2H6Node = require( 'NITROGLYCERIN/nodes/C2H6Node' );
  const CH2ONode = require( 'NITROGLYCERIN/nodes/CH2ONode' );
  const CH3OHNode = require( 'NITROGLYCERIN/nodes/CH3OHNode' );
  const CH4Node = require( 'NITROGLYCERIN/nodes/CH4Node' );
  const Cl2Node = require( 'NITROGLYCERIN/nodes/Cl2Node' );
  const CNode = require( 'NITROGLYCERIN/nodes/CNode' );
  const CO2Node = require( 'NITROGLYCERIN/nodes/CO2Node' );
  const CONode = require( 'NITROGLYCERIN/nodes/CONode' );
  const CS2Node = require( 'NITROGLYCERIN/nodes/CS2Node' );
  const F2Node = require( 'NITROGLYCERIN/nodes/F2Node' );
  const H2Node = require( 'NITROGLYCERIN/nodes/H2Node' );
  const H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  const H2SNode = require( 'NITROGLYCERIN/nodes/H2SNode' );
  const HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  const HFNode = require( 'NITROGLYCERIN/nodes/HFNode' );
  const N2Node = require( 'NITROGLYCERIN/nodes/N2Node' );
  const N2ONode = require( 'NITROGLYCERIN/nodes/N2ONode' );
  const NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  const NO2Node = require( 'NITROGLYCERIN/nodes/NO2Node' );
  const NONode = require( 'NITROGLYCERIN/nodes/NONode' );
  const O2Node = require( 'NITROGLYCERIN/nodes/O2Node' );
  const OF2Node = require( 'NITROGLYCERIN/nodes/OF2Node' );
  const P4Node = require( 'NITROGLYCERIN/nodes/P4Node' );
  const PCl3Node = require( 'NITROGLYCERIN/nodes/PCl3Node' );
  const PCl5Node = require( 'NITROGLYCERIN/nodes/PCl5Node' );
  const PF3Node = require( 'NITROGLYCERIN/nodes/PF3Node' );
  const PH3Node = require( 'NITROGLYCERIN/nodes/PH3Node' );
  const SNode = require( 'NITROGLYCERIN/nodes/SNode' );
  const SO2Node = require( 'NITROGLYCERIN/nodes/SO2Node' );
  const SO3Node = require( 'NITROGLYCERIN/nodes/SO3Node' );

  // strings
  const combustMethaneString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/combustMethane' );
  const makeAmmoniaString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeAmmonia' );
  const makeWaterString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeWater' );

  // constants
  const MOLECULE_OPTIONS = RPALConstants.MOLECULE_OPTIONS; // to improve readability

  const ReactionFactory = {

    // {Node} constructors for all atoms & molecules that appear in reactions
    moleculeNodeConstructors: [
      C2H2Node, C2H4Node, C2H5ClNode, C2H5OHNode, C2H6Node, CH2ONode,
      CH3OHNode, CH4Node, Cl2Node, CNode, CO2Node, CONode, CS2Node,
      F2Node,
      H2Node, H2ONode, H2SNode, HClNode, HFNode,
      N2Node, N2ONode, NH3Node, NO2Node, NONode,
      O2Node, OF2Node,
      P4Node, PCl3Node, PCl5Node, PF3Node, PH3Node,
      SNode, SO2Node, SO3Node
    ],

    //---------------------------------------------------------------------------------------
    // Single-product reactions
    //---------------------------------------------------------------------------------------

    // 2H2 + O2 -> 2H2O (Make Water)
    makeWater: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ],
        { name: makeWaterString } );
    },

    // N2 + 3H2 -> 2NH3 (Make Ammonia)
    makeAmmonia: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.N2, new N2Node( MOLECULE_OPTIONS ) ),
          new Substance( 3, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.NH3, new NH3Node( MOLECULE_OPTIONS ) ) ],
        { name: makeAmmoniaString } );
    },

    // H2 + F2 -> 2HF
    Reaction_H2_F2__2HF: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.F2, new F2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.HF, new HFNode( MOLECULE_OPTIONS ) ) ] );
    },

    // H2 + Cl2 -> 2HCl
    Reaction_H2_Cl2__2HCl: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.Cl2, new Cl2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.HCl, new HClNode( MOLECULE_OPTIONS ) ) ] );
    },

    // CO + 2H2 -> CH3OH
    Reaction_CO_2H2__CH3OH: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CO, new CONode( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.CH3OH, new CH3OHNode( MOLECULE_OPTIONS ) ) ] );
    },

    // CH2O + H2 -> CH3OH
    Reaction_CH2O_H2__CH3OH: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CH2O, new CH2ONode( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.CH3OH, new CH3OHNode( MOLECULE_OPTIONS ) ) ] );
    },

    // C2H4 + H2 -> C2H6
    Reaction_C2H4_H2__C2H6: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H4, new C2H4Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.C2H6, new C2H6Node( MOLECULE_OPTIONS ) ) ] );
    },

    // C2H2 + 2H2 -> C2H6
    Reaction_C2H2_2H2__C2H6: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H2, new C2H2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.C2H6, new C2H6Node( MOLECULE_OPTIONS ) ) ] );
    },

    // C + O2 -> CO2
    Reaction_C_O2__CO2: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C, new CNode( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ) ] );
    },

    // 2C + O2 -> 2CO
    Reaction_2C_O2__2CO: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.C, new CNode( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.CO, new CONode( MOLECULE_OPTIONS ) ) ] );
    },

    // 2CO + O2 -> 2CO2
    Reaction_2CO_O2__2CO2: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.CO, new CONode( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ) ] );
    },

    // C + CO2 -> 2CO
    Reaction_C_CO2__2CO: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C, new CNode( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.CO, new CONode( MOLECULE_OPTIONS ) ) ] );
    },

    // C + 2S -> CS2
    Reaction_C_2S__CS2: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C, new CNode( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.S, new SNode( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.CS2, new CS2Node( MOLECULE_OPTIONS ) ) ] );
    },

    // N2 + O2 -> 2NO
    Reaction_N2_O2__2NO: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.N2, new N2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.NO, new NONode( MOLECULE_OPTIONS ) ) ] );
    },

    // 2NO + O2 -> 2NO2
    Reaction_2NO_O2__2NO2: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.NO, new NONode( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.NO2, new NO2Node( MOLECULE_OPTIONS ) ) ] );
    },

    // 2N2 + O2 -> 2N2O
    Reaction_2N2_O2__2N2O: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.N2, new N2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.N2O, new N2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // P4 + 6H2 -> 4PH3
    Reaction_P4_6H2__4PH3: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.P4, new P4Node( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 4, RPALSymbols.PH3, new PH3Node( MOLECULE_OPTIONS ) ) ] );
    },

    // P4 + 6F2 -> 4PF3
    Reaction_P4_6F2__4PF3: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.P4, new P4Node( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.F2, new F2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 4, RPALSymbols.PF3, new PF3Node( MOLECULE_OPTIONS ) ) ] );
    },

    // P4 + 6Cl2 -> 4PCl3
    Reaction_P4_6Cl2__4PCl3: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.P4, new P4Node( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.Cl2, new Cl2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 4, RPALSymbols.PCl3, new PCl3Node( MOLECULE_OPTIONS ) ) ] );
    },

    // PCl3 + Cl2 -> PCl5
    Reaction_PCl3_Cl2__PCl5: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.PCl3, new PCl3Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.Cl2, new Cl2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.PCl5, new PCl5Node( MOLECULE_OPTIONS ) ) ] );
    },

    // 2SO2 + O2 -> 2SO3
    Reaction_2SO2_O2__2SO3: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.SO2, new SO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.SO3, new SO3Node( MOLECULE_OPTIONS ) ) ] );
    },

    //---------------------------------------------------------------------------------------
    // Two-product reactions
    //---------------------------------------------------------------------------------------

    // CH4 + 2 O2 -> CO2 + 2 H2O (Combust Methane)
    combustMethane: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CH4, new CH4Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ],
        { name: combustMethaneString } );
    },

    // 2C + 2H2O -> CH4 + CO2
    Reaction_2C_2H2O__CH4_CO2: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.C, new CNode( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.CH4, new CH4Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ) ] );
    },

    // CH4 + H2O -> 3H2 + CO
    Reaction_CH4_H2O__3H2_CO: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CH4, new CH4Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 3, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.CO, new CONode( MOLECULE_OPTIONS ) ) ] );
    },

    // 2C2H6 + 7O2 -> 4CO2 + 6H2O
    Reaction_2C2H6_7O2__4CO2_6H2O: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.C2H6, new C2H6Node( MOLECULE_OPTIONS ) ),
          new Substance( 7, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 4, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // C2H4 + 3O2 -> 2CO2 + 2H2O
    Reaction_C2H4_3O2__2CO2_2H2O: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H4, new C2H4Node( MOLECULE_OPTIONS ) ),
          new Substance( 3, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // 2C2H2 + 5O2 -> 4CO2 + 2H2O
    Reaction_2C2H2_5O2__4CO2_2H2O: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.C2H2, new C2H2Node( MOLECULE_OPTIONS ) ),
          new Substance( 5, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 4, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // C2H5OH + 3O2 -> 2CO2 + 3H2O
    Reaction_C2H5OH_3O2__2CO2_3H2O: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H5OH, new C2H5OHNode( MOLECULE_OPTIONS ) ),
          new Substance( 3, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 3, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // C2H6 + Cl2 -> C2H5Cl + HCl
    Reaction_C2H6_Cl2__C2H5Cl_HCl: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.C2H6, new C2H6Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.Cl2, new Cl2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.C2H5Cl, new C2H5ClNode( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.HCl, new HClNode( MOLECULE_OPTIONS ) ) ] );
    },

    // CH4 + 4S -> CS2 + 2H2S
    Reaction_CH4_4S__CS2_2H2S: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CH4, new CH4Node( MOLECULE_OPTIONS ) ),
          new Substance( 4, RPALSymbols.S, new SNode( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.CS2, new CS2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2S, new H2SNode( MOLECULE_OPTIONS ) ) ] );
    },

    // CS2 + 3O2 -> CO2 + 2SO2
    Reaction_CS2_3O2__CO2_2SO2: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.CS2, new CS2Node( MOLECULE_OPTIONS ) ),
          new Substance( 3, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.CO2, new CO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.SO2, new SO2Node( MOLECULE_OPTIONS ) ) ] );
    },

    // 4NH3 + 3O2 -> 2N2 + 6H2O
    Reaction_4NH3_3O2__2N2_6H2O: function() {
      return new Reaction(
        [ new Substance( 4, RPALSymbols.NH3, new NH3Node( MOLECULE_OPTIONS ) ),
          new Substance( 3, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 2, RPALSymbols.N2, new N2Node( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // 4NH3 + 5O2 -> 4NO + 6H2O
    Reaction_4NH3_5O2__4NO_6H2O: function() {
      return new Reaction(
        [ new Substance( 4, RPALSymbols.NH3, new NH3Node( MOLECULE_OPTIONS ) ),
          new Substance( 5, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 4, RPALSymbols.NO, new NONode( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // 4NH3 + 7O2 -> 4NO2 + 6H2O
    Reaction_4NH3_7O2__4NO2_6H2O: function() {
      return new Reaction(
        [ new Substance( 4, RPALSymbols.NH3, new NH3Node( MOLECULE_OPTIONS ) ),
          new Substance( 7, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 4, RPALSymbols.NO2, new NO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // 4NH3 + 6NO -> 5N2 + 6H2O
    Reaction_4NH3_6NO__5N2_6H2O: function() {
      return new Reaction(
        [ new Substance( 4, RPALSymbols.NH3, new NH3Node( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.NO, new NONode( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 5, RPALSymbols.N2, new N2Node( MOLECULE_OPTIONS ) ),
          new Substance( 6, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // SO2 + 2H2 -> S + 2H2O
    Reaction_SO2_2H2__S_2H2O: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.SO2, new SO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.S, new SNode( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // SO2 + 3H2 -> H2S + 2H2O
    Reaction_SO2_3H2__H2S_2H2O: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.SO2, new SO2Node( MOLECULE_OPTIONS ) ),
          new Substance( 3, RPALSymbols.H2, new H2Node( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.H2S, new H2SNode( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ] );
    },

    // 2F2 + H2O -> OF2 + 2HF
    Reaction_2F2_H2O__OF2_2HF: function() {
      return new Reaction(
        [ new Substance( 2, RPALSymbols.F2, new F2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.OF2, new OF2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.HF, new HFNode( MOLECULE_OPTIONS ) ) ] );
    },

    // OF2 + H2O -> O2 + 2HF
    Reaction_OF2_H2O__O2_2HF: function() {
      return new Reaction(
        [ new Substance( 1, RPALSymbols.OF2, new OF2Node( MOLECULE_OPTIONS ) ),
          new Substance( 1, RPALSymbols.H2O, new H2ONode( MOLECULE_OPTIONS ) ) ],
        [ new Substance( 1, RPALSymbols.O2, new O2Node( MOLECULE_OPTIONS ) ),
          new Substance( 2, RPALSymbols.HF, new HFNode( MOLECULE_OPTIONS ) ) ] );
    }
  };

  return reactantsProductsAndLeftovers.register( 'ReactionFactory', ReactionFactory );
} );