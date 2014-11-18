// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays the answer to the current challenge, for debugging purposes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DevStringUtils = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevStringUtils' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Property.<Challenge>} challengeProperty
   * @constructor
   */
  function DevAnswerNode( challengeProperty, options ) {

    options = options || {};

    var textNode = new Text( '', { fill: 'red', font: new RPALFont( 12 ) } );
    challengeProperty.link( function( challenge ) {
      if ( challenge ) { // challenge will be null on startup and 'Reset All'
        textNode.text = DevStringUtils.quantitiesString( challenge.reaction.reactants, challenge.reaction.products );
        textNode.centerX = 0;
      }
    } );

    // Text wrapped in Node so that we can keep the text horizontally centered
    options.children = [ textNode ];
    Node.call( this, options );
  }

  return inherit( Node, DevAnswerNode );
} );
