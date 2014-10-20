// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );

  function GameModel() {

    PropertySet.call( this, {
      level: 0
    } );

    var challenges = ChallengeFactory.createChallenges( RPALConstants.CHALLENGES_PER_GAME, this.level, RPALConstants.QUANTITY_RANGE.max ); //XXX test

    //TODO
  }

  return inherit( PropertySet, GameModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      //TODO reset other things?
    }
  } );
} );
