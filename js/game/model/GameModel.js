// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ChallengeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeFactory' );
  const GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  const GameTimer = require( 'VEGAS/GameTimer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const StringProperty = require( 'AXON/StringProperty' );

  // constants
  const POINTS_FIRST_CHECK = 2;
  const POINTS_SECOND_CHECK = 1;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function GameModel( options ) {

    options = _.extend( {
      level: 0, // the current level in the game, numbered starting with zero
      numberOfLevels: 3, // number of levels in the game
      maxQuantity: RPALConstants.QUANTITY_RANGE.max // maximum quantity of any substance in a reaction
    }, options );

    // @public
    this.timerEnabledProperty = new BooleanProperty( false ); // {boolean} is the timer turned on?
    this.moleculesVisibleProperty = new BooleanProperty( true ); // {boolean} are molecules shown in the challenge?
    this.numbersVisibleProperty = new BooleanProperty( true ); // {boolean} are quantities shown in the challenge?

    // @public (read-only)
    this.levelProperty = new NumberProperty( 0 ); // {number} the current level, starts at 0 in the model, presented as starting from 1 in the view
    this.scoreProperty = new NumberProperty( 0 ); // {number} how many points the user has earned for the current game
    this.numberOfChallengesProperty = new NumberProperty( 0 ); // {number} the number of challenges in the current game being played
    this.challengeProperty = new Property( null ); // {Challenge} the current challenge being played
    this.challengeIndexProperty = new NumberProperty( -1 ); // {number} the index of the current challenge, -1 indicates no challenge
    this.gamePhaseProperty = new StringProperty( GamePhase.SETTINGS ); // {GamePhase} the current 'phase' of the game
    this.playStateProperty = new StringProperty( PlayState.NONE ); // {PlayState} the current 'play state' of the game

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

  reactantsProductsAndLeftovers.register( 'GameModel', GameModel );

  return inherit( Object, GameModel, {

    // @public Resets the model to its initial state.
    reset: function() {

      // reset Properties
      this.timerEnabledProperty.reset();
      this.moleculesVisibleProperty.reset();
      this.numbersVisibleProperty.reset();
      this.levelProperty.reset();
      this.scoreProperty.reset();
      this.numberOfChallengesProperty.reset();
      this.challengeProperty.reset();
      this.challengeIndexProperty.reset();
      this.gamePhaseProperty.reset();
      this.playStateProperty.reset();

      // reset scores and times for each level
      this.bestScoreProperties.forEach( function( property ) { property.set( 0 ); } );
      this.bestTimeProperties.forEach( function( property ) { property.set( null ); } );
    },

    // @private Advances to GamePhase.SETTINGS, shows the user-interface for selecting game settings
    settings: function() {
      this.timer.stop();
      this.playStateProperty.set( PlayState.NONE );
      this.gamePhaseProperty.set( GamePhase.SETTINGS ); // do this last, so that other stuff is set up before observers are notified
    },

    // @private Advances to GamePhase.PLAY, plays a game for the specified {number} level
    play: function( level ) {
      assert && assert( this.gamePhaseProperty.get() === GamePhase.SETTINGS );
      this.levelProperty.set( level );
      this.scoreProperty.set( 0 );
      this.initChallenges();
      this.timer.start();
      this.playStateProperty.set( PlayState.FIRST_CHECK );
      this.gamePhaseProperty.set( GamePhase.PLAY ); // do this last, so that other stuff is set up before observers are notified
    },

    // @private Advances to GamePhase.RESULTS, ends the current game and displays results
    results: function() {
      assert && assert( this.gamePhaseProperty.get() === GamePhase.PLAY );
      this.timer.stop();
      this.updateBestScore();
      this.updateBestTime();
      this.playStateProperty.set( PlayState.NONE );
      this.gamePhaseProperty.set( GamePhase.RESULTS ); // do this last, so that other stuff is set up before observers are notified
    },

    // @public Checks the current guess
    check: function() {
      const playState = this.playStateProperty.get();
      assert && assert( playState === PlayState.FIRST_CHECK || playState === PlayState.SECOND_CHECK );
      if ( this.challengeProperty.get().isCorrect() ) {
        // stop the timer as soon as we successfully complete the last challenge
        if ( this.challengeIndexProperty.get() === this.challenges.length - 1 ) {
          this.timer.stop();
        }
        const points = ( playState === PlayState.FIRST_CHECK ) ? POINTS_FIRST_CHECK : POINTS_SECOND_CHECK;
        this.challengeProperty.get().points = points;
        this.scoreProperty.set( this.scoreProperty.get() + points );
        this.playStateProperty.set( PlayState.NEXT );
      }
      else {
        this.playStateProperty.set( ( playState === PlayState.FIRST_CHECK ) ? PlayState.TRY_AGAIN : PlayState.SHOW_ANSWER );
      }
    },

    // @public Makes another attempt at solving the challenge
    tryAgain: function() {
      assert && assert( this.playStateProperty.get() === PlayState.TRY_AGAIN );
      this.playStateProperty.set( PlayState.SECOND_CHECK );
    },

    // @public Shows the correct answer
    showAnswer: function() {
      assert && assert( this.playStateProperty.get() === PlayState.SHOW_ANSWER );
      this.challengeProperty.get().showAnswer();
      this.playStateProperty.set( PlayState.NEXT );
    },

    // @public Advances to the next challenge
    next: function() {
      if ( this.challengeIndexProperty.get() === this.challenges.length - 1 ) {
        // game has been completed, advance to GamePhase.RESULTS
        this.results();
      }
      else {
        // advance to next challenge
        this.challengeIndexProperty.set( this.challengeIndexProperty.get() + 1 );
        this.challengeProperty.set( this.challenges[ this.challengeIndexProperty.get() ] );
        this.playStateProperty.set( PlayState.FIRST_CHECK );
      }
    },

    /**
     * Gets the number of challenges for the specified level.
     * @param {number} level
     * @returns {number}
     * @public
     */
    getNumberOfChallenges: function( level ) {
      return ChallengeFactory.getNumberOfChallenges( level );
    },

    /**
     * Gets the perfect score for the specified level.
     * @param {number} level
     * @returns {number}
     * @public
     */
    getPerfectScore: function( level ) {
      return ChallengeFactory.getNumberOfChallenges( level ) * POINTS_FIRST_CHECK;
    },

    /**
     * Is the current score perfect?
     * @returns {boolean}
     * @public
     */
    isPerfectScore: function() {
      return this.scoreProperty.get() === this.getPerfectScore( this.levelProperty.get() );
    },

    // @private Updates the best score for the current level.
    updateBestScore: function() {
      const level = this.levelProperty.get();
      if ( this.scoreProperty.get() > this.bestScoreProperties[ level ].get() ) {
        this.bestScoreProperties[ level ].set( this.scoreProperty.get() );
      }
    },

    // @private Updates the best time for the current level, at the end of a timed game with a perfect score.
    updateBestTime: function() {
      assert && assert( !this.timer.isRunningProperty.value );
      this.isNewBestTime = false;
      if ( this.timerEnabledProperty.get() && this.isPerfectScore() ) {
        const level = this.levelProperty.get();
        const time = this.timer.elapsedTimeProperty.value;
        if ( !this.bestTimeProperties[ level ].get() ) {
          // there was no previous time for this level
          this.bestTimeProperties[ level ].set( time );
        }
        else if ( time < this.bestTimeProperties[ level ].get() ) {
          // we have a new best time for this level
          this.bestTimeProperties[ level ].set( time );
          this.isNewBestTime = true;
        }
      }
    },

    // @private initializes a new set of challenges for the current level
    initChallenges: function() {
      this.challenges = ChallengeFactory.createChallenges( this.levelProperty.get(), this.maxQuantity, {
        moleculesVisible: this.moleculesVisibleProperty.get(),
        numbersVisible: this.numbersVisibleProperty.get()
      } );
      this.numberOfChallengesProperty.set( this.challenges.length );
      this.challengeIndexProperty.set( 0 );
      this.challengeProperty.set( this.challenges[ this.challengeIndexProperty.get() ] );
    },

    /**
     * DEBUG
     * Skips the current challenge.
     * Score and best times are meaningless after using this.
     * This is a developer feature.
     * @public
     */
    skipCurrentChallenge: function() {
      this.next();
    },

    /**
     * DEBUG
     * Replays the current challenge.
     * Score and best times are meaningless after using this.
     * This is a developer feature.
     * @public
     */
    replayCurrentChallenge: function() {
      this.challengeProperty.get().reset();
      this.playStateProperty.set( PlayState.FIRST_CHECK );
    }
  } );
} );
