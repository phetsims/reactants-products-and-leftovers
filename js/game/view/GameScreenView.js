// Copyright 2014-2019, University of Colorado Boulder

/**
 * View for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  const GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PlayNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/PlayNode' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const ResultsNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/ResultsNode' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SettingsNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/SettingsNode' );

  /**
   * @param {GameModel} model
   * @constructor
   */
  function GameScreenView( model ) {

    var self = this;
    ScreenView.call( this, RPALConstants.SCREEN_VIEW_OPTIONS );

    // sounds
    var audioPlayer = new GameAudioPlayer();

    // one node for each 'phase' of the game, created on demand to improve startup time
    var settingsNode = null; // @private
    this.playNode = null; // @private
    this.resultsNode = null; // @private

    /*
     * Handle game 'phase' changes, nodes created on demand to reduce startup time.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.gamePhaseProperty.link( function( gamePhase ) {

      // create nodes on demand
      if ( settingsNode === null && gamePhase === GamePhase.SETTINGS ) {
        settingsNode = new SettingsNode( model, self.layoutBounds );
        self.addChild( settingsNode );
      }

      if ( self.playNode === null && gamePhase === GamePhase.PLAY ) {
        self.playNode = new PlayNode( model, self.layoutBounds, self.visibleBoundsProperty, audioPlayer );
        self.addChild( self.playNode );
      }

      if ( self.resultsNode === null && gamePhase === GamePhase.RESULTS ) {
        self.resultsNode = new ResultsNode( model, self.layoutBounds, audioPlayer );
        self.addChild( self.resultsNode );
      }

      // make the node visible that corresponds to the game phase
      settingsNode && ( settingsNode.visible = ( gamePhase === GamePhase.SETTINGS ) );
      self.playNode && ( self.playNode.visible = ( gamePhase === GamePhase.PLAY ) );
      self.resultsNode && ( self.resultsNode.visible = ( gamePhase === GamePhase.RESULTS ) );
    } );
  }

  reactantsProductsAndLeftovers.register( 'GameScreenView', GameScreenView );

  return inherit( ScreenView, GameScreenView, {

    /**
     * Animation step function.
     * @param {number} elapsedTime time between step calls, in seconds
     * @public
     */
    step: function( elapsedTime ) {

      // animate the reward
      if ( this.resultsNode && this.resultsNode.visible ) {
        this.resultsNode.step( elapsedTime );
      }

      // cleanup nodes
      if ( this.playNode ) {
        this.playNode.step( elapsedTime );
      }
    }
  } );
} );
