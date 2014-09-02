// Copyright 2002-2014, University of Colorado Boulder

/**
 * A substance is a participant in a chemical reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Number} coefficient
   * @param {Molecule} molecule
   * @param {Number} quantity
   * @constructor
   */
  function Substance( coefficient, molecule, quantity ) {
    this.coefficient = coefficient;
    this.molecule = molecule;
    PropertySet.call( this, {
      quantity: quantity || 0
    } );
  }

  return inherit( PropertySet, Substance, {

    /*
     * Are 2 substances the same?
     * @param {Substance} substance
     * @return {Boolean}
     */
    equals: function( substance ) {
      return ( substance instanceof Substance &&
               this.coefficient === substance.coefficient &&
               this.molecule === substance.molecule &&
               this.quantity === substance.quantity );
    }
  } );
} );
