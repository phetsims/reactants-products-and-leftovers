// Copyright 2014-2024, University of Colorado Boulder

/**
 * SettingsNode is responsible for the view that corresponds to GamePhase.SETTINGS.
 * It displays the controls used to configure the game (level selection, timer toggle button,...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimerToggleButton from '../../../../scenery-phet/js/buttons/TimerToggleButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { ManualConstraint, Text, VBox } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALQueryParameters from '../../common/RPALQueryParameters.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import ChallengeFactory from '../model/ChallengeFactory.js';
import GameModel from '../model/GameModel.js';
import GamePhase from '../model/GamePhase.js';
import GamePhaseNode from './GamePhaseNode.js';
import GameVisibilityPanel from './GameVisibilityPanel.js';
import RPALLevelSelectionButtonGroup from './RPALLevelSelectionButtonGroup.js';

const SCREEN_X_MARGIN = 40;
const SCREEN_Y_MARGIN = 40;

export default class SettingsNode extends GamePhaseNode {

  public constructor( model: GameModel, layoutBounds: Bounds2, tandem: Tandem ) {

    // Title
    const titleText = new Text( ReactantsProductsAndLeftoversStrings.chooseYourLevelStringProperty, {
      font: new PhetFont( 40 ),
      maxWidth: 0.75 * layoutBounds.width
    } );

    // Group of LevelSelectionButtons
    const levelSelectionButtonGroup = new RPALLevelSelectionButtonGroup( model, tandem.createTandem( 'levelSelectionButtonGroup' ) );

    const titleAndButtonsParent = new VBox( {
      children: [ titleText, levelSelectionButtonGroup ],
      align: 'center',
      spacing: 60
    } );

    // Timer toggle button, at bottom left
    const timerToggleButton = new TimerToggleButton( model.timerEnabledProperty, {
      stroke: 'gray',
      left: layoutBounds.left + SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN,
      tandem: tandem.createTandem( 'timerToggleButton' )
    } );

    // Panel with visibility radio buttons, at bottom center
    const gameVisibilityPanel = new GameVisibilityPanel( model.gameVisibilityProperty, tandem.createTandem( 'gameVisibilityPanel' ) );
    gameVisibilityPanel.boundsProperty.link( bounds => {
      gameVisibilityPanel.centerX = layoutBounds.centerX;
      gameVisibilityPanel.bottom = layoutBounds.bottom - SCREEN_Y_MARGIN;
    } );

    // Reset All button, at bottom right
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
      },
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      right: layoutBounds.right - SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    super( GamePhase.SETTINGS, model.gamePhaseProperty, {
      children: [
        titleAndButtonsParent,
        gameVisibilityPanel,
        timerToggleButton,
        resetAllButton
      ],
      tandem: tandem
    } );

    ManualConstraint.create( this, [ titleAndButtonsParent, gameVisibilityPanel ], ( titleAndButtonsParentProxy, gameVisibilityPanelProxy ) => {
      titleAndButtonsParentProxy.centerX = layoutBounds.centerX;

      // TODO: Replace isFinite() check with better support for Panel with invisible content, https://github.com/phetsims/phet-io/issues/2003
      if ( gameVisibilityPanelProxy.bounds.isFinite() ) { // Hiding all children with PhET-iO should not cause a layout error, see https://github.com/phetsims/phet-io/issues/2003
        titleAndButtonsParentProxy.centerY = ( gameVisibilityPanelProxy.top - layoutBounds.top + SCREEN_Y_MARGIN ) / 2;
      }
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
}

reactantsProductsAndLeftovers.register( 'SettingsNode', SettingsNode );