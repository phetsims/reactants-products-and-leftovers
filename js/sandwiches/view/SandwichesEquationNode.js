// Copyright 2002-2014, University of Colorado Boulder

/**
 * Equations for the 'Sandwiches' screen.
 * This differs from the 'Molecules' screen equation is a few key ways:
 *
 * 1. Terms are images instead of formulae.
 * 2. Reactant coefficients are mutable for the 'custom' sandwich
 * 3. The 'custom' sandwich reaction may not be well-defined.
 * 4. Appearance (fonts, sizes, spacing, ...) needs to be separately tweakable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Property = require( 'AXON/Property' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var SandwichRecipe = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/SandwichRecipe' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var noReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/noReaction' );

  // constants
  var COEFFICIENT_X_SPACING = 8; // space between coefficient and node to its right
  var PLUS_X_SPACING = 15; // space on both sides of the plus signs
  var ARROW_X_SPACING = 15; // space on both sides of arrow
  var TEXT_OPTIONS = { font: new RPALFont( 28 ), fill: 'white' };
  var PLUS_OPTIONS = { fill: 'white' };
  var ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };
  var PICKER_OPTIONS = { font: new RPALFont( 28 ), color: 'yellow', xMargin: 6, cornerRadius: 3 };
  var COEFFICIENT_RANGE_PROPERTY = new Property( RPALConstants.COEFFICIENT_RANGE );
  var ONE_NODE = new Text( '1', TEXT_OPTIONS ); // coefficient for right side of well-defined equations
  var NO_REACTION_NODE = new MultiLineText( noReactionString, { font: new RPALFont( 16 ), fill: 'white' } );

  // Limit the width of this node, max width determined empirically.
  NO_REACTION_NODE.setScaleMagnitude( Math.min( 1, 75 / NO_REACTION_NODE.width ) );

  /**
   * Creates terms for equation.
   * @param {Substance[]} terms the terms to be added
   * @param {boolean} coefficientsMutable
   * @returns {Node}
   */
  var createTermsNode = function( terms, coefficientsMutable ) {

    var parentNode = new Node();
    var numberOfTerms = terms.length;
    var coefficientNode, ingredientNode, plusNode; // hoist loop vars explicitly

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

      // ingredient
      ingredientNode = new Node( { children: [ terms[i].node ] } );
      ingredientNode.left = coefficientNode.right + COEFFICIENT_X_SPACING;
      ingredientNode.centerY = coefficientNode.centerY;
      parentNode.addChild( ingredientNode );

      // plus sign between terms
      if ( i < numberOfTerms - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        plusNode.left = ingredientNode.right + PLUS_X_SPACING;
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
   * @param {SandwichRecipe} reaction the sandwich recipe (reaction) to display
   * @param {Object} [options]
   * @constructor
   */
  function SandwichesEquationNode( reaction, options ) {

    assert && assert( reaction instanceof SandwichRecipe );

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
    // @private
    this.nodePropertyObserver = function( node ) {
      productsParent.removeAllChildren();
      if ( reaction.isReaction() ) {
        productsParent.addChild( ONE_NODE );
        productsParent.addChild( node );
        ONE_NODE.right = node.left - COEFFICIENT_X_SPACING;
        ONE_NODE.centerY = node.centerY;
      }
      else {
        productsParent.addChild( NO_REACTION_NODE );
      }
      productsParent.left = arrowNode.right + ARROW_X_SPACING;
      productsParent.centerY = arrowNode.centerY;
    };

    this.nodeProperty = reaction.sandwich.nodeProperty;
    this.nodeProperty.link( this.nodePropertyObserver );

    options.children = [ reactantsNode, arrowNode, productsParent ];
    Node.call( this, options );
  }

  return inherit( Node, SandwichesEquationNode, {

    // Unlinks from properties. The node is no longer functional after calling this function.
    dispose: function() {
       this.nodeProperty.unlink( this.nodePropertyObserver );
    }
  } );
} );