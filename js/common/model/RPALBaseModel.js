// Copyright 2002-2014, University of Colorado Boulder

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

  function RPALBaseModel( reactions ) {

    this.reactions = reactions; // reaction choices

    PropertySet.call( this, {
       reaction: this.reactions[0] // {Reaction} the selected reaction
    } );
  }

  return inherit( PropertySet, RPALBaseModel, {

    // @override
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.reactions.forEach( function( reaction ) { reaction.reset(); } );
    }
  } );
} );
