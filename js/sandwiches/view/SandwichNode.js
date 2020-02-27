// Copyright 2014-2020, University of Colorado Boulder

/**
 * Creates a sandwich by attempting to mimic how a person would make a sandwich.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  // images
  const breadImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/bread.png' );
  const cheeseImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/cheese.png' );
  const meatImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/meat.png' );

  // constants
  const MAX_WIDTH = _.maxBy( [ breadImage, cheeseImage, meatImage ], image => image.width ).width;
  const Y_SPACING = 4; // vertical space between centers of ingredients
  const SANDWICH_SCALE = 0.65; // default scale of Nodes for sandwiches and their ingredients

  class SandwichNode extends Node {
    /**
     * @param {number} breadCount
     * @param {number} meatCount
     * @param {number} cheeseCount
     * @param {Object} [options]
     */
    constructor( breadCount, meatCount, cheeseCount, options ) {

      assert && assert( breadCount >= 0 && meatCount >= 0 && cheeseCount >= 0 );

      options = merge( {
        scale: SANDWICH_SCALE
      }, options );

      super();

      let centerY = 0;

      // ensure that all sandwiches are the same width
      this.addChild( new HStrut( MAX_WIDTH, { centerX: 0 } ) );

      // Put a slice of bread on the bottom.
      if ( breadCount > 0 ) {
        this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
        centerY -= Y_SPACING;
        breadCount--;
      }

      /*
       * To maximize interleaving, order the ingredients that go between the bread
       * so that the more prevalent ingredient is added first.
       */
      let ingredients;
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
      let imageAdded = true;
      while ( imageAdded ) {

        imageAdded = false;

        // Add ingredients that go between the bread.
        ingredients.forEach( ingredient => {
          if ( ingredient.count > 0 ) {
            this.addChild( new Image( ingredient.image, { centerX: 0, centerY: centerY } ) );
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

    // @static @public create Nodes for individual ingredients
    static createBreadNode() { return new Image( breadImage, { scale: SANDWICH_SCALE } ); }
    static createMeatNode() { return new Image( meatImage, { scale: SANDWICH_SCALE } ); }
    static createCheeseNode() { return new Image( cheeseImage, { scale: SANDWICH_SCALE } ); }
  }

  return reactantsProductsAndLeftovers.register( 'SandwichNode', SandwichNode );
} );
