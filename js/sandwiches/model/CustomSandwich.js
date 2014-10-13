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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var customString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/custom' );
  var noReactionString = '?'; //TODO showing "no reaction" creates big layout problems, we don't have room

  function CustomSandwich() {

    var thisReaction = this;

    var bread = new Reactant( 0, MoleculeFactory.bread() );
    var meat =  new Reactant( 0, MoleculeFactory.meat() );
    var cheese = new Reactant( 0, MoleculeFactory.cheese() );
    var sandwich = new Product( 1, new Molecule( 'customSandwich', null ) ); // sandwich image will be updated below

    Reaction.call( thisReaction, [ bread, meat, cheese ], [ sandwich ], { name: customString, reactantCoefficientsMutable: true } );

    // Update the sandwich image to match the coefficients.
    var updateNode = function() {
      if ( bread.coefficient + meat.coefficient + cheese.coefficient === 0 ) {
        sandwich.molecule.node = new Text( noReactionString, { font: new PhetFont( 24 ), fill: 'white' } );
      }
      else {
        sandwich.molecule.node = new SandwichNode( bread.coefficient, meat.coefficient, cheese.coefficient, { scale: RPALConstants.SANDWICH_IMAGE_SCALE } );
      }
    };
    this.reactants.forEach( function( reactant ) {
      reactant.coefficientProperty.link( updateNode );
    } );
  }

  return inherit( Reaction, CustomSandwich );
} );
