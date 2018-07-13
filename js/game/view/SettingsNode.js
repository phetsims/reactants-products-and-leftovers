// Copyright 2014-2017, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.SETTINGS.
 * Displays a panel with controls used to configure a game (level selection, timer, sound, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ChallengeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeFactory' );
  var H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  var HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  var Node = require( 'SCENERY/nodes/Node' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var VisibilityRadioButtons = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/VisibilityRadioButtons' );

  // strings
  var chooseYourLevelString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/chooseYourLevel' );
  var doubleQuestionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/doubleQuestionMark' );
  var patternLevel0String = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/pattern_Level_0' );
  var questionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/questionMark' );

  // constants
  var SCREEN_X_MARGIN = 40;
  var SCREEN_Y_MARGIN = 40;
  var QUESTION_MARK_OPTIONS = { font: new RPALFont( { size: 70, weight: 'bold' } ) };
  var TOGGLE_BUTTON_OPTIONS = { stroke: 'gray', scale: 1 }; // options for the Sound and Timer toggle buttons
  var MOLECULE_SCALE = 3; // scale of the molecule icons used on the level-selection buttons

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds the {Screen}'s layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SettingsNode( model, layoutBounds, options ) {

    options = options || {};

    // Title
    var title = new Text( chooseYourLevelString, {
      font: new RPALFont( 40 ),
      maxWidth: 0.75 * layoutBounds.width // constrain width for i18n
    } );

    // Icons for the level-selection buttons, indexed by level
    var levelIcons = [
      createLevelOneIcon(),
      createLevelTwoIcon(),
      createLevelThreeIcon()
    ];
    assert && assert( levelIcons.length === model.numberOfLevels );
    var maxIconWidth = _.maxBy( levelIcons, function( icon ) { return icon.width; } ).width;
    var maxIconHeight = _.maxBy( levelIcons, function( icon ) { return icon.height; } ).height;

    // Level-selection buttons, arranged in a row
    var buttons = [];
    for ( var level = 0; level < model.numberOfLevels; level++ ) {
      buttons.push( createLevelSelectionButton( level, model, levelIcons[ level ], maxIconWidth, maxIconHeight ) );
    }
    var buttonsParent = new LayoutBox( {
      children: buttons,
      spacing: 40,
      orientation: 'horizontal',
      center: layoutBounds.center
    } );

    // Timer and Sound toggle buttons, at bottom left
    var timerToggleButton = new TimerToggleButton( model.timerEnabledProperty, TOGGLE_BUTTON_OPTIONS );
    var soundToggleButton = new SoundToggleButton( model.soundEnabledProperty, TOGGLE_BUTTON_OPTIONS );
    var toggleButtons = new LayoutBox( {
      children: [ timerToggleButton, soundToggleButton ],
      orientation: 'vertical',
      align: 'center',
      spacing: 15,
      left: layoutBounds.left + SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    // Visibility radio buttons, at bottom center
    var visibilityRadioButtons = new VisibilityRadioButtons( model.moleculesVisibleProperty, model.numbersVisibleProperty, {
      centerX: layoutBounds.centerX,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN,
      maxWidth: 0.65 * layoutBounds.width // constrain width for i18n
    } );

    // Reset All button, at bottom right
    var resetAllButton = new ResetAllButton( {
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
      toggleButtons,
      visibilityRadioButtons,
      resetAllButton
    ];
    Node.call( this, options );

    // 'Test' button at top right, runs a sanity test on the challenge generator
    if ( phet.chipper.queryParameters.showAnswers && !RPALQueryParameters.playAll ) {
      var testButton = new TextPushButton( 'Test', {
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
    var rect = new Rectangle( 0, 0, maxIconWidth, maxIconHeight, { center: icon.center } );
    var content = new Node( {
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
  var createIcon = function( level, leftNode, rightNode ) {
    var arrowNode = new ArrowNode( 0, 0, 50, 0, { headHeight: 20, headWidth: 20, tailWidth: 6 } );
    var iconNode = new LayoutBox( {
      children: [ leftNode, arrowNode, rightNode ],
      orientation: 'horizontal',
      spacing: 20
    } );
    var labelNode = new Text( StringUtils.format( patternLevel0String, level ), {
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
    var leftNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
    var rightNode = new HClNode( RPALConstants.MOLECULE_OPTIONS );
    rightNode.setScaleMagnitude( MOLECULE_SCALE );
    return createIcon( 1, leftNode, rightNode );
  };

  /**
   *  Level 2
   *  H2O -> ?
   */
  var createLevelTwoIcon = function() {
    var leftNode = new H2ONode( RPALConstants.MOLECULE_OPTIONS );
    leftNode.setScaleMagnitude( MOLECULE_SCALE );
    var rightNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
    return createIcon( 2, leftNode, rightNode );
  };

  /**
   *  Level 3
   *  NH3 -> ??
   */
  var createLevelThreeIcon = function() {
    var leftNode = new NH3Node( RPALConstants.MOLECULE_OPTIONS );
    leftNode.setScaleMagnitude( MOLECULE_SCALE );
    var rightNode = new Text( doubleQuestionMarkString, QUESTION_MARK_OPTIONS );
    return createIcon( 3, leftNode, rightNode );
  };

  return inherit( Node, SettingsNode );
} );

