// Copyright 2014-2022, University of Colorado Boulder

/**
 * RPALLevelSelectionButtonGroup is the group of level-selection buttons for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import HClNode from '../../../../nitroglycerin/js/nodes/HClNode.js';
import NH3Node from '../../../../nitroglycerin/js/nodes/NH3Node.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import LevelSelectionButtonGroup from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../../../../vegas/js/ScoreDisplayStars.js';
import RPALConstants from '../../common/RPALConstants.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import reactantsProductsAndLeftoversStrings from '../../reactantsProductsAndLeftoversStrings.js';

// constants
const QUESTION_MARK_OPTIONS = { font: new PhetFont( { size: 70, weight: 'bold' } ) };
const MOLECULE_SCALE = 3; // scale of the molecule icons used on the level-selection buttons

class RPALLevelSelectionButtonGroup extends LevelSelectionButtonGroup {

  /**
   * @param {GameModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
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
      }
    }, options );

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

    super( levelSelectionButtonGroupItems, options );
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
  const rightNode = new HClNode( RPALConstants.MOLECULE_NODE_OPTIONS );
  rightNode.setScaleMagnitude( MOLECULE_SCALE );
  return createIcon( 1, leftNode, rightNode, iconAlignGroup );
}

/**
 *  Level 2
 *  H2O -> ?
 */
function createLevelTwoIcon( iconAlignGroup ) {
  const leftNode = new H2ONode( RPALConstants.MOLECULE_NODE_OPTIONS );
  leftNode.setScaleMagnitude( MOLECULE_SCALE );
  const rightNode = new Text( reactantsProductsAndLeftoversStrings.questionMark, QUESTION_MARK_OPTIONS );
  return createIcon( 2, leftNode, rightNode, iconAlignGroup );
}

/**
 *  Level 3
 *  NH3 -> ??
 */
function createLevelThreeIcon( iconAlignGroup ) {
  const leftNode = new NH3Node( RPALConstants.MOLECULE_NODE_OPTIONS );
  leftNode.setScaleMagnitude( MOLECULE_SCALE );
  const rightNode = new Text( reactantsProductsAndLeftoversStrings.doubleQuestionMark, QUESTION_MARK_OPTIONS );
  return createIcon( 3, leftNode, rightNode, iconAlignGroup );
}

reactantsProductsAndLeftovers.register( 'RPALLevelSelectionButtonGroup', RPALLevelSelectionButtonGroup );
export default RPALLevelSelectionButtonGroup;