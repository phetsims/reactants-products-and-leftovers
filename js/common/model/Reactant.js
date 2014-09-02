// Copyright 2002-2014, University of Colorado Boulder

/**
 * A reactant is a substance that is initially involved in a chemical reaction.
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
  function Reactant( coefficient, molecule, quantity ) {
    Substance.call( this, coefficient, molecule, quantity );
    this.addProperty( 'leftovers', 0 );
  }

  return inherit( Substance, Reactant, {

    /*
     * Are 2 reactants the same?
     * @param {Reactant} reactants
     * @return {Boolean}
     * @override
     */
    equals: function( reactant ) {
      return reactant instanceof Reactant &&
             Substance.prototype.equals.call( this, reactant ) &&
             this.leftovers && this.leftovers === reactant.leftovers; //TODO this looks wrong
    }
  } );
} );
