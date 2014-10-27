// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {GameModel} model
   * @param {Challenge} challenge
   * @param {Bounds2} challengeBounds
   * @param {GameAudioPlayer} audioPlayer
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeView( model, challenge, challengeBounds, audioPlayer, options ) {
    Node.call( this );
    this.mutate( options );
  }

  return inherit( Node, ChallengeView );
} );
