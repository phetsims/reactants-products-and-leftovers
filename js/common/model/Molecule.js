// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for molecules.
 * For purposes of the Sandwiches analogy, sandwiches and their ingredients are treated as molecules.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {String} symbol
   * @param {scenery.Node} node
   * @constructor
   */
  function Molecule( symbol, node ) {
    this.symbol = symbol;
    PropertySet.call( this, {
      node: node  //TODO make this immutable, use duck typing for sandwich components, with mutable sandwich node
    } );
  }

  return inherit( PropertySet, Molecule );
} );
