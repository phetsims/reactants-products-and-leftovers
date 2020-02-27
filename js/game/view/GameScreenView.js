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
  const PlayNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/PlayNode' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const ResultsNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/ResultsNode' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SettingsNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/SettingsNode' );

  class GameScreenView extends ScreenView {

    /**
     * @param {GameModel} model
     */
    constructor( model ) {

      super( RPALConstants.SCREEN_VIEW_OPTIONS );

      // sounds
      const audioPlayer = new GameAudioPlayer();

      // one node for each 'phase' of the game, created on demand to improve startup time
      let settingsNode = null; // @private
      this.playNode = null; // @private
      this.resultsNode = null; // @private

      /*
       * Handle game 'phase' changes, nodes created on demand to reduce startup time.
       * Unlink is unnecessary because this node exists for the lifetime of the simulation.
       */
      model.gamePhaseProperty.link( gamePhase => {

        // create nodes on demand
        if ( settingsNode === null && gamePhase === GamePhase.SETTINGS ) {
          settingsNode = new SettingsNode( model, this.layoutBounds );
          this.addChild( settingsNode );
        }

        if ( this.playNode === null && gamePhase === GamePhase.PLAY ) {
          this.playNode = new PlayNode( model, this.layoutBounds, this.visibleBoundsProperty, audioPlayer );
          this.addChild( this.playNode );
        }

        if ( this.resultsNode === null && gamePhase === GamePhase.RESULTS ) {
          this.resultsNode = new ResultsNode( model, this.layoutBounds, audioPlayer );
          this.addChild( this.resultsNode );
        }

        // make the node visible that corresponds to the game phase
        settingsNode && ( settingsNode.visible = ( gamePhase === GamePhase.SETTINGS ) );
        this.playNode && ( this.playNode.visible = ( gamePhase === GamePhase.PLAY ) );
        this.resultsNode && ( this.resultsNode.visible = ( gamePhase === GamePhase.RESULTS ) );
      } );
    }

    /**
     * Animation step function.
     * @param {number} elapsedTime time between step calls, in seconds
     * @public
     */
    step( elapsedTime ) {

      // animate the reward
      if ( this.resultsNode && this.resultsNode.visible ) {
        this.resultsNode.step( elapsedTime );
      }

      // cleanup nodes
      if ( this.playNode ) {
        this.playNode.step( elapsedTime );
      }
    }
  }

  return reactantsProductsAndLeftovers.register( 'GameScreenView', GameScreenView );
} );
