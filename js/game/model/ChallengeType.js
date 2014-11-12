// Copyright 2002-2014, University of Colorado Boulder

/**
 * The type of challenge is determined by whether the user must guess the reaction's 'Before' or 'After' quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // enum values: use {} for production, use strings for debugging
  var ChallengeType = {
    BEFORE: assert ? 'BEFORE' : {}, // guess the reactant quantities, before the reaction started
    AFTER: assert ? 'AFTER' : {} // guess the product and leftover quantities, after the reaction occurs
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( ChallengeType ); }

  return ChallengeType;
} );