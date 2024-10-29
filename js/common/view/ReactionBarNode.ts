// Copyright 2014-2024, University of Colorado Boulder

/**
 * ReactionBarNode is the horizontal bar that appears at the top of the screen. It contains radio buttons for selecting
 * a reaction, and displays the selected reaction's equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeOptions, NodeTranslationOptions, Rectangle } from '../../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import Reaction from '../model/Reaction.js';
import RPALColors from '../RPALColors.js';
import ReactionRadioButtonGroup from './ReactionRadioButtonGroup.js';
import Multilink from '../../../../axon/js/Multilink.js';

const X_MARGIN = 20;
const Y_MARGIN = 10;

export type CreateEquationNodeFunction<R extends Reaction = Reaction> =
  ( reaction: R, visibleProperty: TReadOnlyProperty<boolean> ) => Node;

type SelfOptions = {
  layoutBounds: Bounds2;
  visibleBoundsProperty: TReadOnlyProperty<Bounds2>;
};

type ReactionBarNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ReactionBarNode<R extends Reaction = Reaction> extends Node {

  public constructor( reactionProperty: Property<R>, reactions: R[],
                      createEquationNode: CreateEquationNodeFunction<R>, providedOptions: ReactionBarNodeOptions ) {

    const options = optionize<ReactionBarNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    // radio buttons for choosing a reaction
    const radioButtonGroup = new ReactionRadioButtonGroup( reactionProperty, reactions,
      options.tandem.createTandem( 'radioButtonGroup' ) );

    // The horizontal bar, sized to fit the width of the browser window.
    const barNode = new Rectangle( 0, 0, 0, 1, {
      fill: RPALColors.STATUS_BAR_FILL
    } );
    options.visibleBoundsProperty.link( visibleBounds => {
      barNode.setRect( visibleBounds.left, 0, visibleBounds.width, radioButtonGroup.height + ( 2 * Y_MARGIN ) );
    } );

    const equationNodes = reactions.map( reaction => {
      const visibleProperty = new DerivedProperty( [ reactionProperty ], value => value === reaction );
      return createEquationNode( reaction, visibleProperty );
    } );

    // Parent for all equations, so that the equation can be hidden via PhET-iO.
    const equationNode = new Node( {
      children: equationNodes,
      tandem: options.tandem.createTandem( 'equationNode' )
    } );

    options.children = [ barNode, radioButtonGroup, equationNode ];

    // radio buttons at right, vertically centered in the bar
    radioButtonGroup.boundsProperty.link( bounds => {
      radioButtonGroup.right = options.layoutBounds.right - X_MARGIN;
      radioButtonGroup.centerY = barNode.centerY;
    } );

    // equations centered in the space to the left of radio buttons
    Multilink.multilink( [ radioButtonGroup.visibleProperty, radioButtonGroup.boundsProperty ],
      ( radioButtonGroupVisible, radioButtonGroupBounds ) => {
        equationNodes.forEach( equationNode => {
          if ( radioButtonGroupVisible ) {
            equationNode.centerX = radioButtonGroup.left / 2;
            equationNode.centerY = barNode.centerY;
          }
          else {
            equationNode.centerX = barNode.centerX;
            equationNode.centerY = barNode.centerY;
          }
        } );
      } );

    super( options );
  }
}

reactantsProductsAndLeftovers.register( 'ReactionBarNode', ReactionBarNode );