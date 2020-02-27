// Copyright 2014-2020, University of Colorado Boulder

/**
 * The molecule nodes used in this simulation.
 * They are created once, then reused throughout Scenery's DAG.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import C2H2Node from '../../../../nitroglycerin/js/nodes/C2H2Node.js';
import C2H4Node from '../../../../nitroglycerin/js/nodes/C2H4Node.js';
import C2H5ClNode from '../../../../nitroglycerin/js/nodes/C2H5ClNode.js';
import C2H5OHNode from '../../../../nitroglycerin/js/nodes/C2H5OHNode.js';
import C2H6Node from '../../../../nitroglycerin/js/nodes/C2H6Node.js';
import CH2ONode from '../../../../nitroglycerin/js/nodes/CH2ONode.js';
import CH3OHNode from '../../../../nitroglycerin/js/nodes/CH3OHNode.js';
import CH4Node from '../../../../nitroglycerin/js/nodes/CH4Node.js';
import Cl2Node from '../../../../nitroglycerin/js/nodes/Cl2Node.js';
import CNode from '../../../../nitroglycerin/js/nodes/CNode.js';
import CO2Node from '../../../../nitroglycerin/js/nodes/CO2Node.js';
import CONode from '../../../../nitroglycerin/js/nodes/CONode.js';
import CS2Node from '../../../../nitroglycerin/js/nodes/CS2Node.js';
import F2Node from '../../../../nitroglycerin/js/nodes/F2Node.js';
import H2Node from '../../../../nitroglycerin/js/nodes/H2Node.js';
import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import H2SNode from '../../../../nitroglycerin/js/nodes/H2SNode.js';
import HClNode from '../../../../nitroglycerin/js/nodes/HClNode.js';
import HFNode from '../../../../nitroglycerin/js/nodes/HFNode.js';
import N2Node from '../../../../nitroglycerin/js/nodes/N2Node.js';
import N2ONode from '../../../../nitroglycerin/js/nodes/N2ONode.js';
import NH3Node from '../../../../nitroglycerin/js/nodes/NH3Node.js';
import NO2Node from '../../../../nitroglycerin/js/nodes/NO2Node.js';
import NONode from '../../../../nitroglycerin/js/nodes/NONode.js';
import O2Node from '../../../../nitroglycerin/js/nodes/O2Node.js';
import OF2Node from '../../../../nitroglycerin/js/nodes/OF2Node.js';
import P4Node from '../../../../nitroglycerin/js/nodes/P4Node.js';
import PCl3Node from '../../../../nitroglycerin/js/nodes/PCl3Node.js';
import PCl5Node from '../../../../nitroglycerin/js/nodes/PCl5Node.js';
import PF3Node from '../../../../nitroglycerin/js/nodes/PF3Node.js';
import PH3Node from '../../../../nitroglycerin/js/nodes/PH3Node.js';
import SNode from '../../../../nitroglycerin/js/nodes/SNode.js';
import SO2Node from '../../../../nitroglycerin/js/nodes/SO2Node.js';
import SO3Node from '../../../../nitroglycerin/js/nodes/SO3Node.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

// modules (molecules)

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

reactantsProductsAndLeftovers.register( 'MoleculeNodes', MoleculeNodes );
export default MoleculeNodes;