// Copyright 2014-2019, University of Colorado Boulder

/**
 * Equation for the 'Molecules' and 'Game' screens. Coefficients are immutable and molecule symbols are displayed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlusNode = require( 'SCENERY_PHET/PlusNode' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Reaction} reaction
   * @param {Object} [options]
   * @constructor
   */
  function MoleculesEquationNode( reaction, options ) {

    options = merge( {
      fill: 'white',
      font: new RPALFont( 28 ),
      coefficientXSpacing: 8, // space between coefficient and node to its right
      plusXSpacing: 15, // space on both sides of the plus signs
      arrowXSpacing: 15 // space on both sides of arrow
    }, options );

    Node.call( this );

    // left-hand side (reactants)
    const reactantsNode = createTermsNode( reaction.reactants, options );
    this.addChild( reactantsNode );

    // right arrow
    const arrowNode = new RightArrowNode( { fill: options.fill, stroke: null, scale: 0.65 } );
    arrowNode.left = reactantsNode.right + options.arrowXSpacing;
    const coefficientHeight = new Text( '1', { font: options.font, fill: options.fill } ).height;
    arrowNode.centerY = reactantsNode.top + ( coefficientHeight / 2 );
    this.addChild( arrowNode );

    // right-hand side (products)
    const productsNode = createTermsNode( reaction.products, options );
    productsNode.left = arrowNode.right + options.arrowXSpacing;
    this.addChild( productsNode );

    this.arrowCenterX = arrowNode.centerX; // @public, needed for aligning arrows in Game layout

    this.mutate( options );
  }

  reactantsProductsAndLeftovers.register( 'MoleculesEquationNode', MoleculesEquationNode );

  /**
   * Creates terms for equation.
   * @param {Substance[]} terms the terms to be added
   * @returns {Node}
   */
  var createTermsNode = function( terms, options ) {

    const parentNode = new Node();
    const numberOfTerms = terms.length;

    // hoist loop vars explicitly
    let coefficientNode;
    let symbolNode;
    let plusNode;

    for ( let i = 0; i < numberOfTerms; i++ ) {

      // coefficient
      coefficientNode = new Text( terms[ i ].coefficientProperty.get(), { font: options.font, fill: options.fill } );
      coefficientNode.left = plusNode ? ( plusNode.right + options.plusXSpacing ) : 0;
      parentNode.addChild( coefficientNode );

      // molecule
      symbolNode = new RichText( terms[ i ].symbol, { font: options.font, fill: options.fill } );
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