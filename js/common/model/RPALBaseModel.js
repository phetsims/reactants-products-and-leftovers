// Copyright 2014-2015, University of Colorado Boulder

/**
 * Base type for the model in the 'Sandwiches' and 'Molecules' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  /**
   * @param {Reaction[]} reactions
   * @constructor
   */
  function RPALBaseModel( reactions ) {

    this.reactions = reactions; // @public {Reaction[]} reaction choices

    PropertySet.call( this, {
      reaction: this.reactions[ 0 ] // @public {Reaction} the selected reaction
    } );
  }

  reactantsProductsAndLeftovers.register( 'RPALBaseModel', RPALBaseModel );

  return inherit( PropertySet, RPALBaseModel, {

    // @override @public
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.reactions.forEach( function( reaction ) { reaction.reset(); } );
    }
  } );
} );
