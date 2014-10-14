// Copyright 2002-2014, University of Colorado Boulder

/**
 * A custom sandwich has mutable reactant coefficients, and the sandwich image changes based on those coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Molecule = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Molecule' );
  var MoleculeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/MoleculeFactory' );
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );

  // strings
  var customString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/custom' );

  // constants
  var NO_SANDWICH_NODE = new Rectangle( 0, 0, 5, 5 ); // used when the product is undefined, any invisible node with well-defined bounds

  function CustomSandwich( breadCount, meatCount, cheeseCount ) {

    var thisReaction = this;

    var bread = new Reactant( breadCount, MoleculeFactory.bread() );
    var meat =  new Reactant( meatCount, MoleculeFactory.meat() );
    var cheese = new Reactant( cheeseCount, MoleculeFactory.cheese() );
    var sandwich = new Product( 1, new Molecule( 'customSandwich', NO_SANDWICH_NODE ) ); // sandwich image will be updated below

    Reaction.call( thisReaction, [ bread, meat, cheese ], [ sandwich ],
      { name: customString, reactantCoefficientsMutable: true } );

    // Update the sandwich image to match the coefficients.
    var updateNode = function() {
      if ( thisReaction.isReaction() ) {
        sandwich.molecule.node = new SandwichNode( bread.coefficient, meat.coefficient, cheese.coefficient,
          { scale: RPALConstants.SANDWICH_IMAGE_SCALE } );
      }
      else {
        sandwich.molecule.node = NO_SANDWICH_NODE;
      }
    };
    this.reactants.forEach( function( reactant ) {
      reactant.coefficientProperty.link( updateNode );
    } );
  }

  return inherit( Reaction, CustomSandwich );
} );
