// Copyright 2002-2014, University of Colorado Boulder

/**
 * Creates a sandwich by alternating ingredients, and attempts to put bread on top and bottom.
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
    var dy = -4;

    // slice of bread on the bottom
    if ( breadCount > 0 ) {
      this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
      centerY += dy;
      breadCount--;
    }

    // alternate between meat, cheese and bread
    var imageAdded = true;
    while ( imageAdded ) {
      imageAdded = false;
      if ( meatCount > 0 ) {
        this.addChild( new Image( meatImage, { centerX: 0, centerY: centerY } ) );
        centerY += dy;
        imageAdded = true;
        meatCount--;
      }
      if ( cheeseCount > 0 ) {
        this.addChild( new Image( cheeseImage, { centerX: 0, centerY: centerY } ) );
        centerY += dy;
        imageAdded = true;
        cheeseCount--;
      }
      if ( breadCount > 1 ) { // save one slice of bread for the top
        this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
        centerY += dy;
        imageAdded = true;
        breadCount--;
      }
    }

    // slice of bread on the top
    if ( breadCount > 0 ) {
      this.addChild( new Image( breadImage, { centerX: 0, centerY: centerY } ) );
    }

    this.mutate( options );
  }

  return inherit( Node, SandwichNode );
} );
