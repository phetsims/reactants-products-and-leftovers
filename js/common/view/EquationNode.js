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
  var ARROW_X_SPACING = 20;
  var COEFFICIENT_X_SPACING = 10;
  var PLUS_X_SPACING = 20;
  var PLUS_OPTIONS = { fill: 'white' };
  var ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };
  var TEXT_OPTIONS = { font: new PhetFont( 28 ), fill: 'white' };

  /**
   * @param {Reaction} reaction
   * @param {*} options
   * @constructor
   */
  function EquationNode( reaction, options ) {

    Node.call( this );

    // determine cap height of the font, using a char that has no descender
    var capHeight = new SubSupText( "T", TEXT_OPTIONS ).height;

    var i, coefficientNode, symbolNode, plusNode;

    // left-hand side of the formula (reactants)
    var numberOfReactants = reaction.reactants.length;
    for ( i = 0; i < numberOfReactants; i++ ) {

      // coefficient
      coefficientNode = new Text( reaction.reactants[i].coefficient, TEXT_OPTIONS );
      this.addChild( coefficientNode );
      if ( plusNode ) {
        coefficientNode.left = plusNode.right + PLUS_X_SPACING;
      }

      // symbol
      symbolNode = new SubSupText( reaction.reactants[i].molecule.symbol, TEXT_OPTIONS );
      this.addChild( symbolNode );
      symbolNode.left = coefficientNode.right + COEFFICIENT_X_SPACING;

      // plus sign between terms
      if ( i < numberOfReactants - 1  ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        this.addChild( plusNode );
        plusNode.left = symbolNode.right + PLUS_X_SPACING;
        plusNode.centerY = symbolNode.top + ( capHeight / 2 );
      }
      else {
        plusNode = null;
      }
    }

    // right arrow
    var arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = symbolNode.right + ARROW_X_SPACING;
    arrowNode.centerY = symbolNode.top + ( capHeight / 2 );
    this.addChild( arrowNode );

    // right-hand side of the formula (products)
    var numberOfProducts = reaction.products.length;
    for ( i = 0; i < numberOfProducts; i++ ) {

      // coefficient
      coefficientNode = new Text( reaction.products[i].coefficient, TEXT_OPTIONS );
      this.addChild( coefficientNode );
      if ( plusNode ) {
        coefficientNode.left = plusNode.right + PLUS_X_SPACING;
      }
      else {
        coefficientNode.left = arrowNode.right + ARROW_X_SPACING;
      }

      // symbol
      symbolNode = new SubSupText( reaction.products[i].molecule.symbol, TEXT_OPTIONS );
      this.addChild( symbolNode );
      symbolNode.left = coefficientNode.right + COEFFICIENT_X_SPACING;
      symbolNode.top = coefficientNode.top;

      // plus sign between terms
      if ( i < numberOfProducts - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        this.addChild( plusNode );
        plusNode.left = symbolNode.right + PLUS_X_SPACING;
        plusNode.centerY = symbolNode.top + ( capHeight / 2 );
      }
      else {
        plusNode = null;
      }
    }

    this.mutate( options );
  }

  return inherit( Node, EquationNode );
} );