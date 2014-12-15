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
  var DynamicIcon = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/DynamicIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
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
  var SPINNER_OPTIONS = { font: new RPALFont( 28 ) };

  /**
   * @param {SandwichRecipe} reaction the sandwich recipe (reaction) to display
   * @param {Dimension2} maxSandwichSize dimensions of largest sandwich
   * @param {Object} [options]
   * @constructor
   */
  function SandwichesEquationNode( reaction, maxSandwichSize, options ) {

    assert && assert( reaction instanceof SandwichRecipe );

    options = options || {};

    var thisNode = this;

    thisNode.coefficientNodes = []; // @private
    thisNode.iconNodes = []; // @private

    // left-hand side is the sandwich ingredients
    var leftNode = new Node();
    var reactant, coefficientNode, iconNode, plusNode; // hoist loop vars explicitly
    var numberOfReactants = reaction.reactants.length;
    for ( var i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[i];

      // coefficient
      if ( reaction.coefficientsMutable ) {
        coefficientNode = new NumberSpinner( reactant.coefficientProperty, RPALConstants.SANDWICH_COEFFICIENT_RANGE, SPINNER_OPTIONS );
        thisNode.coefficientNodes.push( coefficientNode );
      }
      else {
        coefficientNode = new Text( reactant.coefficient, TEXT_OPTIONS );
      }
      coefficientNode.left = plusNode ? ( plusNode.right + PLUS_X_SPACING ) : 0;
      leftNode.addChild( coefficientNode );

      // icon
      iconNode = new DynamicIcon( reactant.iconProperty, {
        left: coefficientNode.right + COEFFICIENT_X_SPACING,
        centerY: coefficientNode.centerY
      } );
      leftNode.addChild( iconNode );
      thisNode.iconNodes.push( iconNode );

      // plus sign between reactants
      if ( i < numberOfReactants - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        plusNode.left = iconNode.right + PLUS_X_SPACING;
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

    // @private right-hand side is a sandwich, whose image changes based on coefficients of the ingredients
    var sandwichNode = new DynamicIcon( reaction.sandwich.iconProperty, {
      centerX: arrowNode.right + ARROW_X_SPACING + ( maxSandwichSize.width / 2 ),
      centerY: arrowNode.centerY
    } );
    thisNode.iconNodes.push( sandwichNode );

    // "No Reaction", max width determined empirically.
    var noReactionNode = new MultiLineText( noReactionString, { font: new RPALFont( 16 ), fill: 'white' } );
    noReactionNode.setScaleMagnitude( Math.min( 1, 75 / noReactionNode.width ) );
    noReactionNode.left = arrowNode.right + ARROW_X_SPACING;
    noReactionNode.centerY = arrowNode.centerY;

    // Display "No Reaction" if we don't have a valid sandwich.
    thisNode.sandwichIconPropertyObserver = function( node ) {
      sandwichNode.visible = reaction.isReaction();
      noReactionNode.visible = !sandwichNode.visible;
    };
    thisNode.sandwichIconProperty = reaction.sandwich.iconProperty; // @private
    thisNode.sandwichIconProperty.link( thisNode.sandwichIconPropertyObserver ); // must be unlinked in dispose

    options.children = [ leftNode, arrowNode, sandwichNode, noReactionNode ];
    Node.call( thisNode, options );
  }

  return inherit( Node, SandwichesEquationNode, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.coefficientNodes.forEach( function( node ) { node.dispose(); } );
      this.coefficientNodes = null;
      this.iconNodes.forEach( function( node ) { node.dispose(); } );
      this.iconNodes = null;
      this.sandwichIconProperty.unlink( this.sandwichIconPropertyObserver );
    }
  } );
} );