// Copyright 2002-2014, University of Colorado Boulder

/**
 * The type of challenge is determined by whether the user must guess the reaction's 'Before' or 'After' quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  // NOTE: enum pattern recommends using {} for each value, but strings are more convenient for debugging
  return Object.freeze( {
    BEFORE: 'BEFORE',
    AFTER: 'AFTER'
  } );
} );