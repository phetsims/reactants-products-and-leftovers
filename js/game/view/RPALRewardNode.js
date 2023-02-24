// Copyright 2014-2023, University of Colorado Boulder

/**
 * The reward that is displayed when a game is completed with a perfect score.
 * Various images (based on game level) move from top to bottom in the play area.
 * Run with the 'reward' query parameter to show the reward at the end of every game, regardless of score.
 *
 * Here's what you'll see at each level:
 *
 * Level 1 = molecules
 * Level 2 = smiley faces
 * Level 3 = sandwiches
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
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import RewardNode from '../../../../vegas/js/RewardNode.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SandwichNode from '../../sandwiches/view/SandwichNode.js';

// constants
const NUMBER_OF_NODES = 100;
const FACE_COLORS = [ 'yellow', 'rgb(255,85,0)', 'orange', 'magenta', 'cyan', 'rgb(100,255,100)' ];

// constructors for all atoms & molecules that appear in reactions, to appear in Level 1 reward
const MOLECULE_NODE_CONSTRUCTORS = [
  C2H2Node, C2H4Node, C2H5ClNode, C2H5OHNode, C2H6Node, CH2ONode,
  CH3OHNode, CH4Node, Cl2Node, CNode, CO2Node, CONode, CS2Node,
  F2Node,
  H2Node, H2ONode, H2SNode, HClNode, HFNode,
  N2Node, N2ONode, NH3Node, NO2Node, NONode,
  O2Node, OF2Node,
  P4Node, PCl3Node, PCl5Node, PF3Node, PH3Node,
  SNode, SO2Node, SO3Node
];

export default class RPALRewardNode extends RewardNode {

  /**
   * @param {number} level game level, starting at zero
   */
  constructor( level ) {
    assert && assert( level >= 0 && level < nodeFactoryFunctions.length );
    super( { nodes: nodeFactoryFunctions[ level ]() } );
  }
}

// Level 1: molecules, @returns {Node[]}
function createNodesLevel1() {
  const nodes = [];
  MOLECULE_NODE_CONSTRUCTORS.forEach( MoleculeNodeConstructor => nodes.push( new MoleculeNodeConstructor() ) );
  return RewardNode.createRandomNodes( nodes, NUMBER_OF_NODES );
}

// Level 2: smiley faces (various colors), @returns {Node[]}
function createNodesLevel2() {
  const nodes = [];
  FACE_COLORS.forEach( color => {
    nodes.push( new FaceNode( 40, { headFill: color } ) );
  } );
  return RewardNode.createRandomNodes( nodes, NUMBER_OF_NODES );
}

// Level 3: sandwiches, @returns {Node[]}
function createNodesLevel3() {
  const nodes = [
    // args: bread, meat, cheese
    new SandwichNode( 3, 3, 3 ),
    new SandwichNode( 2, 1, 2 ),
    new SandwichNode( 1, 1, 1 ),
    new SandwichNode( 2, 3, 3 ),
    new SandwichNode( 0, 2, 0 ),
    new SandwichNode( 0, 0, 2 )
  ];
  return RewardNode.createRandomNodes( nodes, NUMBER_OF_NODES );
}

/*
 * Functions for creating nodes, indexed by level.
 * In the model, level starts at zero. In the view, it's presented as starting from 1.
 * The function names correspond to the view presentation.
 */
const nodeFactoryFunctions = [
  createNodesLevel1,
  createNodesLevel2,
  createNodesLevel3
];

reactantsProductsAndLeftovers.register( 'RPALRewardNode', RPALRewardNode );