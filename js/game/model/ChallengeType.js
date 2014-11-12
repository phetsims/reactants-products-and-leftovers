// Copyright 2002-2014, University of Colorado Boulder

/**
 * The type of challenge is determined by whether the user must guess the reaction's 'Before' or 'After' quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  var ChallengeType = {
    BEFORE: 'BEFORE', // guess the reactant quantities, before the reaction started
    AFTER: 'AFTER' // guess the product and leftover quantities, after the reaction occurs
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) {
    Object.freeze && Object.freeze( ChallengeType );
  }

  return ChallengeType;
} );