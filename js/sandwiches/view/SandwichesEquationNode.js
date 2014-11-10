// Copyright 2002-2014, University of Colorado Boulder

/**
 * Equation for the 'Sandwiches' screen.
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
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Property = require( 'AXON/Property' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
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
  var SPINNER_OPTIONS = { font: new RPALFont( 28 ) };
  var COEFFICIENT_RANGE_PROPERTY = new Property( RPALConstants.SANDWICH_COEFFICIENT_RANGE );
  var ONE_NODE = new Text( '1', TEXT_OPTIONS ); // coefficient for right side of well-defined equations
  var NO_REACTION_NODE = new MultiLineText( noReactionString, { font: new RPALFont( 16 ), fill: 'white' } );

  // Limit the width of this node, max width determined empirically.
  NO_REACTION_NODE.setScaleMagnitude( Math.min( 1, 75 / NO_REACTION_NODE.width ) );

  /**
   * @param {SandwichRecipe} reaction the sandwich recipe (reaction) to display
   * @param {Object} [options]
   * @constructor
   */
  function SandwichesEquationNode( reaction, options ) {

    assert && assert( reaction instanceof SandwichRecipe );

    options = options || {};

    // left-hand side is the sandwich ingredients
    var leftNode = new Node();
    var numberOfReactants = reaction.reactants.length;
    var reactant, coefficientNode, ingredientNode, plusNode; // hoist loop vars explicitly
    this.coefficientNodes = []; // @private so we can unlink UI components in dispose
    for ( var i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[i];

      // coefficient
      if ( reaction.coefficientsMutable ) {
        if ( RPALQueryParameters.COEFFICIENTS === 'spinners' ) {
          coefficientNode = new NumberSpinner( reactant.coefficientProperty, RPALConstants.SANDWICH_COEFFICIENT_RANGE, SPINNER_OPTIONS );
        }
        else {
          coefficientNode = new NumberPicker( reactant.coefficientProperty, COEFFICIENT_RANGE_PROPERTY, PICKER_OPTIONS );
        }
        this.coefficientNodes.push( coefficientNode );
      }
      else {
        coefficientNode = new Text( reactant.coefficient, TEXT_OPTIONS );
      }
      coefficientNode.left = plusNode ? ( plusNode.right + PLUS_X_SPACING ) : 0;
      leftNode.addChild( coefficientNode );

      // ingredient
      ingredientNode = reactant.getWrappedNode( {
        left: coefficientNode.right + COEFFICIENT_X_SPACING,
        centerY: coefficientNode.centerY
      } );
      leftNode.addChild( ingredientNode );

      // plus sign between reactants
      if ( i < numberOfReactants - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        plusNode.left = ingredientNode.right + PLUS_X_SPACING;
        plusNode.centerY = coefficientNode.centerY;
        leftNode.addChild( plusNode );
      }
      else {
        plusNode = null;
      }
    }

    // right arrow
    var arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = leftNode.right + ARROW_X_SPACING;
    arrowNode.centerY = leftNode.centerY;

    // right-hand side is a sandwich, whose image changes based on coefficients of the ingredients
    assert && assert( reaction.products.length === 1 );
    var rightNode = new Node();
    // @private so we can unlink this observer in dispose
    this.nodePropertyObserver = function( node ) {
      rightNode.removeAllChildren();
      if ( reaction.isReaction() ) {
        rightNode.addChild( ONE_NODE );
        rightNode.addChild( node );
        ONE_NODE.right = node.left - COEFFICIENT_X_SPACING;
        ONE_NODE.centerY = node.centerY;
      }
      else {
        rightNode.addChild( NO_REACTION_NODE );
      }
      rightNode.left = arrowNode.right + ARROW_X_SPACING;
      rightNode.centerY = arrowNode.centerY;
    };

    this.nodeProperty = reaction.sandwich.nodeProperty; // @public convenience for accessing the sandwich node
    this.nodeProperty.link( this.nodePropertyObserver );

    options.children = [ leftNode, arrowNode, rightNode ];
    Node.call( this, options );
  }

  return inherit( Node, SandwichesEquationNode, {

    // Unlinks from properties. The node is no longer functional after calling this function.
    dispose: function() {
      this.nodeProperty.unlink( this.nodePropertyObserver );
      this.coefficientNodes.forEach( function( coefficientNode ) {
        coefficientNode.dispose();
      } );
    }
  } );
} );