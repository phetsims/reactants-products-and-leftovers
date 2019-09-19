// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const ReactionFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/ReactionFactory' );
  const RPALBaseModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/RPALBaseModel' );

  /**
   * @constructor
   */
  function MoleculesModel() {
    RPALBaseModel.call( this,
      // reaction choices
      [
        ReactionFactory.makeWater(),
        ReactionFactory.makeAmmonia(),
        ReactionFactory.combustMethane()
      ] );
  }

  reactantsProductsAndLeftovers.register( 'MoleculesModel', MoleculesModel );

  return inherit( RPALBaseModel, MoleculesModel );
} );
