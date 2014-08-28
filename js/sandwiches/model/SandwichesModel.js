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
      ReactionFactory.cheeseSandwich(),
      ReactionFactory.meatAndCheeseSandwich()
      //TODO add 'custom' sandwich
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
