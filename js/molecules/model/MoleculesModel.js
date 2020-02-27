// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const ReactionFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/ReactionFactory' );
  const RPALBaseModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/RPALBaseModel' );

  class MoleculesModel extends RPALBaseModel {

    constructor() {
      super( [
        // reaction choices
        ReactionFactory.makeWater(),
        ReactionFactory.makeAmmonia(),
        ReactionFactory.combustMethane()
      ] );
    }
  }

  return reactantsProductsAndLeftovers.register( 'MoleculesModel', MoleculesModel );
} );
