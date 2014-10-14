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

    Node.call( this );

    var centerY = 0;

    // put a slice of bread on the bottom
    if ( breadCount > 0 ) {
      this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
      centerY -= Y_SPACING;
      breadCount--;
    }

    // interleave ingredients
    var imageAdded = true;
    while ( imageAdded ) {

      imageAdded = false;

      //TODO simplify this
      // to maximize interleaving, always add the more prevalent ingredient first
      if ( meatCount >= cheeseCount ) {
        // add meat, then cheese
        if ( meatCount > 0 ) {
          this.addChild( new Image( meatImage, { centerX: 0, centerY: centerY } ) );
          centerY -= Y_SPACING;
          imageAdded = true;
          meatCount--;
        }
        if ( cheeseCount > 0 ) {
          this.addChild( new Image( cheeseImage, { centerX: 0, centerY: centerY } ) );
          centerY -= Y_SPACING;
          imageAdded = true;
          cheeseCount--;
        }
      }
      else {
        // add cheese, then meat
        if ( cheeseCount > 0 ) {
          this.addChild( new Image( cheeseImage, { centerX: 0, centerY: centerY } ) );
          centerY -= Y_SPACING;
          imageAdded = true;
          cheeseCount--;
        }
        if ( meatCount > 0 ) {
          this.addChild( new Image( meatImage, { centerX: 0, centerY: centerY } ) );
          centerY -= Y_SPACING;
          imageAdded = true;
          meatCount--;
        }
      }

      // ... followed by bread.
      if ( breadCount > 1 ) { // save one slice of bread for the top
        this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
        centerY -= Y_SPACING;
        imageAdded = true;
        breadCount--;
      }
    }

    // put a slice of bread on the top
    if ( breadCount > 0 ) {
      this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
    }

    this.mutate( options );
  }

  return inherit( Node, SandwichNode );
} );
