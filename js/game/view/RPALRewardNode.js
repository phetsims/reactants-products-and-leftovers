// Copyright 2014-2020, University of Colorado Boulder

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

import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import RewardNode from '../../../../vegas/js/RewardNode.js';
import ReactionFactory from '../../common/model/ReactionFactory.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SandwichNode from '../../sandwiches/view/SandwichNode.js';

// constants
const NUMBER_OF_NODES = 100;
const FACE_COLORS = [ 'yellow', 'rgb(255,85,0)', 'orange', 'magenta', 'cyan', 'rgb(100,255,100)' ];

class RPALRewardNode extends RewardNode {

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
  ReactionFactory.moleculeNodeConstructors.forEach( function( MoleculeNodeConstructor ) {
    nodes.push( new MoleculeNodeConstructor() );
  } );
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
export default RPALRewardNode;