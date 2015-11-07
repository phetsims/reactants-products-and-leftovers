// Copyright 2014-2015, University of Colorado Boulder

/**
 * Equation for the 'Molecules' and 'Game' screens. Coefficients are immutable and molecule symbols are displayed.
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

  /**
   * @param {Reaction} reaction
   * @param {Object} [options]
   * @constructor
   */
  function MoleculesEquationNode( reaction, options ) {

    options = _.extend( {
      fill: 'white',
      font: new RPALFont( 28 ),
      coefficientXSpacing: 8, // space between coefficient and node to its right
      plusXSpacing: 15, // space on both sides of the plus signs
      arrowXSpacing: 15 // space on both sides of arrow
    }, options );

    Node.call( this );

    // left-hand side (reactants)
    var reactantsNode = createTermsNode( reaction.reactants, options );
    this.addChild( reactantsNode );

    // right arrow
    var arrowNode = new RightArrowNode( { fill: options.fill, stroke: null, scale: 0.65 } );
    arrowNode.left = reactantsNode.right + options.arrowXSpacing;
    var coefficientHeight = new Text( '1', { font: options.font, fill: options.fill } ).height;
    arrowNode.centerY = reactantsNode.top + ( coefficientHeight / 2 );
    this.addChild( arrowNode );

    // right-hand side (products)
    var productsNode = createTermsNode( reaction.products, options );
    productsNode.left = arrowNode.right + options.arrowXSpacing;
    this.addChild( productsNode );

    this.arrowCenterX = arrowNode.centerX; // @public, needed for aligning arrows in Game layout

    this.mutate( options );
  }

  /**
   * Creates terms for equation.
   * @param {Substance[]} terms the terms to be added
   * @returns {Node}
   */
  var createTermsNode = function( terms, options ) {

    var parentNode = new Node();
    var numberOfTerms = terms.length;

    // hoist loop vars explicitly
    var coefficientNode;
    var symbolNode;
    var plusNode;

    for ( var i = 0; i < numberOfTerms; i++ ) {

      // coefficient
      coefficientNode = new Text( terms[ i ].coefficient, { font: options.font, fill: options.fill } );
      coefficientNode.left = plusNode ? ( plusNode.right + options.plusXSpacing ) : 0;
      parentNode.addChild( coefficientNode );

      // molecule
      symbolNode = new SubSupText( terms[ i ].symbol, { font: options.font, fill: options.fill } );
      symbolNode.left = coefficientNode.right + options.coefficientXSpacing;
      parentNode.addChild( symbolNode );

      // plus sign between terms
      if ( i < numberOfTerms - 1 ) {
        plusNode = new PlusNode( { fill: options.fill } );
        plusNode.left = symbolNode.right + options.plusXSpacing;
        plusNode.centerY = coefficientNode.centerY;
        parentNode.addChild( plusNode );
      }
      else {
        plusNode = null;
      }
    }

    return parentNode;
  };

  return inherit( Node, MoleculesEquationNode );
} );