// Copyright 2014-2023, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.SETTINGS.
 * Displays a panel with controls used to configure a game (level selection, timer, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimerToggleButton from '../../../../scenery-phet/js/buttons/TimerToggleButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALQueryParameters from '../../common/RPALQueryParameters.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import ChallengeFactory from '../model/ChallengeFactory.js';
import GameModel from '../model/GameModel.js';
import RPALLevelSelectionButtonGroup from './RPALLevelSelectionButtonGroup.js';
import GameVisibilityPanel from './GameVisibilityPanel.js';
import Multilink from '../../../../axon/js/Multilink.js';

const SCREEN_X_MARGIN = 40;
const SCREEN_Y_MARGIN = 40;

export default class SettingsNode extends Node {

  public constructor( model: GameModel, layoutBounds: Bounds2, tandem: Tandem ) {

    // Title
    const title = new Text( ReactantsProductsAndLeftoversStrings.chooseYourLevelStringProperty, {
      font: new PhetFont( 40 ),
      maxWidth: 0.75 * layoutBounds.width // constrain width for i18n
    } );

    // Group of LevelSelectionButtons
    const levelSelectionButtonGroup = new RPALLevelSelectionButtonGroup( model );

    const titleAndButtonsParent = new VBox( {
      children: [ title, levelSelectionButtonGroup ],
      align: 'center',
      spacing: 60
    } );

    // Timer toggle button, at bottom left
    const timerToggleButton = new TimerToggleButton( model.timerEnabledProperty, {
      stroke: 'gray',
      left: layoutBounds.left + SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    // Panel with visibility radio buttons, at bottom center
    const gameVisibilityPanel = new GameVisibilityPanel( model.gameVisibilityProperty );
    gameVisibilityPanel.boundsProperty.link( bounds => {
      gameVisibilityPanel.centerX = layoutBounds.centerX;
      gameVisibilityPanel.bottom = layoutBounds.bottom - SCREEN_Y_MARGIN;
    } );

    Multilink.multilink( [ titleAndButtonsParent.boundsProperty, gameVisibilityPanel.boundsProperty ],
      () => {
        titleAndButtonsParent.centerX = layoutBounds.centerX;
        titleAndButtonsParent.centerY = ( gameVisibilityPanel.top - layoutBounds.top + SCREEN_Y_MARGIN ) / 2;
      } );

    // Reset All button, at bottom right
    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      right: layoutBounds.right - SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    super( {
      children: [
        titleAndButtonsParent,
        gameVisibilityPanel,
        timerToggleButton,
        resetAllButton
      ],
      tandem: tandem
    } );

    // 'Test' button at top right, runs a sanity test on the challenge generator
    if ( phet.chipper.queryParameters.showAnswers && !RPALQueryParameters.playAll ) {
      const testButton = new TextPushButton( 'Test', {
        font: new PhetFont( 10 ),
        baseColor: 'red',
        textFill: 'white',
        right: layoutBounds.right - 10,
        top: layoutBounds.top + 10
      } );
      testButton.addListener( () => ChallengeFactory.test() );
      this.addChild( testButton );
    }
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'SettingsNode', SettingsNode );