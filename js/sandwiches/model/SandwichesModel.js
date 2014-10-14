// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ReactionFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/ReactionFactory' );

  function SandwichesModel() {

    // reaction choices
    this.reactions = [
      ReactionFactory.cheeseSandwich( 2, 1 ), // bread, cheese
      ReactionFactory.meatAndCheeseSandwich( 2, 1, 1 ), // bread, meat, cheese
      ReactionFactory.customSandwich( 0, 0, 0 ) // bread, meat, cheese
    ];

    PropertySet.call( this, {
      reaction: this.reactions[0] // the selected reaction
    } );
  }

  return inherit( PropertySet, SandwichesModel, {

    // @override
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.reactions.forEach( function( reaction ) { reaction.reset(); } );
    }
  } );
} );
