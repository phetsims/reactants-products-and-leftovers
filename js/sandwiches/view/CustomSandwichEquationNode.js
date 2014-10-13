// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays the equation for a custom sandwich.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CustomSandwich = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/CustomSandwich' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Property = require( 'AXON/Property' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var noReactionString = '?'; //TODO showing "no reaction" creates big layout problems, we don't have room

  // constants
  var COEFFICIENT_X_SPACING = 10;
  var PLUS_X_SPACING = 20;
  var ARROW_X_SPACING = 20;
  var TEXT_OPTIONS = { font: new RPALFont( 28 ), fill: 'white' };
  var PLUS_OPTIONS = { fill: 'white' };
  var ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };
  var PICKER_OPTIONS = { font: new RPALFont( 28 ), color: 'yellow', xMargin: 6, cornerRadius: 3 };
  var COEFFICIENT_RANGE_PROPERTY = new Property( RPALConstants.COEFFICIENT_RANGE );
  var NO_REACTION_NODE = new Text( noReactionString, TEXT_OPTIONS );

  /**
   * Creates terms for equation.
   * @param {Substance[]} terms the terms to be added
   * @returns {Node}
   */
  var createTermsNode = function( terms ) {

    var parentNode = new Node();
    var numberOfTerms = terms.length;
    var coefficientNode, moleculeNode, plusNode; // hoist loop vars explicitly

    for ( var i = 0; i < numberOfTerms; i++ ) {

      // coefficient
      coefficientNode = new NumberPicker( terms[i].coefficientProperty, COEFFICIENT_RANGE_PROPERTY, PICKER_OPTIONS );
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
  function CustomSandwichEquationNode( reaction, options ) {

    assert( reaction instanceof CustomSandwich );

    options = options || {};

    // left-hand side is the sandwich ingredients
    var reactantsNode = createTermsNode( reaction.reactants );

    // right arrow
    var arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = reactantsNode.right + ARROW_X_SPACING;
    var coefficientHeight = new Text( '1', TEXT_OPTIONS ).height;
    arrowNode.centerY = reactantsNode.centerY;

    // right-hand side is the sandwich, whose image changes based on coefficients of the ingredients
    assert && assert( reaction.products.length === 1 );
    var productsParent = new Node();
    reaction.products[0].molecule.nodeProperty.link( function( node ) {
        productsParent.removeAllChildren();
        if ( reaction.isReaction() ) {
          productsParent.addChild( node );
        }
        else {
          productsParent.addChild( NO_REACTION_NODE );
        }
        productsParent.left = arrowNode.right + ARROW_X_SPACING;
        productsParent.centerY = arrowNode.centerY;
      }
    );

    options.children = [ reactantsNode, arrowNode, productsParent ];
    Node.call( this, options );
  }

  return inherit( Node, CustomSandwichEquationNode );
} );