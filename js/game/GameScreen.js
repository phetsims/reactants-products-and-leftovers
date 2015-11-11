// Copyright 2014-2015, University of Colorado Boulder

/**
 * 'Game' screen
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
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var Screen = require( 'JOIST/Screen' );
  var Shape = require( 'KITE/Shape' );

  // strings
  var screenGameString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.game' );

  /**
   * @constructor
   */
  function GameScreen() {
    Screen.call( this, screenGameString,
      createIcon(),
      function() { return new GameModel(); },
      function( model ) { return new GameView( model ); },
      { backgroundColor: RPALColors.SCREEN_BACKGROUND }
    );
  }

  reactantsProductsAndLeftovers.register( 'GameScreen', GameScreen );

  /**
   * Creates the icon for this screen, a smiley face with up/down arrows.
   * @returns {Node}
   */
  var createIcon = function() {

    // background rectangle
    var background = new Rectangle( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height,
      { fill: 'white' } );

    // smiley face
    var faceNode = new FaceNode( 200, { headStroke: 'black', headLineWidth: 4 } );

    // up/down arrows
    var ARROW_OPTIONS = { fill: 'black' };
    var ARROW_SIZE = 0.4 * faceNode.height;
    var upArrowNode = new Path( new Shape()
        // clockwise from tip
        .moveTo( 0, 0 )
        .lineTo( ARROW_SIZE / 2, ARROW_SIZE )
        .lineTo( -ARROW_SIZE / 2, ARROW_SIZE )
        .close(),
      ARROW_OPTIONS );
    var downArrowNode = new Path( new Shape()
        // clockwise from tip
        .moveTo( 0, 0 )
        .lineTo( -ARROW_SIZE / 2, -ARROW_SIZE )
        .lineTo( ARROW_SIZE / 2, -ARROW_SIZE )
        .close(),
      ARROW_OPTIONS );
    var arrowsBox = new LayoutBox( {
      children: [ upArrowNode, downArrowNode ],
      orientation: 'vertical',
      spacing: 20
    } );

    // centered in background, scaled to fit
    var contentNode = new LayoutBox( {
      children: [ arrowsBox, faceNode ],
      orientation: 'horizontal',
      spacing: 25
    } );
    contentNode.setScaleMagnitude(
      Math.min( 0.82 * background.width / contentNode.width, 0.82 * background.height / contentNode.height ) );
    contentNode.center = background.center;

    return new Node( { children: [ background, contentNode ] } );
  };

  return inherit( Screen, GameScreen );
} );