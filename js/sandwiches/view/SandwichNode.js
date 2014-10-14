// Copyright 2002-2014, University of Colorado Boulder

/**
 * Creates a sandwich by attempting to mimic how a person would make a sandwich.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  // images
  var breadImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/bread.png' );
  var cheeseImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/cheese.png' );
  var meatImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/meat.png' );

  // constants
  var Y_SPACING = 3; // vertical space between centers of ingredients

  /**
   * @param {number} breadCount
   * @param {number} meatCount
   * @param {number} cheeseCount
   * @param {Object} [options]
   * @constructor
   */
  function SandwichNode( breadCount, meatCount, cheeseCount, options ) {

    assert && assert( breadCount >= 0 && meatCount >= 0 && cheeseCount >= 0 );

    var thisNode = this;
    Node.call( this );

    var centerY = 0;

    // Put a slice of bread on the bottom.
    if ( breadCount > 0 ) {
      this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
      centerY -= Y_SPACING;
      breadCount--;
    }

    // To maximize interleaving, order the ingredients that go between the bread so that the more prevalent ingredient is added first.
    var ingredients;
    if ( meatCount >= cheeseCount ) {
      ingredients = [
        { count: meatCount, image: meatImage },
        { count: cheeseCount, image: cheeseImage }
      ];
    }
    else {
      ingredients = [
        { count: cheeseCount, image: cheeseImage },
        { count: meatCount, image: meatImage }
      ];
    }

    // Interleave ingredients
    var imageAdded = true;
    while ( imageAdded ) {

      imageAdded = false;

      // Add ingredients that go between the bread.
      ingredients.forEach( function( ingredient ) {
        if ( ingredient.count > 0 ) {
          thisNode.addChild( new Image( ingredient.image, { centerX: 0, centerY: centerY } ) );
          centerY -= Y_SPACING;
          imageAdded = true;
          ingredient.count--;
        }
      } );

      // Add a slice of bread, but save one slice of bread for the top.
      if ( breadCount > 1 ) {
        this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
        centerY -= Y_SPACING;
        imageAdded = true;
        breadCount--;
      }
    }

    // Put a slice of bread on the top.
    if ( breadCount > 0 ) {
      this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
    }

    this.mutate( options );
  }

  return inherit( Node, SandwichNode );
} );
