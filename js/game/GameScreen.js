// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Shape } from '../../../kite/js/imports.js';
import FaceNode from '../../../scenery-phet/js/FaceNode.js';
import { HBox, Node, Path, Rectangle, VBox } from '../../../scenery/js/imports.js';
import RPALColors from '../common/RPALColors.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../ReactantsProductsAndLeftoversStrings.js';
import GameModel from './model/GameModel.js';
import GameScreenView from './view/GameScreenView.js';

export default class GameScreen extends Screen {

  constructor( tandem ) {

    const options = {
      name: ReactantsProductsAndLeftoversStrings.screen.gameStringProperty,
      backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
      homeScreenIcon: createIcon(),
      tandem: tandem
    };

    super(
      () => new GameModel( tandem.createTandem( 'model' ) ),
      model => new GameScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen, a smiley face with up/down arrows.
 * @returns {ScreenIcon}
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
  const arrowsBox = new VBox( {
    children: [ upArrowNode, downArrowNode ],
    spacing: 20
  } );

  // centered in background, scaled to fit
  const contentNode = new HBox( {
    children: [ arrowsBox, faceNode ],
    spacing: 25
  } );
  contentNode.setScaleMagnitude(
    Math.min( 0.82 * background.width / contentNode.width, 0.82 * background.height / contentNode.height ) );
  contentNode.center = background.center;

  const iconNode = new Node( { children: [ background, contentNode ] } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

reactantsProductsAndLeftovers.register( 'GameScreen', GameScreen );