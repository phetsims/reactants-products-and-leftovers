// Copyright 2002-2014, University of Colorado Boulder

/**
 * Equations for the "Sandwiches" screen.
 * This differs from the "Molecules" screen equation is a few key ways:
 *
 * 1. Terms are images instead of formulae.
 * 2. Reactant coefficients are mutable for the "custom" sandwich
 * 3. The "custom" sandwich reaction may not be well-defined.
 * 4. Appearance (fonts, sizes, spacing, ...) needs to be separately tweakable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var COEFFICIENT_X_SPACING = 10;
  var PLUS_X_SPACING = 20;
  var ARROW_X_SPACING = 20;
  var TEXT_OPTIONS = { font: new RPALFont( 28 ), fill: 'white' };
  var PLUS_OPTIONS = { fill: 'white' };
  var ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };
  var PICKER_OPTIONS = { font: new RPALFont( 28 ), color: 'yellow', xMargin: 6, cornerRadius: 3 };
  var COEFFICIENT_RANGE_PROPERTY = new Property( RPALConstants.COEFFICIENT_RANGE );
  var NO_REACTION_NODE = new Rectangle( 0, 0, 45, 45, { stroke: 'white', lineDash: [ 3, 3 ] } );

  /**
   * Creates terms for equation.
   * @param {Substance[]} terms the terms to be added
   * @param {boolean} coefficientsMutable
   * @returns {Node}
   */
  var createTermsNode = function( terms, coefficientsMutable ) {

    var parentNode = new Node();
    var numberOfTerms = terms.length;
    var coefficientNode, moleculeNode, plusNode; // hoist loop vars explicitly

    for ( var i = 0; i < numberOfTerms; i++ ) {

      // coefficient
      if ( coefficientsMutable ) {
        coefficientNode = new NumberPicker( terms[i].coefficientProperty, COEFFICIENT_RANGE_PROPERTY, PICKER_OPTIONS );
      }
      else {
        coefficientNode = new Text( terms[i].coefficient, TEXT_OPTIONS );
      }
      coefficientNode.left = plusNode ? ( plusNode.right + PLUS_X_SPACING ) : 0;
      parentNode.addChild( coefficientNode );

      // molecule
      moleculeNode = new Node( { children: [ terms[i].molecule.node ] } );
      moleculeNode.left = coefficientNode.right + COEFFICIENT_X_SPACING;
      moleculeNode.centerY = coefficientNode.centerY;
      parentNode.addChild( moleculeNode );

      // plus sign between terms
      if ( i < numberOfTerms - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        plusNode.left = moleculeNode.right + PLUS_X_SPACING;
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
  function SandwichesEquationNode( reaction, options ) {

    options = options || {};

    // left-hand side is the sandwich ingredients
    var reactantsNode = createTermsNode( reaction.reactants, reaction.coefficientsMutable );

    // right arrow
    var arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = reactantsNode.right + ARROW_X_SPACING;
    arrowNode.centerY = reactantsNode.centerY;

    // right-hand side is a sandwich, whose image changes based on coefficients of the ingredients
    assert && assert( reaction.products.length === 1 );
    var productsParent = new Node();
    this.nodePropertyObserver = function( node ) {
      productsParent.removeAllChildren();
      if ( reaction.isReaction() ) {
        productsParent.addChild( node );
      }
      else {
        productsParent.addChild( NO_REACTION_NODE );
      }
      productsParent.left = arrowNode.right + ARROW_X_SPACING;
      productsParent.centerY = arrowNode.centerY;
    };

    this.nodeProperty = reaction.products[0].molecule.nodeProperty;
    this.nodeProperty.link( this.nodePropertyObserver );

    options.children = [ reactantsNode, arrowNode, productsParent ];
    Node.call( this, options );
  }

  return inherit( Node, SandwichesEquationNode, {

    // @public Unlinks from properties. The node is no longer functional after calling this function.
    dispose: function() {
       this.nodeProperty.unlink( this.nodePropertyObserver );
    }
  } );
} );