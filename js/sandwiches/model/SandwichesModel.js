// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Sandwiches' screen.
 * <p>
 * For the purposes of the 'sandwiches' analogy:
 * <ul>
 * <li>sandwich recipe == reaction
 * <li>ingredients == reactants
 * <li>sandwich == product
 * </ul>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var SandwichRecipe = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/SandwichRecipe' );

  // strings
  var cheeseString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/cheese' );
  var customString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/custom' );
  var meatAndCheeseString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/meatAndCheese' );

  function SandwichesModel() {

    // sandwich recipe (reaction) choices, numeric args are: bread, meat, cheese
    this.reactions = [
      new SandwichRecipe( cheeseString, 2, 0, 1 ),
      new SandwichRecipe( meatAndCheeseString, 2, 1, 1 ),
      new SandwichRecipe( customString, 0, 0, 0, { coefficientsMutable: true } )
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
