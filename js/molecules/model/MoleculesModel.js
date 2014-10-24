// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ReactionFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/ReactionFactory' );
  var ReactionModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/ReactionModel' );

  function MoleculesModel() {
    ReactionModel.call( this, [
      // reaction choices
      ReactionFactory.makeWater(),
      ReactionFactory.makeAmmonia(),
      ReactionFactory.combustMethane()
    ] );
  }

  return inherit( ReactionModel, MoleculesModel );
} );
