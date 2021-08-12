// Copyright 2014-2020, University of Colorado Boulder

/**
 * Creates a sandwich by attempting to mimic how a person would make a sandwich.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import bread_png from '../../../images/bread_png.js';
import cheese_png from '../../../images/cheese_png.js';
import meat_png from '../../../images/meat_png.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

// constants
const MAX_WIDTH = _.maxBy( [ bread_png, cheese_png, meat_png ], image => image.width ).width;
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
      this.addChild( new Image( bread_png, { centerX: 0, centerY: centerY } ) );
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
        { count: meatCount, image: meat_png },
        { count: cheeseCount, image: cheese_png }
      ];
    }
    else {
      ingredients = [
        { count: cheeseCount, image: cheese_png },
        { count: meatCount, image: meat_png }
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
        this.addChild( new Image( bread_png, { centerX: 0, centerY: centerY } ) );
        centerY -= Y_SPACING;
        imageAdded = true;
        breadCount--;
      }
    }

    // Put a slice of bread on the top.
    if ( breadCount > 0 ) {
      this.addChild( new Image( bread_png, { centerX: 0, centerY: centerY } ) );
    }

    this.mutate( options );
  }

  // @public
  static createBreadNode() { return new Image( bread_png, { scale: SANDWICH_SCALE } ); }

  // @public
  static createMeatNode() { return new Image( meat_png, { scale: SANDWICH_SCALE } ); }

  // @public
  static createCheeseNode() { return new Image( cheese_png, { scale: SANDWICH_SCALE } ); }
}

reactantsProductsAndLeftovers.register( 'SandwichNode', SandwichNode );
export default SandwichNode;