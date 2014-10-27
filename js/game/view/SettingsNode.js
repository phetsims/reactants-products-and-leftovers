// Copyright 2002-2014, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to the 'settings' game phase. (See GamePhase.SETTINGS)
 * The displays a panel with controls used to configure a game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  var HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var VisibilityControl = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/VisibilityControl' );

  // strings
  var chooseYourLevelString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/chooseYourLevel' );
  var pattern_Level_0 = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/pattern_Level_0' );
  var doubleQuestionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/doubleQuestionMark' );
  var questionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/questionMark' );

  // constants
  var SCREEN_X_MARGIN = 40;
  var SCREEN_Y_MARGIN = 40;
  var LABEL_OPTIONS = { font: new RPALFont( 45 ) };
  var QUESTION_MARK_OPTIONS = { font: new RPALFont( { size: 70, weight: 'bold' } ) };
  var ARROW_OPTIONS = { headHeight: 20, headWidth: 20, tailWidth: 6 };
  var MOLECULE_SCALE = 3;

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SettingsNode( model, layoutBounds, options ) {

    options = options || {};

    // Title
    var title = new Text( chooseYourLevelString, { font: new RPALFont( 40 ) } );

    // Icons for the level-selection buttons, indexed by level
    var levelIcons = [
      createLevelOneIcon(),
      createLevelTwoIcon(),
      createLevelThreeIcon()
    ];
    assert && assert( levelIcons.length === model.numberOfLevels );
    var maxIconWidth = _.max( levelIcons, function( icon ) { return icon.width; } ).width;
    var maxIconHeight = _.max( levelIcons, function( icon ) { return icon.height; } ).height;

    // Level-selection buttons, arranged in a row
    var buttons = [];
    for ( var level = 0; level < model.numberOfLevels; level++ ) {
      buttons.push( createLevelSelectionButton( level, model, levelIcons[level], maxIconWidth, maxIconHeight ) );
    }
    var buttonsParent = new LayoutBox( {
      children: buttons,
      spacing: 40,
      orientation: 'horizontal',
      center: layoutBounds.center
    } );

    // Timer and Sound controls
    var toggleOptions = { stroke: 'gray', scale: 1 };
    var timerToggleButton = new TimerToggleButton( model.timerEnabledProperty, toggleOptions );
    var soundToggleButton = new SoundToggleButton( model.soundEnabledProperty, toggleOptions );

    // Visibility control
    var visibilityControl = new VisibilityControl( model.moleculesVisibleProperty, model.numbersVisibleProperty, {
      centerX: layoutBounds.centerX,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    // Reset All button, at rightBottom
    var resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      right: layoutBounds.right - SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    options.children = [
      // title and level-selection buttons centered
      new LayoutBox( {
        children: [ title, buttonsParent ],
        orientation: 'vertical',
        align: 'center',
        spacing: 40,
        centerX: layoutBounds.centerX,
        centerY: ( visibilityControl.top - layoutBounds.top ) / 2
      } ),
      // timer and sound buttons at leftBottom
      new LayoutBox( {
        children: [ timerToggleButton, soundToggleButton ],
        orientation: 'vertical',
        align: 'center',
        spacing: 15,
        left: layoutBounds.left + SCREEN_X_MARGIN,
        bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
      } ),
      visibilityControl,
      resetAllButton
    ];
    Node.call( this, options );
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
  var createLevelSelectionButton = function( level, model, icon, maxIconWidth, maxIconHeight ) {

    // make all icons the same size
    var rect = new Rectangle( 0, 0, maxIconWidth, maxIconHeight, { center: icon.center } );
    var content = new Node( {
      children: [ rect, icon ]
    } );

    return new LevelSelectionButton(
      content,
      model.getNumberOfChallenges( level ),
      function() {
        model.level = level;
        model.gamePhaseProperty.set( GamePhase.PLAY );
      },
      model.bestScoreProperties[ level ],
      model.getPerfectScore(),
      {
        baseColor: 'rgb( 240, 255, 204 )',
        buttonXMargin: 15,
        buttonYMargin: 15,
        buttonWidth: 150,
        buttonHeight: 150,
        iconToProgressIndicatorYSpace: 15,
        bestTimeProperty: model.bestTimeProperties[ level ],
        bestTimeVisibleProperty: model.timerEnabledProperty
      } );
  };

  /*
   *  Level N
   *  leftNode -> rightNode
   */
  var createIcon = function( level, leftNode, rightNode ) {
    var labelNode = new Text( StringUtils.format( pattern_Level_0, level ), LABEL_OPTIONS );
    var arrowNode = new ArrowNode( 0, 0, 50, 0, ARROW_OPTIONS );
    var icon = new LayoutBox( { children: [ leftNode, arrowNode, rightNode ], orientation: 'horizontal', spacing: 20 } );
    labelNode.setScaleMagnitude( Math.min( 1, icon.width / labelNode.width ) ); // i18n: label can be no wider than image
    return new LayoutBox( { children: [ labelNode, icon ], orientation: 'vertical', spacing: 30 } );
  };

  /**
   *  Level 1
   *  ? -> HCl
   */
  var createLevelOneIcon = function() {
    var leftNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
    var rightNode = new HClNode( RPALConstants.ATOM_OPTIONS );
    rightNode.setScaleMagnitude( MOLECULE_SCALE );
    return createIcon( 1, leftNode, rightNode );
  };

  /**
   *  Level 2
   *  H2O -> ?
   */
  var createLevelTwoIcon = function() {
    var leftNode = new H2ONode( RPALConstants.ATOM_OPTIONS );
    leftNode.setScaleMagnitude( MOLECULE_SCALE );
    var rightNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
    return createIcon( 2, leftNode, rightNode );
  };

  /**
   *  Level 3
   *  NH3 -> ??
   */
  var createLevelThreeIcon = function() {
    var leftNode = new NH3Node( RPALConstants.ATOM_OPTIONS );
    leftNode.setScaleMagnitude( MOLECULE_SCALE );
    var rightNode = new Text( doubleQuestionMarkString, QUESTION_MARK_OPTIONS );
    return createIcon( 3, leftNode, rightNode );
  };

  return inherit( Node, SettingsNode );
} );

