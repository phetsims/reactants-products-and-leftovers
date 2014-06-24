// Copyright 2002-2014, University of Colorado Boulder

//TODO eliminate this? it was a marker type in Java implementation
/**
 * Chemical reactions yield one or more products, which have properties different from the reactants.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  /**
   * @param {Number} coefficient
   * @param {Molecule} molecule
   * @param {Number} quantity
   * @constructor
   */
  function Product( coefficient, molecule, quantity ) {
    Substance.call( this, coefficient, molecule, quantity );
  }

  return inherit( Substance, Product );
} );
