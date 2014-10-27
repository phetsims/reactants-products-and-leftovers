// Copyright 2002-2014, University of Colorado Boulder

/**
 * A reactant is a substance that is initially involved in a chemical reaction.
 * The reactants that do not transform to products are referred to herein as leftovers.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  /**
   * @param {number} coefficient reactant's coefficient in the reaction equation
   * @param {string} symbol used in reaction equation
   * @param {Node} node visual representation of the reactant
   * @param {number} quantity how much of the reactant we have before the reaction occurs
   * @param {number} [leftovers] how much of the reactant we have after the reaction occurs, default to zero
   * @constructor
   */
  function Reactant( coefficient, symbol, node, quantity, leftovers ) {
    Substance.call( this, coefficient, symbol, node, quantity );
    this.addProperty( 'leftovers', leftovers || 0 );
  }

  return inherit( Substance, Reactant, {

    /*
     * Are 2 reactants the same?
     * @param {Reactant} reactants
     * @return {boolean}
     * @override
     */
    equals: function( reactant ) {
      return reactant instanceof Reactant &&
             Substance.prototype.equals.call( this, reactant ) &&
             this.leftovers === reactant.leftovers;
    }
  }, {

    // @static
    clone: function( reactant ) {
      return new Reactant( reactant.coefficient, reactant.symbol, reactant.node, reactant.quantity, reactant.leftovers );
    }
  } );
} );
