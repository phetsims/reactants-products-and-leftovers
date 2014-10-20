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
  var ChallengeVisibility = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeVisibility' );
  var inherit = require( 'PHET_CORE/inherit' );

  function GameModel() {
    var challenges = ChallengeFactory.createChallenges( 5, 0, 8, ChallengeVisibility.BOTH ); //XXX test
    //TODO
  }

  return inherit( Object, GameModel, {
    reset: function() {
      //TODO
    }
  } );
} );
