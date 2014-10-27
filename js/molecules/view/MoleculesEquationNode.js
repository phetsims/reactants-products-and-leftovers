// Copyright 2002-2014, University of Colorado Boulder

//TODO move to rpal.common.view, since this will also be used in Game screen?
/**
 * Equation for the 'Molecules' screen. Coefficients are immutable and molecule symbols are displayed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  //TODO these constants are also defined in SandwichesEquationNode, will they potentially be different?
  // constants
  var COEFFICIENT_X_SPACING = 8; // space between coefficient and node to its right
  var PLUS_X_SPACING = 15; // space on both sides of the plus signs
  var ARROW_X_SPACING = 15; // space on both sides of arrow
  var TEXT_OPTIONS = { font: new RPALFont( 28 ), fill: 'white' };
  var PLUS_OPTIONS = { fill: 'white' };
  var ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };

  /**
   * Creates terms for equation.
   * @param {Substance[]} terms the terms to be added
   * @returns {Node}
   */
  var createTermsNode = function( terms ) {

    var parentNode = new Node();
    var numberOfTerms = terms.length;
    var coefficientNode, symbolNode, plusNode; // hoist loop vars explicitly

    for ( var i = 0; i < numberOfTerms; i++ ) {

      // coefficient
      coefficientNode = new Text( terms[i].coefficient, TEXT_OPTIONS );
      coefficientNode.left = plusNode ? ( plusNode.right + PLUS_X_SPACING ) : 0;
      parentNode.addChild( coefficientNode );

      // molecule
      symbolNode = new SubSupText( terms[i].symbol, TEXT_OPTIONS );
      symbolNode.left = coefficientNode.right + COEFFICIENT_X_SPACING;
      parentNode.addChild( symbolNode );

      // plus sign between terms
      if ( i < numberOfTerms - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        plusNode.left = symbolNode.right + PLUS_X_SPACING;
        plusNode.centerY = coefficientNode.centerY;
        parentNode.addChild( plusNode );
      }
      else {
        plusNode = null;
      }
    }

    return parentNode;
  };

  /**
   * @param {Reaction} reaction
   * @param {Object} [options]
   * @constructor
   */
  function MoleculesEquationNode( reaction, options ) {

    Node.call( this );

    // left-hand side (reactants)
    var reactantsNode = createTermsNode( reaction.reactants );
    this.addChild( reactantsNode );

    // right arrow
    var arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = reactantsNode.right + ARROW_X_SPACING;
    var coefficientHeight = new Text( '1', TEXT_OPTIONS ).height;
    arrowNode.centerY = reactantsNode.top + ( coefficientHeight / 2 );
    this.addChild( arrowNode );

    // right-hand side (products)
    var productsNode = createTermsNode( reaction.products );
    productsNode.left = arrowNode.right + ARROW_X_SPACING;
    this.addChild( productsNode );

    this.mutate( options );
  }

  return inherit( Node, MoleculesEquationNode );
} );