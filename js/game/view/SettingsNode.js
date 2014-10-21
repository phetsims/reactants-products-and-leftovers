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
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var IconFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/IconFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var VisibilityControl = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/VisibilityControl' );

  // strings
  var chooseYourLevelString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/chooseYourLevel' );

  // constants
  var SCREEN_X_MARGIN = 40;
  var SCREEN_Y_MARGIN = 20;

  // Icons for the level-selection buttons, indexed by level
  var levelIcons = [
    IconFactory.createLevelOneIcon(),
    IconFactory.createLevelTwoIcon(),
    IconFactory.createLevelThreeIcon()
  ];
  var MAX_ICON_WIDTH = _.max( levelIcons, function( icon ) { return icon.width; } ).width;
  var MAX_ICON_HEIGHT = _.max( levelIcons, function( icon ) { return icon.height; } ).height;

  /**
   * Creates a level-selection button
   * @param {number} level
   * @param {GameModel} model
   * @returns {Node}
   */
  var createLevelSelectionButton = function( level, model ) {

    assert && assert( level >= 0 && level < levelIcons.length );

    // make all icons the same size
    var icon = levelIcons[ level ];
    var rect = new Rectangle( 0, 0, MAX_ICON_WIDTH, MAX_ICON_HEIGHT, { center: icon.center } );
    var content = new Node( {
      children: [ rect, icon ]
    } );

    return new LevelSelectionButton(
      content,
      model.challengesPerGame,
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

    // Level-selection buttons, arranged in a row
    var buttons = [];
    for ( var level = 0; level < model.numberOfLevels; level++ ) {
      buttons.push( createLevelSelectionButton( level, model ) );
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
    });

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
        top: layoutBounds.top + SCREEN_X_MARGIN
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

  return inherit( Node, SettingsNode );
} );

