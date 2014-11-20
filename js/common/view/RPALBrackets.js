// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Reactants', 'Products' and 'Leftovers' brackets that appear below 'Before' and 'After' boxes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBracketNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HBracketNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var leftoversString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/leftovers' );
  var productsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/products' );
  var reactantsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants' );

  // constants
  var BRACKET_LABEL_OPTIONS = { font: new RPALFont( 12 ), fill: 'black' };
  var BRACKET_X_MARGIN = 6; // amount that brackets extend beyond the things they bracket
  var MAX_BRACKET_LABEL_WIDTH = 140; // maximum width of bracket labels, determined by eye

  /**
   * @param {number} reactantsWidth
   * @param {number} reactantsCenterX
   * @param {number} productsWidth
   * @param {number} productsCenterX
   * @param {number} leftOversWidth
   * @param {number} leftOversCenterX
   * @param {number} maxImageWidth max width of the all reactant and product icons
   * @param {Object} [options]
   * @constructor
   */
  function RPALBrackets( reactantsWidth, reactantsCenterX, productsWidth, productsCenterX, leftOversWidth, leftOversCenterX, maxImageWidth, options ) {

    // reactants bracket
    var reactantsLabel = new Text( reactantsString, BRACKET_LABEL_OPTIONS );
    reactantsLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / reactantsLabel.width ) ); // i18n
    var reactantsBracket = new HBracketNode( {
      bracketColor: RPALColors.PANEL_FILL,
      labelNode: reactantsLabel,
      bracketWidth: Math.max( maxImageWidth, reactantsWidth + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: reactantsCenterX
    } );

    // products bracket
    var productsLabel = new Text( productsString, BRACKET_LABEL_OPTIONS );
    productsLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / productsLabel.width ) ); // i18n
    var productsBracket = new HBracketNode( {
      bracketColor: RPALColors.PANEL_FILL,
      labelNode: productsLabel,
      bracketWidth: Math.max( maxImageWidth, productsWidth + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: productsCenterX
    } );

    // leftovers bracket
    var leftoversLabel = new Text( leftoversString, BRACKET_LABEL_OPTIONS );
    leftoversLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / leftoversLabel.width ) ); // i18n
    var leftoversBracket = new HBracketNode( {
      bracketColor: RPALColors.PANEL_FILL,
      labelNode: leftoversLabel,
      bracketWidth: Math.max( maxImageWidth, leftOversWidth + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: leftOversCenterX
    } );

    options.children = [ reactantsBracket, productsBracket, leftoversBracket ];
    Node.call( this, options );
  }

  return inherit( Node, RPALBrackets );
} );
