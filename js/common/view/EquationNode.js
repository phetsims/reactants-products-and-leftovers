// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays the equation for a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var COEFFICIENT_X_SPACING = 10;
  var PLUS_X_SPACING = 20;
  var ARROW_X_SPACING = 20;
  var TEXT_OPTIONS = { font: new PhetFont( 28 ), fill: 'white' };
  var PLUS_OPTIONS = { fill: 'white' };
  var ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };

  /**
   * Adds terms to the equation.
   * @param {Node} thisNode the node to add terms to
   * @param {[Substance]} terms the terms to be added
   * @param {number} capHeight the height of a capital letter with no descender, for layout
   * @param {number} leftStart the left position of the first term to be added
   * @returns {Node} the last node added
   */
  var addTerms = function( thisNode, terms, capHeight, leftStart ) {

    var coefficientNode, symbolNode, plusNode; // hoist loop vars explicitly
    var numberOfReactants = terms.length;

    for ( var i = 0; i < numberOfReactants; i++ ) {

      // coefficient
      coefficientNode = new Text( terms[i].coefficient, TEXT_OPTIONS );
      thisNode.addChild( coefficientNode );
      coefficientNode.left = plusNode ? ( plusNode.right + PLUS_X_SPACING ) : leftStart;

      // symbol
      symbolNode = new SubSupText( terms[i].molecule.symbol, TEXT_OPTIONS );
      thisNode.addChild( symbolNode );
      symbolNode.left = coefficientNode.right + COEFFICIENT_X_SPACING;

      // plus sign between terms
      if ( i < numberOfReactants - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        thisNode.addChild( plusNode );
        plusNode.left = symbolNode.right + PLUS_X_SPACING;
        plusNode.centerY = symbolNode.top + ( capHeight / 2 );
      }
      else {
        plusNode = null;
      }
    }

    return symbolNode; // the last node that was added
  };

  /**
   * @param {Reaction} reaction
   * @param {*} options
   * @constructor
   */
  function EquationNode( reaction, options ) {

    Node.call( this );

    // determine cap height of the font, using a char that has no descender
    var capHeight = new SubSupText( "T", TEXT_OPTIONS ).height;

    // left-hand side of the formula (reactants)
    var lastNode = addTerms( this, reaction.reactants, capHeight, 0 );

    // right arrow
    var arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = lastNode.right + ARROW_X_SPACING;
    arrowNode.centerY = lastNode.top + ( capHeight / 2 );
    this.addChild( arrowNode );

    // right-hand side of the formula (products)
    addTerms( this, reaction.products, capHeight, arrowNode.right + ARROW_X_SPACING );

    this.mutate( options );
  }

  return inherit( Node, EquationNode );
} );