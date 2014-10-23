// Copyright 2002-2014, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RewardNode = require( 'VEGAS/RewardNode' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );

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
  var NUMBER_OF_NODES = 100;

  /**
   * @param level game level, starting at zero
   * @constructor
   */
  function RPALRewardNode( level ) {
    assert && assert( level >= 0 && level < nodeFactoryFunctions.length );
    RewardNode.call( this, { nodes: nodeFactoryFunctions[level]() } );
  }

  // Level 1: molecules
  var createNodesLevel1 = function() {
    var nodes = [
          new CNode(), new C2H2Node(), new C2H4Node(), new C2H5ClNode(), new C2H5OHNode(), new C2H6Node(),
          new CH2ONode(), new CH3OHNode(), new CH4Node(), new Cl2Node(), new CONode(), new CO2Node(), new CS2Node(),
          new F2Node(), new H2Node(), new H2ONode(), new H2SNode(), new HClNode(), new HFNode(), new N2Node(),
          new N2ONode(), new NH3Node(), new NONode(), new NO2Node(), new O2Node(), new OF2Node(), new P4Node(),
          new PCl3Node(), new PCl5Node(), new PF3Node(), new PH3Node(), new SNode(), new SO2Node(), new SO3Node()
        ];
    return RewardNode.createRandomNodes( nodes, NUMBER_OF_NODES );
  };

  // Level 2: smiley faces (various colors)
  var createNodesLevel2 = function() {
    var nodes = [];
    var colors = [ 'yellow', 'rgb(255,85,0)', 'orange', 'magenta', 'cyan', 'rgb(100,255,100)' ];
    colors.forEach( function( color ) {
        nodes.push( new FaceNode( 40, { headFill: color }  ) );
    } );
    return RewardNode.createRandomNodes( nodes, NUMBER_OF_NODES );
  };

  // Level 3: sandwiches
  var createNodesLevel3 = function() {
    var nodes = [
      // args: bread, meat, cheese
      new SandwichNode( 3, 3, 3 ),
      new SandwichNode( 2, 1, 2 ),
      new SandwichNode( 1, 1, 1 ),
      new SandwichNode( 2, 3, 3 ),
      new SandwichNode( 0, 2, 0 ),
      new SandwichNode( 0, 0, 2 )
    ];
    return RewardNode.createRandomNodes( nodes, NUMBER_OF_NODES );
  };

  /*
   * Functions for creating nodes, indexed by level.
   * In the model, level starts at zero. In the view, it's presented as starting from 1.
   * The function names correspond to the view presentation.
   */
  var nodeFactoryFunctions = [
    createNodesLevel1,
    createNodesLevel2,
    createNodesLevel3
  ];

  return inherit( RewardNode, RPALRewardNode );
} );
