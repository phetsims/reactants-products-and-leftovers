// Copyright 2014-2023, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.SETTINGS.
 * Displays a panel with controls used to configure a game (level selection, timer, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimerToggleButton from '../../../../scenery-phet/js/buttons/TimerToggleButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALQueryParameters from '../../common/RPALQueryParameters.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import ChallengeFactory from '../model/ChallengeFactory.js';
import RPALLevelSelectionButtonGroup from './RPALLevelSelectionButtonGroup.js';
import VisibilityPanel from './VisibilityPanel.js';

// constants
const SCREEN_X_MARGIN = 40;
const SCREEN_Y_MARGIN = 40;

export default class SettingsNode extends Node {

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds the {Screen}'s layoutBounds
   * @param {Object} [options]
   */
  constructor( model, layoutBounds, options ) {

    options = options || {};

    // Title
    const title = new Text( ReactantsProductsAndLeftoversStrings.chooseYourLevelStringProperty, {
      font: new PhetFont( 40 ),
      maxWidth: 0.75 * layoutBounds.width // constrain width for i18n
    } );

    // Group of LevelSelectionButtons
    const levelSelectionButtonGroup = new RPALLevelSelectionButtonGroup( model, {
      center: layoutBounds.center
    } );

    // Timer toggle button, at bottom left
    const timerToggleButton = new TimerToggleButton( model.timerEnabledProperty, {
      stroke: 'gray',
      left: layoutBounds.left + SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    // Panel with visibility radio buttons, at bottom center
    const visibilityPanel = new VisibilityPanel( model.gameVisibiltyProperty, {
      maxWidth: 0.65 * layoutBounds.width // constrain width for i18n
    } );
    visibilityPanel.boundsProperty.link( bounds => {
      visibilityPanel.centerX = layoutBounds.centerX;
      visibilityPanel.bottom = layoutBounds.bottom - SCREEN_Y_MARGIN;
    } );

    // Reset All button, at bottom right
    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      right: layoutBounds.right - SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    options.children = [
      // title and level-selection buttons, centered in space above visibility radio buttons
      new VBox( {
        children: [ title, levelSelectionButtonGroup ],
        align: 'center',
        spacing: 40,
        centerX: layoutBounds.centerX,
        centerY: ( visibilityPanel.top - layoutBounds.top ) / 2
      } ),
      timerToggleButton,
      visibilityPanel,
      resetAllButton
    ];
    super( options );

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