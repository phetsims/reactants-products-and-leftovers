// Copyright 2014-2019, University of Colorado Boulder

/**
 * 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const GameModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GameModel' );
  const GameScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/GameScreenView' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const Screen = require( 'JOIST/Screen' );
  const Shape = require( 'KITE/Shape' );

  // strings
  const screenGameString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.game' );

  // a11y strings
  const screenGameDescription = 'Test your knowledge!';

  class GameScreen extends Screen {

    constructor() {

      const options = {
        name: screenGameString,
        backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
        homeScreenIcon: createIcon(),
        descriptionContent: screenGameDescription
      };

      super(
        () => new GameModel(),
        model => new GameScreenView( model ),
        options
      );
    }
  }

  /**
   * Creates the icon for this screen, a smiley face with up/down arrows.
   * @returns {Node}
   */
  function createIcon() {

    // background rectangle
    const background = new Rectangle( 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height,
      { fill: 'white' } );

    // smiley face
    const faceNode = new FaceNode( 200, { headStroke: 'black', headLineWidth: 4 } );

    // up/down arrows
    const ARROW_OPTIONS = { fill: 'black' };
    const ARROW_SIZE = 0.4 * faceNode.height;
    const upArrowNode = new Path( new Shape()
        // clockwise from tip
        .moveTo( 0, 0 )
        .lineTo( ARROW_SIZE / 2, ARROW_SIZE )
        .lineTo( -ARROW_SIZE / 2, ARROW_SIZE )
        .close(),
      ARROW_OPTIONS );
    const downArrowNode = new Path( new Shape()
        // clockwise from tip
        .moveTo( 0, 0 )
        .lineTo( -ARROW_SIZE / 2, -ARROW_SIZE )
        .lineTo( ARROW_SIZE / 2, -ARROW_SIZE )
        .close(),
      ARROW_OPTIONS );
    const arrowsBox = new LayoutBox( {
      children: [ upArrowNode, downArrowNode ],
      orientation: 'vertical',
      spacing: 20
    } );

    // centered in background, scaled to fit
    const contentNode = new LayoutBox( {
      children: [ arrowsBox, faceNode ],
      orientation: 'horizontal',
      spacing: 25
    } );
    contentNode.setScaleMagnitude(
      Math.min( 0.82 * background.width / contentNode.width, 0.82 * background.height / contentNode.height ) );
    contentNode.center = background.center;

    return new Node( { children: [ background, contentNode ] } );
  }

  return reactantsProductsAndLeftovers.register( 'GameScreen', GameScreen );
} );