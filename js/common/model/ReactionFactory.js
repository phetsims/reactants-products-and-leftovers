// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory functions for creating specific chemical reactions
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var MoleculeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/MoleculeFactory' );
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );

  // strings
  var makeWaterString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/makeWater' );

  return {

    //---------------------------------------------------------------------------------------
    // Single-product reactions
    //---------------------------------------------------------------------------------------

    // 2H2 + O2 -> 2H2O
    water: function() {
      return new Reaction(
        [ new Reactant( 2, MoleculeFactory.H2() ), new Reactant( 1, MoleculeFactory.O2() ) ],
        [ new Product( 2, MoleculeFactory.H2O() ) ],
        { name: makeWaterString } );
    },

    // H2 + F2 -> 2HF
    H2_F2__2HF: function() {
      return new Reaction(
        [ new Reactant( 1, MoleculeFactory.H2() ), new Reactant( 1, MoleculeFactory.F2() ) ],
        [ new Product( 2, MoleculeFactory.HF() ) ] );
    },

    // H2 + Cl2 -> 2HCl
    H2_Cl2__2HCl: function() {
      return new Reaction(
        [ new Reactant( 1, MoleculeFactory.H2() ), new Reactant( 1, MoleculeFactory.Cl2() ) ],
        [ new Product( 2, MoleculeFactory.HCl() ) ] );
    }

    //TODO add additional reactions from java.OneProductReactions

    //---------------------------------------------------------------------------------------
    // Two-product reactions
    //---------------------------------------------------------------------------------------

    //TODO add reactions from java.TwoProductReactions
  };
} );