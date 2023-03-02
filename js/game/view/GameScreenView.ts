// Copyright 2014-2023, University of Colorado Boulder

/**
 * View for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import RPALConstants from '../../common/RPALConstants.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import GameModel from '../model/GameModel.js';
import GamePhase from '../model/GamePhase.js';
import PlayNode from './PlayNode.js';
import ResultsNode from './ResultsNode.js';
import SettingsNode from './SettingsNode.js';

export default class GameScreenView extends ScreenView {

  private playNode: PlayNode | null; // created on demand
  private resultsNode: ResultsNode | null; // created on demand

  public constructor( model: GameModel, tandem: Tandem ) {

    super( {
      layoutBounds: RPALConstants.SCREEN_VIEW_LAYOUT_BOUNDS,
      tandem: tandem
    } );

    // sounds
    const audioPlayer = new GameAudioPlayer();

    // one node for each 'phase' of the game, created on demand to improve startup time
    let settingsNode: SettingsNode | null = null;
    this.playNode = null;
    this.resultsNode = null;

    /*
     * Handle game 'phase' changes, nodes created on demand to reduce startup time.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.gamePhaseProperty.link( gamePhase => {

      // create nodes on demand
      if ( settingsNode === null && gamePhase === GamePhase.SETTINGS ) {
        settingsNode = new SettingsNode( model, this.layoutBounds, tandem.createTandem( 'settingsNode' ) );
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
   * @param dt - time between step calls, in seconds
   */
  public override step( dt: number ): void {

    // animate the reward
    if ( this.resultsNode && this.resultsNode.visible ) {
      this.resultsNode.step( dt );
    }

    // cleanup nodes
    if ( this.playNode ) {
      this.playNode.step( dt );
    }

    super.step( dt );
  }
}

reactantsProductsAndLeftovers.register( 'GameScreenView', GameScreenView );