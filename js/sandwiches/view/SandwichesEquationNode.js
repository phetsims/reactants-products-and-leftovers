// Copyright 2014-2023, University of Colorado Boulder

/**
 * Equation for the 'Sandwiches' screen.
 * This differs from the 'Molecules' screen equation is a few key ways:
 *
 * 1. Terms are images instead of formulas.
 * 2. Reactant coefficients are mutable for the 'custom' sandwich
 * 3. The 'custom' sandwich reaction may not be well-defined.
 * 4. Appearance (fonts, sizes, spacing, ...) needs to be separately tweakable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import MultiLineText from '../../../../scenery-phet/js/MultiLineText.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import { Node, RichText, Text } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import RPALConstants from '../../common/RPALConstants.js';
import RightArrowNode from '../../common/view/RightArrowNode.js';
import SubstanceIcon from '../../common/view/SubstanceIcon.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import SandwichRecipe from '../model/SandwichRecipe.js';

const COEFFICIENT_X_SPACING = 8; // space between coefficient and node to its right
const PLUS_X_SPACING = 15; // space on both sides of the plus signs
const ARROW_X_SPACING = 15; // space on both sides of arrow
const TEXT_OPTIONS = { font: new PhetFont( 28 ), fill: 'white' };
const PLUS_OPTIONS = { fill: 'white' };
const ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };
const NUMBER_SPINNER_OPTIONS = RPALConstants.NUMBER_SPINNER_OPTIONS;

export default class SandwichesEquationNode extends Node {

  /**
   * @param {SandwichRecipe} reaction the sandwich recipe (reaction) to display
   * @param {Dimension2} maxSandwichSize dimensions of largest sandwich
   * @param {Object} [options]
   */
  constructor( reaction, maxSandwichSize, options ) {

    assert && assert( reaction instanceof SandwichRecipe );

    options = options || {};

    super();

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
        coefficientNode = new NumberSpinner( reactant.coefficientProperty, new Property( RPALConstants.SANDWICH_COEFFICIENT_RANGE ), NUMBER_SPINNER_OPTIONS );
        this.coefficientNodes.push( coefficientNode );
      }
      else {
        coefficientNode = new Text( reactant.coefficientProperty.value, TEXT_OPTIONS );
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
    const noReactionStringProperty = new DerivedProperty( [ ReactantsProductsAndLeftoversStrings.noReactionStringProperty ],
      noReactionString => MultiLineText.replaceNewlines( noReactionString )
    );
    const noReactionNode = new RichText( noReactionStringProperty, {
      align: 'center',
      font: new PhetFont( 16 ),
      fill: 'white',
      maxWidth: 85
    } );
    noReactionNode.boundsProperty.link( bounds => {
      noReactionNode.left = arrowNode.right + ARROW_X_SPACING;
      noReactionNode.centerY = arrowNode.centerY;
    } );

    // Display 'No Reaction' if we don't have a valid sandwich.
    this.sandwichIconPropertyObserver = node => {
      sandwichNode.visible = reaction.isReaction();
      noReactionNode.visible = !sandwichNode.visible;
    };
    this.sandwichIconProperty = reaction.sandwich.iconProperty; // @private
    this.sandwichIconProperty.link( this.sandwichIconPropertyObserver ); // must be unlinked in dispose

    options.children = [ leftNode, arrowNode, sandwichNode, noReactionNode ];
    this.mutate( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.coefficientNodes.forEach( node => node.dispose() );
    this.coefficientNodes = null;
    this.iconNodes.forEach( node => node.dispose() );
    this.iconNodes = null;
    this.sandwichIconProperty.unlink( this.sandwichIconPropertyObserver );
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesEquationNode', SandwichesEquationNode );