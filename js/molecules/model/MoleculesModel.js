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
  var PropertySet = require( 'AXON/PropertySet' );
  var ReactionFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/ReactionFactory' );

  function MoleculesModel() {

    // reaction choices
    this.reactions = [
       ReactionFactory.makeWater(),
       ReactionFactory.makeAmmonia(),
       ReactionFactory.combustMethane()
    ];

    PropertySet.call( this, {
       reaction: this.reactions[0] // the selected reaction
    } );
  }

  return inherit( PropertySet, MoleculesModel, {

    // @override
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.reactions.forEach( function( reaction ) { reaction.reset(); } );
    }
  } );
} );
