// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory functions for creating specific types of molecules.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Molecule = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Molecule' );
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

  // constants
  var ATOM_OPTIONS = { stroke: 'black', lineWidth:  0.5, scale: 1 };

  return {
    C: function() { return new Molecule( RPALSymbols.C, new CNode( ATOM_OPTIONS ) ); },
    C2H2: function() { return new Molecule( RPALSymbols.C2H2, new C2H2Node( ATOM_OPTIONS ) ); },
    C2H4: function() { return new Molecule( RPALSymbols.C2H4, new C2H4Node( ATOM_OPTIONS ) ); },
    C2H5Cl: function() { return new Molecule( RPALSymbols.C2H5Cl, new C2H5ClNode( ATOM_OPTIONS ) ); },
    C2H5OH: function() { return new Molecule( RPALSymbols.C2H5OH, new C2H5OHNode( ATOM_OPTIONS ) ); },
    C2H6: function() { return new Molecule( RPALSymbols.C2H6, new C2H6Node( ATOM_OPTIONS ) ); },
    CH2O: function() { return new Molecule( RPALSymbols.CH2O, new CH2ONode( ATOM_OPTIONS ) ); },
    CH3OH: function() { return new Molecule( RPALSymbols.CH3OH, new CH3OHNode( ATOM_OPTIONS ) ); },
    CH4: function() { return new Molecule( RPALSymbols.CH4, new CH4Node( ATOM_OPTIONS ) ); },
    Cl2: function() { return new Molecule( RPALSymbols.Cl2, new Cl2Node( ATOM_OPTIONS ) ); },
    CO: function() { return new Molecule( RPALSymbols.CO, new CONode( ATOM_OPTIONS ) ); },
    CO2: function() { return new Molecule( RPALSymbols.CO2, new CO2Node( ATOM_OPTIONS ) ); },
    CS2: function() { return new Molecule( RPALSymbols.CS2, new CS2Node( ATOM_OPTIONS ) ); },
    F2: function() { return new Molecule( RPALSymbols.F2, new F2Node( ATOM_OPTIONS ) ); },
    H2: function() { return new Molecule( RPALSymbols.H2, new H2Node( ATOM_OPTIONS ) ); },
    H2O: function() { return new Molecule( RPALSymbols.H2O, new H2ONode( ATOM_OPTIONS ) ); },
    H2S: function() { return new Molecule( RPALSymbols.H2S, new H2SNode( ATOM_OPTIONS ) ); },
    HCl: function() { return new Molecule( RPALSymbols.HCl, new HClNode( ATOM_OPTIONS ) ); },
    HF: function() { return new Molecule( RPALSymbols.HF, new HFNode( ATOM_OPTIONS ) ); },
    N2: function() { return new Molecule( RPALSymbols.N2, new N2Node( ATOM_OPTIONS ) ); },
    N2O: function() { return new Molecule( RPALSymbols.N2O, new N2ONode( ATOM_OPTIONS ) ); },
    NH3: function() { return new Molecule( RPALSymbols.NH3, new NH3Node( ATOM_OPTIONS ) ); },
    NO: function() { return new Molecule( RPALSymbols.NO, new NONode( ATOM_OPTIONS ) ); },
    NO2: function() { return new Molecule( RPALSymbols.NO2, new NO2Node( ATOM_OPTIONS ) ); },
    O2: function() { return new Molecule( RPALSymbols.O2, new O2Node( ATOM_OPTIONS ) ); },
    OF2: function() { return new Molecule( RPALSymbols.OF2, new OF2Node( ATOM_OPTIONS ) ); },
    P4: function() { return new Molecule( RPALSymbols.P4, new P4Node( ATOM_OPTIONS ) ); },
    PCl3: function() { return new Molecule( RPALSymbols.PCl3, new PCl3Node( ATOM_OPTIONS ) ); },
    PCl5: function() { return new Molecule( RPALSymbols.PCl5, new PCl5Node( ATOM_OPTIONS ) ); },
    PF3: function() { return new Molecule( RPALSymbols.PF3, new PF3Node( ATOM_OPTIONS ) ); },
    PH3: function() { return new Molecule( RPALSymbols.PH3, new PH3Node( ATOM_OPTIONS ) ); },
    S: function() { return new Molecule( RPALSymbols.S, new SNode( ATOM_OPTIONS ) ); },
    SO2: function() { return new Molecule( RPALSymbols.SO2, new SO2Node( ATOM_OPTIONS ) ); },
    SO3: function() { return new Molecule( RPALSymbols.SO3, new SO3Node( ATOM_OPTIONS ) ); },
  };
} );
