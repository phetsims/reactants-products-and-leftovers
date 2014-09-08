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
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var COEFFICIENT_X_SPACING = 10;
  var PLUS_X_SPACING = 20;
  var ARROW_X_SPACING = 20;
  var TEXT_OPTIONS = { font: new RPALFont( 28 ), fill: 'white' };
  var PLUS_OPTIONS = { fill: 'white' };
  var ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };

  /**
   * Creates terms for equation.
   * @param {[Substance]} terms the terms to be added
   * @param {boolean} showSymbols true = show molecule symbol, false = show molecule node
   * @returns {Node}
   */
  var createTermsNode = function( terms, showSymbols ) {

    var parentNode = new Node();
    var numberOfTerms = terms.length;
    var coefficientNode, moleculeNode, plusNode; // hoist loop vars explicitly

    for ( var i = 0; i < numberOfTerms; i++ ) {

      // coefficient
      coefficientNode = new Text( terms[i].coefficient, TEXT_OPTIONS );
      coefficientNode.left = plusNode ? ( plusNode.right + PLUS_X_SPACING ) : 0;
      parentNode.addChild( coefficientNode );

      // molecule
      moleculeNode = showSymbols ? new SubSupText( terms[i].molecule.symbol, TEXT_OPTIONS ) : new Node( { children: [ terms[i].molecule.node ] } );
      moleculeNode.left = coefficientNode.right + COEFFICIENT_X_SPACING;
      if ( !showSymbols ) {
        moleculeNode.centerY = coefficientNode.centerY;
      }
      parentNode.addChild( moleculeNode );

      // plus sign between terms
      if ( i < numberOfTerms - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        plusNode.left = moleculeNode.right + PLUS_X_SPACING;
        plusNode.centerY = coefficientNode.top + ( coefficientNode.height / 2 );
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
   * @param {Object} options
   * @constructor
   */
  function EquationNode( reaction, options ) {

    options = _.extend( {
      showSymbols: true // true = show molecule symbol, false = show molecule node
    }, options );

    Node.call( this );

    // left-hand side of the formula (reactants)
    var reactantsNode = createTermsNode( reaction.reactants, options.showSymbols );
    this.addChild( reactantsNode );

    // right arrow
    var arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = reactantsNode.right + ARROW_X_SPACING;
    var coefficientHeight = new Text( '1', TEXT_OPTIONS ).height;
    arrowNode.centerY = reactantsNode.top + ( coefficientHeight / 2 );
    this.addChild( arrowNode );

    // right-hand side of the formula (products)
    var productsNode = createTermsNode( reaction.products, options.showSymbols );
    productsNode.left = arrowNode.right + ARROW_X_SPACING;
    this.addChild( productsNode );

    this.mutate( options );
  }

  return inherit( Node, EquationNode );
} );