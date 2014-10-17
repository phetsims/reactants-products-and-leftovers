// Copyright 2002-2014, University of Colorado Boulder

//TODO make this go away
/**
 * Describes which things are visible while the user is solving a challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  return Object.freeze( {
    MOLECULES: 'MOLECULES',
    NUMBERS: 'NUMBERS',
    BOTH: 'BOTH'
  } );
} );