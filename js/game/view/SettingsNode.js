// Copyright 2014-2020, University of Colorado Boulder

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
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayStars from '../../../../vegas/js/ScoreDisplayStars.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALQueryParameters from '../../common/RPALQueryParameters.js';
import RPALFont from '../../common/view/RPALFont.js';
import reactantsProductsAndLeftoversStrings from '../../reactants-products-and-leftovers-strings.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ChallengeFactory from '../model/ChallengeFactory.js';
import VisibilityPanel from './VisibilityPanel.js';

const chooseYourLevelString = reactantsProductsAndLeftoversStrings.chooseYourLevel;
const doubleQuestionMarkString = reactantsProductsAndLeftoversStrings.doubleQuestionMark;
const patternLevel0String = reactantsProductsAndLeftoversStrings.pattern_Level_0;
const questionMarkString = reactantsProductsAndLeftoversStrings.questionMark;

// constants
const SCREEN_X_MARGIN = 40;
const SCREEN_Y_MARGIN = 40;
const QUESTION_MARK_OPTIONS = { font: new RPALFont( { size: 70, weight: 'bold' } ) };
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
    const title = new Text( chooseYourLevelString, {
      font: new RPALFont( 40 ),
      maxWidth: 0.75 * layoutBounds.width // constrain width for i18n
    } );

    // Icons for the level-selection buttons, indexed by level
    const levelIcons = [
      createLevelOneIcon(),
      createLevelTwoIcon(),
      createLevelThreeIcon()
    ];
    assert && assert( levelIcons.length === model.numberOfLevels );
    const maxIconWidth = _.maxBy( levelIcons, icon => icon.width ).width;
    const maxIconHeight = _.maxBy( levelIcons, icon => icon.height ).height;

    // Level-selection buttons, arranged in a row
    const buttons = [];
    for ( let level = 0; level < model.numberOfLevels; level++ ) {
      buttons.push( createLevelSelectionButton( level, model, levelIcons[ level ], maxIconWidth, maxIconHeight ) );
    }
    const buttonsParent = new LayoutBox( {
      children: buttons,
      spacing: 40,
      orientation: 'horizontal',
      center: layoutBounds.center
    } );

    // Timer toggle button, at bottom left
    const timerToggleButton = new TimerToggleButton( model.timerEnabledProperty, {
      stroke: 'gray',
      left: layoutBounds.left + SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    // Panel with visibility radio buttons, at bottom center
    const visibilityPanel = new VisibilityPanel( model.moleculesVisibleProperty, model.numbersVisibleProperty, {
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
      new LayoutBox( {
        children: [ title, buttonsParent ],
        orientation: 'vertical',
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
        font: new RPALFont( 10 ),
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

/**
 * Creates a level-selection button
 * @param {number} level
 * @param {GameModel} model
 * @param {Node} icon
 * @param {number} maxIconWidth
 * @param {number} maxIconHeight
 * @returns {Node}
 */
function createLevelSelectionButton( level, model, icon, maxIconWidth, maxIconHeight ) {

  // make all icons the same size
  const rect = new Rectangle( 0, 0, maxIconWidth, maxIconHeight, { center: icon.center } );
  const content = new Node( {
    children: [ rect, icon ]
  } );

  return new LevelSelectionButton( content, model.bestScoreProperties[ level ], {
    baseColor: 'rgb( 240, 255, 204 )',
    buttonXMargin: 15,
    buttonYMargin: 15,
    buttonWidth: 150,
    buttonHeight: 150,
    iconToProgressIndicatorYSpace: 15,
    bestTimeProperty: model.bestTimeProperties[ level ],
    bestTimeVisibleProperty: model.timerEnabledProperty,
    scoreDisplayConstructor: ScoreDisplayStars,
    scoreDisplayOptions: {
      numberOfStars: model.getNumberOfChallenges( level ),
      perfectScore: model.getPerfectScore( level )
    },
    listener: () => model.play( level )
  } );
}

/*
 *  Level N
 *  leftNode -> rightNode
 */
function createIcon( level, leftNode, rightNode ) {
  const arrowNode = new ArrowNode( 0, 0, 50, 0, { headHeight: 20, headWidth: 20, tailWidth: 6 } );
  const iconNode = new LayoutBox( {
    children: [ leftNode, arrowNode, rightNode ],
    orientation: 'horizontal',
    spacing: 20
  } );
  const labelNode = new Text( StringUtils.format( patternLevel0String, level ), {
    font: new RPALFont( 45 ),
    maxWidth: iconNode.width
  } );
  return new LayoutBox( {
    children: [ labelNode, iconNode ],
    orientation: 'vertical',
    spacing: 30
  } );
}

/**
 *  Level 1
 *  ? -> HCl
 */
function createLevelOneIcon() {
  const leftNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
  const rightNode = new HClNode( RPALConstants.MOLECULE_OPTIONS );
  rightNode.setScaleMagnitude( MOLECULE_SCALE );
  return createIcon( 1, leftNode, rightNode );
}

/**
 *  Level 2
 *  H2O -> ?
 */
function createLevelTwoIcon() {
  const leftNode = new H2ONode( RPALConstants.MOLECULE_OPTIONS );
  leftNode.setScaleMagnitude( MOLECULE_SCALE );
  const rightNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
  return createIcon( 2, leftNode, rightNode );
}

/**
 *  Level 3
 *  NH3 -> ??
 */
function createLevelThreeIcon() {
  const leftNode = new NH3Node( RPALConstants.MOLECULE_OPTIONS );
  leftNode.setScaleMagnitude( MOLECULE_SCALE );
  const rightNode = new Text( doubleQuestionMarkString, QUESTION_MARK_OPTIONS );
  return createIcon( 3, leftNode, rightNode );
}

reactantsProductsAndLeftovers.register( 'SettingsNode', SettingsNode );
export default SettingsNode;