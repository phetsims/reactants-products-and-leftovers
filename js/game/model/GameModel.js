// Copyright 2014-2023, University of Colorado Boulder

/**
 * Model for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import GameTimer from '../../../../vegas/js/GameTimer.js';
import RPALConstants from '../../common/RPALConstants.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ChallengeFactory from './ChallengeFactory.js';
import GamePhase from './GamePhase.js';
import GameVisibility from './GameVisibility.js';
import PlayState from './PlayState.js';

// constants
const POINTS_FIRST_CHECK = 2;
const POINTS_SECOND_CHECK = 1;

export default class GameModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      level: 0, // the current level in the game, numbered starting with zero
      numberOfLevels: 3, // number of levels in the game
      maxQuantity: RPALConstants.QUANTITY_RANGE.max // maximum quantity of any substance in a reaction
    }, options );

    // @public
    this.timerEnabledProperty = new BooleanProperty( false ); // {boolean} is the timer turned on?
    this.gameVisibiltyProperty = new EnumerationProperty( GameVisibility.SHOW_ALL );

    // @public (read-only)
    this.levelProperty = new NumberProperty( 0 ); // {number} the current level, starts at 0 in the model, presented as starting from 1 in the view
    this.scoreProperty = new NumberProperty( 0 ); // {number} how many points the user has earned for the current game
    this.numberOfChallengesProperty = new NumberProperty( 0 ); // {number} the number of challenges in the current game being played
    this.challengeProperty = new Property( null ); // {Challenge} the current challenge being played
    this.challengeIndexProperty = new NumberProperty( -1 ); // {number} the index of the current challenge, -1 indicates no challenge
    this.gamePhaseProperty = new EnumerationProperty( GamePhase.SETTINGS ); // the current 'phase' of the game
    this.playStateProperty = new EnumerationProperty( PlayState.NONE ); // the current 'play state' of the game

    // These fields are @public (read-only), they should not be changed once the model is instantiated.
    this.numberOfLevels = options.numberOfLevels;
    this.maxQuantity = options.maxQuantity;

    // These fields are @public (read-only), they change as game-play progresses.
    this.challenges = []; // {Challenge[]} the set of challenges for the current game being played
    this.bestScoreProperties = []; // {Property.<number>[]} best scores for each level
    this.bestTimeProperties = []; // {Property.<number>[]} best times for each level, in ms
    this.isNewBestTime = false; // {boolean} is the time for the most-recently-completed game a new best time?
    for ( let level = 0; level < this.numberOfLevels; level++ ) {
      this.bestScoreProperties.push( new NumberProperty( 0 ) );
      this.bestTimeProperties.push( new Property( null ) ); // null if a level has no best time yet
    }

    this.timer = new GameTimer(); // @private
  }

  // @public Resets the model to its initial state.
  reset() {

    // reset Properties
    this.timerEnabledProperty.reset();
    this.gameVisibiltyProperty.reset();
    this.levelProperty.reset();
    this.scoreProperty.reset();
    this.numberOfChallengesProperty.reset();
    this.challengeProperty.reset();
    this.challengeIndexProperty.reset();
    this.gamePhaseProperty.reset();
    this.playStateProperty.reset();

    // reset scores and times for each level
    this.bestScoreProperties.forEach( property => property.set( 0 ) );
    this.bestTimeProperties.forEach( property => property.set( null ) );
  }

  // @private Advances to GamePhase.SETTINGS, shows the user-interface for selecting game settings
  settings() {
    this.timer.stop();
    this.playStateProperty.set( PlayState.NONE );
    this.gamePhaseProperty.set( GamePhase.SETTINGS ); // do this last, so that other stuff is set up before observers are notified
  }

  // @private Advances to GamePhase.PLAY, plays a game for the specified {number} level
  play( level ) {
    assert && assert( this.gamePhaseProperty.value === GamePhase.SETTINGS );
    this.levelProperty.set( level );
    this.scoreProperty.set( 0 );
    this.initChallenges();
    this.timer.start();
    this.playStateProperty.set( PlayState.FIRST_CHECK );
    this.gamePhaseProperty.set( GamePhase.PLAY ); // do this last, so that other stuff is set up before observers are notified
  }

  // @private Advances to GamePhase.RESULTS, ends the current game and displays results
  results() {
    assert && assert( this.gamePhaseProperty.value === GamePhase.PLAY );
    this.timer.stop();
    this.updateBestScore();
    this.updateBestTime();
    this.playStateProperty.set( PlayState.NONE );
    this.gamePhaseProperty.set( GamePhase.RESULTS ); // do this last, so that other stuff is set up before observers are notified
  }

  // @public Checks the current guess
  check() {
    const playState = this.playStateProperty.value;
    assert && assert( playState === PlayState.FIRST_CHECK || playState === PlayState.SECOND_CHECK );
    if ( this.challengeProperty.value.isCorrect() ) {
      // stop the timer as soon as we successfully complete the last challenge
      if ( this.challengeIndexProperty.value === this.challenges.length - 1 ) {
        this.timer.stop();
      }
      const points = ( playState === PlayState.FIRST_CHECK ) ? POINTS_FIRST_CHECK : POINTS_SECOND_CHECK;
      this.challengeProperty.value.points = points;
      this.scoreProperty.set( this.scoreProperty.value + points );
      this.playStateProperty.set( PlayState.NEXT );
    }
    else {
      this.playStateProperty.set( ( playState === PlayState.FIRST_CHECK ) ? PlayState.TRY_AGAIN : PlayState.SHOW_ANSWER );
    }
  }

  // @public Makes another attempt at solving the challenge
  tryAgain() {
    assert && assert( this.playStateProperty.value === PlayState.TRY_AGAIN );
    this.playStateProperty.set( PlayState.SECOND_CHECK );
  }

  // @public Shows the correct answer
  showAnswer() {
    assert && assert( this.playStateProperty.value === PlayState.SHOW_ANSWER );
    this.challengeProperty.value.showAnswer();
    this.playStateProperty.set( PlayState.NEXT );
  }

  // @public Advances to the next challenge
  next() {
    if ( this.challengeIndexProperty.value === this.challenges.length - 1 ) {
      // game has been completed, advance to GamePhase.RESULTS
      this.results();
    }
    else {
      // advance to next challenge
      this.challengeIndexProperty.set( this.challengeIndexProperty.value + 1 );
      this.challengeProperty.set( this.challenges[ this.challengeIndexProperty.value ] );
      this.playStateProperty.set( PlayState.FIRST_CHECK );
    }
  }

  /**
   * Gets the number of challenges for the specified level.
   * @param {number} level
   * @returns {number}
   * @public
   */
  getNumberOfChallenges( level ) {
    return ChallengeFactory.getNumberOfChallenges( level );
  }

  /**
   * Gets the perfect score for the specified level.
   * @param {number} level
   * @returns {number}
   * @public
   */
  getPerfectScore( level ) {
    return ChallengeFactory.getNumberOfChallenges( level ) * POINTS_FIRST_CHECK;
  }

  /**
   * Is the current score perfect?
   * @returns {boolean}
   * @public
   */
  isPerfectScore() {
    return this.scoreProperty.value === this.getPerfectScore( this.levelProperty.value );
  }

  // @private Updates the best score for the current level.
  updateBestScore() {
    const level = this.levelProperty.value;
    if ( this.scoreProperty.value > this.bestScoreProperties[ level ].value ) {
      this.bestScoreProperties[ level ].set( this.scoreProperty.value );
    }
  }

  // @private Updates the best time for the current level, at the end of a timed game with a perfect score.
  updateBestTime() {
    assert && assert( !this.timer.isRunningProperty.value );
    this.isNewBestTime = false;
    if ( this.timerEnabledProperty.value && this.isPerfectScore() ) {
      const level = this.levelProperty.value;
      const time = this.timer.elapsedTimeProperty.value;
      if ( !this.bestTimeProperties[ level ].value ) {
        // there was no previous time for this level
        this.bestTimeProperties[ level ].set( time );
      }
      else if ( time < this.bestTimeProperties[ level ].value ) {
        // we have a new best time for this level
        this.bestTimeProperties[ level ].set( time );
        this.isNewBestTime = true;
      }
    }
  }

  // @private initializes a new set of challenges for the current level
  initChallenges() {
    this.challenges = ChallengeFactory.createChallenges( this.levelProperty.value, this.maxQuantity, {
      moleculesVisible: ( this.gameVisibiltyProperty.value !== GameVisibility.HIDE_MOLECULES ),
      numbersVisible: ( this.gameVisibiltyProperty.value !== GameVisibility.HIDE_NUMBERS )
    } );
    this.numberOfChallengesProperty.set( this.challenges.length );
    this.challengeIndexProperty.set( 0 );
    this.challengeProperty.set( this.challenges[ this.challengeIndexProperty.value ] );
  }

  /**
   * DEBUG
   * Skips the current challenge.
   * Score and best times are meaningless after using this.
   * This is a developer feature.
   * @public
   */
  skipCurrentChallenge() {
    this.next();
  }

  /**
   * DEBUG
   * Replays the current challenge.
   * Score and best times are meaningless after using this.
   * This is a developer feature.
   * @public
   */
  replayCurrentChallenge() {
    this.challengeProperty.value.reset();
    this.playStateProperty.set( PlayState.FIRST_CHECK );
  }
}

reactantsProductsAndLeftovers.register( 'GameModel', GameModel );