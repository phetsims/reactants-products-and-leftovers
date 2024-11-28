// Copyright 2023-2024, University of Colorado Boulder

/**
 * GamePhaseNode is the base class for a node that shows the view for one phase of the game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import GamePhase from '../model/GamePhase.js';

type SelfOptions = EmptySelfOptions;

type GamePhaseNodeOptions = SelfOptions & PickOptional<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;

export default class GamePhaseNode extends Node {

  protected constructor( gamePhase: GamePhase, gamePhaseProperty: EnumerationProperty<GamePhase>, providedOptions: GamePhaseNodeOptions ) {

    const options = optionize<GamePhaseNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      visibleProperty: new DerivedProperty( [ gamePhaseProperty ], value => ( value === gamePhase ), {
        tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO,
        hasListenerOrderDependencies: true // TODO: https://github.com/phetsims/reactants-products-and-leftovers/issues/85
      } ),
      isDisposable: false
    }, providedOptions );

    super( options );
  }
}

reactantsProductsAndLeftovers.register( 'GamePhaseNode', GamePhaseNode );