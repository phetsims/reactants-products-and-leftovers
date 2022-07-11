// Copyright 2014-2022, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.SETTINGS.
 * Displays a panel with controls used to configure a game (level selection, timer, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import HClNode from '../../../../nitroglycerin/js/nodes/HClNode.js';
import NH3Node from '../../../../nitroglycerin/js/nodes/NH3Node.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimerToggleButton from '../../../../scenery-phet/js/buttons/TimerToggleButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import LevelSelectionButtonGroup from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../../../../vegas/js/ScoreDisplayStars.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALQueryParameters from '../../common/RPALQueryParameters.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import reactantsProductsAndLeftoversStrings from '../../reactantsProductsAndLeftoversStrings.js';
import ChallengeFactory from '../model/ChallengeFactory.js';
import VisibilityPanel from './VisibilityPanel.js';

// constants
const SCREEN_X_MARGIN = 40;
const SCREEN_Y_MARGIN = 40;
const QUESTION_MARK_OPTIONS = { font: new PhetFont( { size: 70, weight: 'bold' } ) };
const MOLECULE_SCALE = 3; // scale of the molecule icons used on the level-selection buttons

class SettingsNode extends Node {

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds the {Screen}'s layoutBounds
   * @param {Object} [options]
   */
  constructor( model, layoutBounds, options ) {

    options = options || {};

    // Title
    const title = new Text( reactantsProductsAndLeftoversStrings.chooseYourLevel, {
      font: new PhetFont( 40 ),
      maxWidth: 0.75 * layoutBounds.width // constrain width for i18n
    } );

    // To make all button icons have the same effective size
    const iconAlignGroup = new AlignGroup();

    // Icons for the level-selection buttons, indexed by level
    const levelIcons = [
      createLevelOneIcon( iconAlignGroup ),
      createLevelTwoIcon( iconAlignGroup ),
      createLevelThreeIcon( iconAlignGroup )
    ];

    // Description of LevelSelectionButtons
    const levelSelectionButtonGroupItems = [];
    for ( let level = 0; level < model.numberOfLevels; level++ ) {
      levelSelectionButtonGroupItems.push( {
        icon: levelIcons[ level ],
        scoreProperty: model.bestScoreProperties[ level ],
        options: {
          bestTimeProperty: model.bestTimeProperties[ level ],
          createScoreDisplay: scoreProperty => new ScoreDisplayStars( scoreProperty, {
            numberOfStars: model.getNumberOfChallenges( level ),
            perfectScore: model.getPerfectScore( level )
          } ),
          listener: () => model.play( level ),
          soundPlayerIndex: level
        }
      } );
    }

    // Group of LevelSelectionButtons
    const levelSelectionButtonGroup = new LevelSelectionButtonGroup( levelSelectionButtonGroupItems, {
      levelSelectionButtonOptions: {
        baseColor: 'rgb( 240, 255, 204 )',
        xMargin: 15,
        yMargin: 15,
        buttonWidth: 150,
        buttonHeight: 150,
        bestTimeVisibleProperty: model.timerEnabledProperty
      },
      flowBoxOptions: {
        spacing: 40
      },
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
      centerX: layoutBounds.centerX,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN,
      maxWidth: 0.65 * layoutBounds.width // constrain width for i18n
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

/*
 *  Level N
 *  leftNode -> rightNode
 */
function createIcon( level, leftNode, rightNode, iconAlignGroup ) {
  const arrowNode = new ArrowNode( 0, 0, 50, 0, { headHeight: 20, headWidth: 20, tailWidth: 6 } );
  const iconNode = new AlignBox( new HBox( {
    children: [ leftNode, arrowNode, rightNode ],
    spacing: 20
  } ), {
    group: iconAlignGroup
  } );
  const labelNode = new Text( StringUtils.format( reactantsProductsAndLeftoversStrings.pattern_Level_0, level ), {
    font: new PhetFont( 45 ),
    maxWidth: iconNode.width
  } );
  return new VBox( {
    children: [ labelNode, iconNode ],
    spacing: 30
  } );
}

/**
 *  Level 1
 *  ? -> HCl
 */
function createLevelOneIcon( iconAlignGroup ) {
  const leftNode = new Text( reactantsProductsAndLeftoversStrings.questionMark, QUESTION_MARK_OPTIONS );
  const rightNode = new HClNode( RPALConstants.MOLECULE_OPTIONS );
  rightNode.setScaleMagnitude( MOLECULE_SCALE );
  return createIcon( 1, leftNode, rightNode, iconAlignGroup );
}

/**
 *  Level 2
 *  H2O -> ?
 */
function createLevelTwoIcon( iconAlignGroup ) {
  const leftNode = new H2ONode( RPALConstants.MOLECULE_OPTIONS );
  leftNode.setScaleMagnitude( MOLECULE_SCALE );
  const rightNode = new Text( reactantsProductsAndLeftoversStrings.questionMark, QUESTION_MARK_OPTIONS );
  return createIcon( 2, leftNode, rightNode, iconAlignGroup );
}

/**
 *  Level 3
 *  NH3 -> ??
 */
function createLevelThreeIcon( iconAlignGroup ) {
  const leftNode = new NH3Node( RPALConstants.MOLECULE_OPTIONS );
  leftNode.setScaleMagnitude( MOLECULE_SCALE );
  const rightNode = new Text( reactantsProductsAndLeftoversStrings.doubleQuestionMark, QUESTION_MARK_OPTIONS );
  return createIcon( 3, leftNode, rightNode, iconAlignGroup );
}

reactantsProductsAndLeftovers.register( 'SettingsNode', SettingsNode );
export default SettingsNode;