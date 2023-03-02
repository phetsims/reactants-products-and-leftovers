// Copyright 2014-2023, University of Colorado Boulder

/**
 * Equation for the 'Molecules' and 'Game' screens. Coefficients are immutable and molecule symbols are displayed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import { Node, NodeOptions, NodeTranslationOptions, RichText, TColor, Text } from '../../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import Reaction from '../model/Reaction.js';
import Substance from '../model/Substance.js';
import RightArrowNode from './RightArrowNode.js';

type SelfOptions = {
  fill?: TColor;
  font?: PhetFont;
  coefficientXSpacing?: number; // space between coefficient and node to its right
  plusXSpacing?: number; // space on both sides of the plus signs
  arrowXSpacing?: number; // space on both sides of arrow
};

type MoleculesEquationNodeOptions = SelfOptions & NodeTranslationOptions;

export default class MoleculesEquationNode extends Node {

  // needed for aligning arrows in Game layout
  public readonly arrowCenterX: number;

  public constructor( reaction: Reaction, providedOptions?: MoleculesEquationNodeOptions ) {

    const options = optionize<MoleculesEquationNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fill: 'white',
      font: new PhetFont( 28 ),
      coefficientXSpacing: 8,
      plusXSpacing: 15,
      arrowXSpacing: 15
    }, providedOptions );

    // left-hand side (reactants)
    const reactantsNode = createTermsNode( reaction.reactants, options.font, options.fill, options.plusXSpacing, options.coefficientXSpacing );

    const coefficientHeight = new Text( '1', { font: options.font, fill: options.fill } ).height;

    // right arrow
    const arrowNode = new RightArrowNode( {
      fill: options.fill,
      stroke: null,
      scale: 0.65,
      left: reactantsNode.right + options.arrowXSpacing,
      centerY: reactantsNode.top + ( coefficientHeight / 2 )
    } );

    // right-hand side (products)
    const productsNode = createTermsNode( reaction.products, options.font, options.fill, options.plusXSpacing, options.coefficientXSpacing );
    productsNode.left = arrowNode.right + options.arrowXSpacing;

    options.children = [ reactantsNode, arrowNode, productsNode ];

    super( options );

    this.arrowCenterX = arrowNode.centerX;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Creates terms for equation.
 */
function createTermsNode( terms: Substance[], font: PhetFont, fill: TColor, plusXSpacing: number, coefficientXSpacing: number ): Node {
  assert && assert( terms.length > 0 );

  const parentNode = new Node();
  const numberOfTerms = terms.length;

  // hoist loop vars explicitly
  let coefficientNode;
  let symbolNode;
  let plusNode;

  for ( let i = 0; i < numberOfTerms; i++ ) {

    // coefficient
    coefficientNode = new Text( terms[ i ].coefficientProperty.value, { font: font, fill: fill } );
    coefficientNode.left = plusNode ? ( plusNode.right + plusXSpacing ) : 0;
    parentNode.addChild( coefficientNode );

    // molecule
    symbolNode = new RichText( terms[ i ].symbol, { font: font, fill: fill } );
    symbolNode.left = coefficientNode.right + coefficientXSpacing;
    parentNode.addChild( symbolNode );

    // plus sign between terms
    if ( i < numberOfTerms - 1 ) {
      plusNode = new PlusNode( { fill: fill } );
      plusNode.left = symbolNode.right + plusXSpacing;
      plusNode.centerY = coefficientNode.centerY;
      parentNode.addChild( plusNode );
    }
    else {
      plusNode = null;
    }
  }

  return parentNode;
}

reactantsProductsAndLeftovers.register( 'MoleculesEquationNode', MoleculesEquationNode );