// Copyright 2020-2025, University of Colorado Boulder

/**
 * Radio buttons for selecting a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import Reaction from '../model/Reaction.js';

export default class ReactionRadioButtonGroup<R extends Reaction = Reaction> extends AquaRadioButtonGroup<R> {

  public constructor( reactionProperty: Property<R>, reactions: R[], tandem: Tandem ) {

    const textOptions = {
      font: new PhetFont( 16 ),
      fill: 'white',
      maxWidth: 175 // determined empirically
    };

    // Describe radio buttons, one for each reaction.
    const items: AquaRadioButtonGroupItem<R>[] = reactions.map( reaction => {
      const nameProperty = reaction.nameProperty!;
      assert && assert( nameProperty );
      return {
        createNode: tandem => new Text( nameProperty, textOptions ),
        value: reaction,
        tandemName: `${reaction.tandem.name}RadioButton`
      };
    } );

    super( reactionProperty, items, {

      // AquaRadioButtonGroupOptions
      orientation: 'vertical',
      align: 'left',
      spacing: 10,
      touchAreaXDilation: 10,
      radioButtonOptions: { radius: 8 },
      isDisposable: false,
      tandem: tandem
    } );
  }
}

reactantsProductsAndLeftovers.register( 'ReactionRadioButtonGroup', ReactionRadioButtonGroup );