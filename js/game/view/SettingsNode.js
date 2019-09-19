// Copyright 2014-2019, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.SETTINGS.
 * Displays a panel with controls used to configure a game (level selection, timer, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const ChallengeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeFactory' );
  const H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  const HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  const NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  const Node = require( 'SCENERY/nodes/Node' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  const ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  const VisibilityRadioButtons = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/VisibilityRadioButtons' );

  // strings
  const chooseYourLevelString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/chooseYourLevel' );
  const doubleQuestionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/doubleQuestionMark' );
  const patternLevel0String = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/pattern_Level_0' );
  const questionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/questionMark' );

  // constants
  const SCREEN_X_MARGIN = 40;
  const SCREEN_Y_MARGIN = 40;
  const QUESTION_MARK_OPTIONS = { font: new RPALFont( { size: 70, weight: 'bold' } ) };
  const MOLECULE_SCALE = 3; // scale of the molecule icons used on the level-selection buttons

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds the {Screen}'s layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SettingsNode( model, layoutBounds, options ) {

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
    const maxIconWidth = _.maxBy( levelIcons, function( icon ) { return icon.width; } ).width;
    const maxIconHeight = _.maxBy( levelIcons, function( icon ) { return icon.height; } ).height;

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

    // Visibility radio buttons, at bottom center
    const visibilityRadioButtons = new VisibilityRadioButtons( model.moleculesVisibleProperty, model.numbersVisibleProperty, {
      centerX: layoutBounds.centerX,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN,
      maxWidth: 0.65 * layoutBounds.width // constrain width for i18n
    } );

    // Reset All button, at bottom right
    const resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
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
        centerY: ( visibilityRadioButtons.top - layoutBounds.top ) / 2
      } ),
      timerToggleButton,
      visibilityRadioButtons,
      resetAllButton
    ];
    Node.call( this, options );

    // 'Test' button at top right, runs a sanity test on the challenge generator
    if ( phet.chipper.queryParameters.showAnswers && !RPALQueryParameters.playAll ) {
      const testButton = new TextPushButton( 'Test', {
        font: new RPALFont( 10 ),
        baseColor: 'red',
        textFill: 'white',
        right: layoutBounds.right - 10,
        top: layoutBounds.top + 10
      } );
      testButton.addListener( function() { ChallengeFactory.test(); } );
      this.addChild( testButton );
    }
  }

  reactantsProductsAndLeftovers.register( 'SettingsNode', SettingsNode );

  /**
   * Creates a level-selection button
   * @param {number} level
   * @param {GameModel} model
   * @param {Node} icon
   * @param {number} maxIconWidth
   * @param {number} maxIconHeight
   * @returns {Node}
   */
  var createLevelSelectionButton = function( level, model, icon, maxIconWidth, maxIconHeight ) {

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
      listener: function() {
        model.play( level );
      }
    } );
  };

  /*
   *  Level N
   *  leftNode -> rightNode
   */
  const createIcon = function( level, leftNode, rightNode ) {
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
  };

  /**
   *  Level 1
   *  ? -> HCl
   */
  var createLevelOneIcon = function() {
    const leftNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
    const rightNode = new HClNode( RPALConstants.MOLECULE_OPTIONS );
    rightNode.setScaleMagnitude( MOLECULE_SCALE );
    return createIcon( 1, leftNode, rightNode );
  };

  /**
   *  Level 2
   *  H2O -> ?
   */
  var createLevelTwoIcon = function() {
    const leftNode = new H2ONode( RPALConstants.MOLECULE_OPTIONS );
    leftNode.setScaleMagnitude( MOLECULE_SCALE );
    const rightNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
    return createIcon( 2, leftNode, rightNode );
  };

  /**
   *  Level 3
   *  NH3 -> ??
   */
  var createLevelThreeIcon = function() {
    const leftNode = new NH3Node( RPALConstants.MOLECULE_OPTIONS );
    leftNode.setScaleMagnitude( MOLECULE_SCALE );
    const rightNode = new Text( doubleQuestionMarkString, QUESTION_MARK_OPTIONS );
    return createIcon( 3, leftNode, rightNode );
  };

  return inherit( Node, SettingsNode );
} );

