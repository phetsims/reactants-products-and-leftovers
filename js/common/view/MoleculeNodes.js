// Copyright 2014-2020, University of Colorado Boulder

/**
 * The molecule nodes used in this simulation.
 * They are created once, then reused throughout Scenery's DAG.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  // modules (molecules)
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

  // constants
  const MOLECULE_OPTIONS = { atomOptions: { stroke: 'black', lineWidth: 0.5, scale: 1 } };

  const MoleculeNodes = {
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

  return reactantsProductsAndLeftovers.register( 'MoleculeNodes', MoleculeNodes );
} );