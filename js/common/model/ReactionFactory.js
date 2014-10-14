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
          new Reactant( 1, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) )
        ],
        [ new Product( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ) ],
        { name: makeWaterString } );
    },

    // N2 + 3H2 -> 2NH3 (Make Ammonia)
    makeAmmonia: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.N2, new N2Node( ATOM_OPTIONS ) ),
          new Reactant( 3, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) )
        ],
        [ new Product( 2, RPALSymbols.NH3, new NH3Node( ATOM_OPTIONS ) ) ],
        { name: makeAmmoniaString } );
    },

    // H2 + F2 -> 2HF
    H2_F2__2HF: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.F2, new F2Node( ATOM_OPTIONS ) )
        ],
        [ new Product( 2, RPALSymbols.HF, new HFNode( ATOM_OPTIONS ) ) ] );
    },

    // H2 + Cl2 -> 2HCl
    H2_Cl2__2HCl: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ),
          new Reactant( 1, RPALSymbols.Cl2, new Cl2Node( ATOM_OPTIONS ) )
        ],
        [ new Product( 2, RPALSymbols.HCl, new HClNode( ATOM_OPTIONS ) ) ] );
    },

    //TODO add additional reactions from java.OneProductReactions

    //---------------------------------------------------------------------------------------
    // Two-product reactions
    //---------------------------------------------------------------------------------------

    // CH4 + 2 O2 -> CO2 + 2 H2O (Combust Methane)
    combustMethane: function() {
      return new Reaction(
        [ new Reactant( 1, RPALSymbols.CH4, new CH4Node( ATOM_OPTIONS ) ),
          new Reactant( 2, RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) )
        ],
        [ new Product( 1, RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ),
          new Product( 2, RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) )
        ],
        { name: combustMethaneString } );
    }

    //TODO add additional reactions from java.TwoProductReactions
  };
} );