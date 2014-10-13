// Copyright 2002-2014, University of Colorado Boulder

//TODO change sandwich image or "no reaction" text based on reactant coefficients
/**
 * A custom sandwich has mutable reactant coefficients, and the sandwich image changes based on those coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/MoleculeFactory' );
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );

  // strings
  var customString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/custom' );

  function CustomSandwich() {
    Reaction.call( this,
      //TODO initial coefficients should be 0
      [ new Reactant( 3, MoleculeFactory.bread() ), new Reactant( 3, MoleculeFactory.meat() ), new Reactant( 3, MoleculeFactory.cheese() ) ],
      [ new Product( 1, MoleculeFactory.sandwich( 'customSandwich', 3, 3, 3 ) ) ],
      { name: customString, reactantCoefficientsMutable: true } );
  }

  return inherit( Reaction, CustomSandwich );
} );
