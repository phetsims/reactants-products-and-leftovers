// Copyright 2002-2014, University of Colorado Boulder

/**
 * The molecule nodes used in this simulation.
 * They are created once, then reused throughout Scenery's DAG.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var C2H2Node = require( 'NITROGLYCERIN/nodes/C2H2Node' );
  var C2H4Node = require( 'NITROGLYCERIN/nodes/C2H4Node' );
  var C2H5ClNode = require( 'NITROGLYCERIN/nodes/C2H5ClNode' );
  var C2H5OHNode = require( 'NITROGLYCERIN/nodes/C2H5OHNode' );
  var C2H6Node = require( 'NITROGLYCERIN/nodes/C2H6Node' );
  var CH2ONode = require( 'NITROGLYCERIN/nodes/CH2ONode' );
  var CH3OHNode = require( 'NITROGLYCERIN/nodes/CH3OHNode' );
  var CH4Node = require( 'NITROGLYCERIN/nodes/CH4Node' );
  var Cl2Node = require( 'NITROGLYCERIN/nodes/Cl2Node' );
  var CNode = require( 'NITROGLYCERIN/nodes/CNode' );
  var CO2Node = require( 'NITROGLYCERIN/nodes/CO2Node' );
  var CONode = require( 'NITROGLYCERIN/nodes/CONode' );
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
  var NO2Node = require( 'NITROGLYCERIN/nodes/NO2Node' );
  var NONode = require( 'NITROGLYCERIN/nodes/NONode' );
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
  var MOLECULE_OPTIONS = { atomOptions: { stroke: 'black', lineWidth: 0.5, scale: 1 } };

  var MoleculeNodes = {
    C2H2: new C2H2Node( MOLECULE_OPTIONS ),
    C2H4: new C2H4Node( MOLECULE_OPTIONS ),
    C2H5Cl: new C2H5ClNode( MOLECULE_OPTIONS ),
    C2H5OH: new C2H5OHNode( MOLECULE_OPTIONS ),
    C2H6: new C2H6Node( MOLECULE_OPTIONS ),
    CH2O: new CH2ONode( MOLECULE_OPTIONS ),
    CH3OH: new CH3OHNode( MOLECULE_OPTIONS ),
    CH4: new CH4Node( MOLECULE_OPTIONS ),
    Cl2: new Cl2Node( MOLECULE_OPTIONS ),
    C: new CNode( MOLECULE_OPTIONS ),
    CO2: new CO2Node( MOLECULE_OPTIONS ),
    CO: new CONode( MOLECULE_OPTIONS ),
    CS2: new CS2Node( MOLECULE_OPTIONS ),
    F2: new F2Node( MOLECULE_OPTIONS ),
    H2: new H2Node( MOLECULE_OPTIONS ),
    H2O: new H2ONode( MOLECULE_OPTIONS ),
    H2S: new H2SNode( MOLECULE_OPTIONS ),
    HCl: new HClNode( MOLECULE_OPTIONS ),
    HF: new HFNode( MOLECULE_OPTIONS ),
    N2: new N2Node( MOLECULE_OPTIONS ),
    N2O: new N2ONode( MOLECULE_OPTIONS ),
    NH3: new NH3Node( MOLECULE_OPTIONS ),
    NO2: new NO2Node( MOLECULE_OPTIONS ),
    NO: new NONode( MOLECULE_OPTIONS ),
    O2: new O2Node( MOLECULE_OPTIONS ),
    OF2: new OF2Node( MOLECULE_OPTIONS ),
    P4: new P4Node( MOLECULE_OPTIONS ),
    PCl3: new PCl3Node( MOLECULE_OPTIONS ),
    PCl5: new PCl5Node( MOLECULE_OPTIONS ),
    PF3: new PF3Node( MOLECULE_OPTIONS ),
    PH3: new PH3Node( MOLECULE_OPTIONS ),
    S: new SNode( MOLECULE_OPTIONS ),
    SO2: new SO2Node( MOLECULE_OPTIONS ),
    SO3: new SO3Node( MOLECULE_OPTIONS )
  };

  return MoleculeNodes;
} );