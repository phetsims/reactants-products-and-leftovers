// Copyright 2014-2020, University of Colorado Boulder

/**
 * View for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import RPALConstants from '../../common/RPALConstants.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import GamePhase from '../model/GamePhase.js';
import PlayNode from './PlayNode.js';
import ResultsNode from './ResultsNode.js';
import SettingsNode from './SettingsNode.js';

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

reactantsProductsAndLeftovers.register( 'GameScreenView', GameScreenView );
export default GameScreenView;