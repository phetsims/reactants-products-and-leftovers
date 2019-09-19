// Copyright 2014-2017, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberSpinner = require( 'SUN/NumberSpinner' );
  const PlusNode = require( 'SCENERY_PHET/PlusNode' );
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const SandwichRecipe = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/SandwichRecipe' );
  const SubstanceIcon = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceIcon' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const noReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/noReaction' );

  // constants
  const COEFFICIENT_X_SPACING = 8; // space between coefficient and node to its right
  const PLUS_X_SPACING = 15; // space on both sides of the plus signs
  const ARROW_X_SPACING = 15; // space on both sides of arrow
  const TEXT_OPTIONS = { font: new RPALFont( 28 ), fill: 'white' };
  const PLUS_OPTIONS = { fill: 'white' };
  const ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };
  const SPINNER_OPTIONS = {
    font: new RPALFont( 28 ),
    touchAreaXDilation: 20,
    touchAreaYDilation: 10,
    backgroundLineWidth: 0.5
  };

  /**
   * @param {SandwichRecipe} reaction the sandwich recipe (reaction) to display
   * @param {Dimension2} maxSandwichSize dimensions of largest sandwich
   * @param {Object} [options]
   * @constructor
   */
  function SandwichesEquationNode( reaction, maxSandwichSize, options ) {

    assert && assert( reaction instanceof SandwichRecipe );

    options = options || {};

    this.coefficientNodes = []; // @private
    this.iconNodes = []; // @private

    // left-hand side is the sandwich ingredients
    const leftNode = new Node();

    // hoist loop vars explicitly
    let reactant;
    let coefficientNode;
    let iconNode;
    let plusNode;
    const numberOfReactants = reaction.reactants.length;
    for ( let i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[ i ];

      // coefficient
      if ( reaction.coefficientsMutable ) {
        coefficientNode = new NumberSpinner( reactant.coefficientProperty, new Property( RPALConstants.SANDWICH_COEFFICIENT_RANGE ), SPINNER_OPTIONS );
        this.coefficientNodes.push( coefficientNode );
      }
      else {
        coefficientNode = new Text( reactant.coefficientProperty.get(), TEXT_OPTIONS );
      }
      coefficientNode.left = plusNode ? ( plusNode.right + PLUS_X_SPACING ) : 0;
      leftNode.addChild( coefficientNode );

      // icon
      iconNode = new SubstanceIcon( reactant.iconProperty, {
        left: coefficientNode.right + COEFFICIENT_X_SPACING,
        centerY: coefficientNode.centerY
      } );
      leftNode.addChild( iconNode );
      this.iconNodes.push( iconNode );

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
    const arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = leftNode.right + ARROW_X_SPACING;
    arrowNode.centerY = leftNode.centerY;

    // @private right-hand side is a sandwich, whose image changes based on coefficients of the ingredients
    const sandwichNode = new SubstanceIcon( reaction.sandwich.iconProperty, {
      centerX: arrowNode.right + ARROW_X_SPACING + ( maxSandwichSize.width / 2 ),
      centerY: arrowNode.centerY
    } );
    this.iconNodes.push( sandwichNode );

    // 'No Reaction', max width determined empirically.
    const noReactionNode = new MultiLineText( noReactionString, { font: new RPALFont( 16 ), fill: 'white' } );
    noReactionNode.setScaleMagnitude( Math.min( 1, 75 / noReactionNode.width ) );
    noReactionNode.left = arrowNode.right + ARROW_X_SPACING;
    noReactionNode.centerY = arrowNode.centerY;

    // Display 'No Reaction' if we don't have a valid sandwich.
    this.sandwichIconPropertyObserver = function( node ) {
      sandwichNode.visible = reaction.isReaction();
      noReactionNode.visible = !sandwichNode.visible;
    };
    this.sandwichIconProperty = reaction.sandwich.iconProperty; // @private
    this.sandwichIconProperty.link( this.sandwichIconPropertyObserver ); // must be unlinked in dispose

    options.children = [ leftNode, arrowNode, sandwichNode, noReactionNode ];
    Node.call( this, options );
  }

  reactantsProductsAndLeftovers.register( 'SandwichesEquationNode', SandwichesEquationNode );

  return inherit( Node, SandwichesEquationNode, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.coefficientNodes.forEach( function( node ) { node.dispose(); } );
      this.coefficientNodes = null;
      this.iconNodes.forEach( function( node ) { node.dispose(); } );
      this.iconNodes = null;
      this.sandwichIconProperty.unlink( this.sandwichIconPropertyObserver );
      Node.prototype.dispose.call( this );
    }
  } );
} );