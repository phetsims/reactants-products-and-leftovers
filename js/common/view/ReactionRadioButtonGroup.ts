// Copyright 2020-2023, University of Colorado Boulder

/**
 * Radio buttons for selecting a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem, AquaRadioButtonGroupOptions } from '../../../../sun/js/AquaRadioButtonGroup.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import Reaction from '../model/Reaction.js';

type SelfOptions = EmptySelfOptions;

type ReactionRadioButtonGroupOptions = SelfOptions;

export default class ReactionRadioButtonGroup<R extends Reaction = Reaction> extends AquaRadioButtonGroup<R> {

  public constructor( reactionProperty: Property<R>, choices: R[], providedOptions?: ReactionRadioButtonGroupOptions ) {

    const options = optionize<ReactionRadioButtonGroupOptions, SelfOptions, AquaRadioButtonGroupOptions>()( {

      // AquaRadioButtonGroupOptions
      orientation: 'vertical',
      align: 'left',
      spacing: 10,
      touchAreaXDilation: 10,
      radioButtonOptions: { radius: 8 }
    }, providedOptions );

    const textOptions = {
      font: new PhetFont( 16 ),
      fill: 'white',
      maxWidth: 210 // determined empirically
    };

    // Describe radio buttons, one for each reaction.
    const items: AquaRadioButtonGroupItem<R>[] = choices.map( choice => {
      const nameProperty = choice.nameProperty!;
      assert && assert( nameProperty );
      return {
        createNode: () => new Text( nameProperty, textOptions ),
        value: choice
      };
    } );

    super( reactionProperty, items, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'ReactionRadioButtonGroup', ReactionRadioButtonGroup );