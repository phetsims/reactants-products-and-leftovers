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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  //TODO these are placeholders
  // images, ordered by level
  var levelIcons = [
    new Rectangle( 0, 0, 100, 100, { fill: 'red' } ),
    new Rectangle( 0, 0, 100, 100, { fill: 'green' } ),
    new Rectangle( 0, 0, 100, 100, { fill: 'blue' } )
  ];

  // strings
  var chooseYourLevelString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/chooseYourLevel' );
  var pattern_Level_0 = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/pattern_Level_0' );

  // constants
  var SCREEN_X_MARGIN = 40;
  var SCREEN_Y_MARGIN = 20;

  // Creates a level selection button
  var createLevelSelectionButton = function( level, model ) {

    // 'Level N' centered above icon
    var label = new Text( StringUtils.format( pattern_Level_0, level + 1 ), { font: new RPALFont( 40 ) } );
    var icon = levelIcons[level];
    icon.centerX = label.centerX;
    icon.top = label.bottom + 20;

    return new LevelSelectionButton(
      new Node( { children: [ label, icon ] } ),
      model.challengesPerGame,
      function() {
        model.level = level;
        model.gamePhase = GamePhase.PLAY;
      },
      model.bestScoreProperties[ level ],
      model.getPerfectScore(),
      {
        baseColor: 'rgb( 240, 255, 204 )',
        buttonWidth: 125,
        buttonHeight: 175,
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

    assert && assert( levelIcons.length === model.numberOfLevels );

    options = options || {};

    // Title
    var title = new Text( chooseYourLevelString, { font: new RPALFont( 40 ) } );

    // Level-selection buttons, arranged in a row

    // buttons
    var buttons = [];
    for ( var level = 0; level < model.numberOfLevels; level++ ) {
      buttons.push( createLevelSelectionButton( level, model ) );
    }
    var buttonsParent = new HBox( {
      children: buttons,
      spacing: 50,
      resize: false,
      center: layoutBounds.center
    } );

    // Timer and Sound controls
    var toggleOptions = { stroke: 'gray', scale: 1 };
    var timerToggleButton = new TimerToggleButton( model.timerEnabledProperty, toggleOptions );
    var soundToggleButton = new SoundToggleButton( model.soundEnabledProperty, toggleOptions );

    // Reset All button, at rightBottom
    var resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      right: layoutBounds.right - SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
    } );

    options.children = [
      // title and level-selection buttons centered
      new VBox( {
        children: [ title, buttonsParent ],
        align: 'center',
        spacing: 40,
        center: layoutBounds.center
      } ),
      // timer and sound buttons at leftBottom
      new VBox( {
        children: [ timerToggleButton, soundToggleButton ],
        align: 'center',
        spacing: 15,
        left: layoutBounds.left + SCREEN_X_MARGIN,
        bottom: layoutBounds.bottom - SCREEN_Y_MARGIN
      } ),
      resetAllButton
    ];
    Node.call( this, options );
  }

  return inherit( Node, SettingsNode );
} );

