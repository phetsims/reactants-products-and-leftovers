// Copyright 2002-2014, University of Colorado Boulder

/**
 * Recipe for a sandwich. For the purposes of the "sandwiches" analogy, a sandwich recipe is treated like a reaction.
 * A custom sandwich has mutable reactant coefficients, and the sandwich image changes based on those coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Molecule = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Molecule' );
  var MoleculeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/MoleculeFactory' );
  var Product = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Product' );
  var Reactant = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reactant' );
  var Reaction = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Reaction' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var SandwichNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichNode' );

  // images
  var breadImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/bread.png' );
  var cheeseImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/cheese.png' );
  var meatImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/meat.png' );

  // constants
  var NO_SANDWICH_NODE = new Rectangle( 0, 0, 5, 5 ); // used when the product is undefined, any invisible node with well-defined bounds

  // sandwich ingredients (names are internal, no i18n required)
  var createBread = function() { return new Molecule( 'bread', new Image( breadImage, { scale: RPALConstants.SANDWICH_IMAGE_SCALE } ) ); };
  var createMeat = function() { return new Molecule( 'meat', new Image( meatImage, { scale: RPALConstants.SANDWICH_IMAGE_SCALE } ) ); };
  var createCheese = function() { return new Molecule( 'cheese', new Image( cheeseImage, { scale: RPALConstants.SANDWICH_IMAGE_SCALE } ) ); };

  /**
   * @param {string} name
   * @param {number} breadCount
   * @param {number} meatCount
   * @param {number} cheeseCount
   * @param {Object} [options]
   * @constructor
   */
  function SandwichRecipe( name, breadCount, meatCount, cheeseCount, options ) {

    options = _.extend( {
      coefficientsMutable: false // {boolean} can coefficients of the ingredients can be changed?
    }, options );

    var thisReaction = this;
    this.coefficientsMutable = options.coefficientsMutable;

    var bread = new Reactant( breadCount, createBread() );
    var meat =  new Reactant( meatCount, createMeat() );
    var cheese = new Reactant( cheeseCount, createCheese() );
    var sandwich = new Product( 1, new Molecule( 'sandwich', NO_SANDWICH_NODE ) ); // sandwich image will be updated below

    var reactants;
    if ( options.coefficientsMutable ) {
      // if coefficients are mutable, include all ingredients
      reactants = [ bread, meat, cheese ];
    }
    else {
      // if coefficients are immutable, include all non-zero ingredients
      reactants = [];
      if ( breadCount > 0 ) { reactants.push( bread ); }
      if ( meatCount > 0 ) { reactants.push( meat ); }
      if ( cheeseCount > 0 ) { reactants.push( cheese ); }
    }

    Reaction.call( thisReaction, reactants, [ sandwich ], { name: name } );

    if ( options.coefficientsMutable ) {

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
        reactant.coefficientProperty.link( thisReaction.update.bind( thisReaction ) );
        reactant.coefficientProperty.link( updateNode );
      } );
    }
    else {
      assert && assert( thisReaction.isReaction() );
      sandwich.molecule.node = new SandwichNode( bread.coefficient, meat.coefficient, cheese.coefficient,
        { scale: RPALConstants.SANDWICH_IMAGE_SCALE } );
    }
  }

  return inherit( Reaction, SandwichRecipe );
} );
