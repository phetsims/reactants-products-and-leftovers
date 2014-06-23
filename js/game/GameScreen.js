// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Game' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var GameModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GameModel' );
  var GameView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/GameView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var Screen = require( 'JOIST/SCREEN' );
  var Shape = require( 'KITE/Shape' );

  // strings
  var gameString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.game' );

  //TODO this is identical to balancing-act.GameScreen, standardize?
  // creates the icon for this screen
  var createIcon = function() {

    // constants
    var faceDiameter = 200;
    var arrowXSpacing = 25;
    var arrowYSpacing = 10;

    // background rectangle
    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

    // face
    var faceNode = new FaceNode( faceDiameter, { headStroke: 'black', headLineWidth: 4 } );

    // up/down arrows
    var arrowOptions = { fill: 'black' };
    var arrowSize = 0.4 * ( faceNode.height - arrowYSpacing );
    var upArrowNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize / 2, arrowSize ).lineTo( -arrowSize / 2, arrowSize ).close(), arrowOptions );
    var downArrowNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize / 2, -arrowSize ).lineTo( -arrowSize / 2, -arrowSize ).close(), arrowOptions );

    // layout, arrows to left of face
    upArrowNode.right = faceNode.left - arrowXSpacing;
    upArrowNode.bottom = faceNode.centerY - arrowYSpacing;
    downArrowNode.right = faceNode.left - arrowXSpacing;
    downArrowNode.top = faceNode.centerY + arrowYSpacing;

    // scale to fit, center in background
    var contentNode = new Node( { children: [ faceNode, upArrowNode, downArrowNode ] } );
    contentNode.setScaleMagnitude( Math.min( 0.82 * background.width / contentNode.width, 0.82 * background.height / contentNode.height ) );
    contentNode.center = background.center;
    return new Node( { children: [ background, contentNode ] } );
  };

  function GameScreen() {
    Screen.call( this, gameString,
      createIcon(),
      function() { return new GameModel(); },
      function( model ) { return new GameView( model ); },
      { backgroundColor: RPALColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, GameScreen );
} );