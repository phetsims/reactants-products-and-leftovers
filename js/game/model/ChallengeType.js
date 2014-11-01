// Copyright 2002-2014, University of Colorado Boulder

/**
 * The type of challenge is determined by whether the user must guess the reaction's 'Before' or 'After' quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  require( 'SCENERY/scenery' ); //TODO remove this workaround for scenery#300

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  var ChallengeType = {
    BEFORE: 'BEFORE',
    AFTER: 'AFTER'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) {
    Object.freeze && Object.freeze( ChallengeType );
  }

  return ChallengeType;
} );