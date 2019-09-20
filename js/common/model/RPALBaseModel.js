// Copyright 2014-2019, University of Colorado Boulder

/**
 * Base type for the model in the 'Sandwiches' and 'Molecules' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  /**
   * @param {Reaction[]} reactions
   * @constructor
   */
  function RPALBaseModel( reactions ) {

    this.reactions = reactions; // @public {Reaction[]} reaction choices
    this.reactionProperty = new Property( this.reactions[ 0 ] ); // @public {Reaction} the selected reaction
  }

  reactantsProductsAndLeftovers.register( 'RPALBaseModel', RPALBaseModel );

  return inherit( Object, RPALBaseModel, {

    // @override @public
    reset: function() {
      this.reactionProperty.reset();
      this.reactions.forEach( function( reaction ) { reaction.reset(); } );
    }
  } );
} );
