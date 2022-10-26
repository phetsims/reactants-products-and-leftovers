// Copyright 2020-2022, University of Colorado Boulder

/**
 * Radio buttons for selecting a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

// constants
const TEXT_OPTIONS = { font: new PhetFont( 16 ), fill: 'white' };

class ReactionRadioButtonGroup extends AquaRadioButtonGroup {

  /**
   * @param {Property.<Reaction>} reactionProperty
   * @param {Reaction[]} choices
   * @param {Object} [options]
   */
  constructor( reactionProperty, choices, options ) {

    options = merge( {
      orientation: 'vertical',
      align: 'left',
      spacing: 10,
      touchAreaXDilation: 10,
      radioButtonOptions: { radius: 8 }
    }, options );

    // describe radio buttons, one for each reaction
    const items = [];
    choices.forEach( choice => {
      items.push( {
        createNode: tandem => new Text( choice.nameProperty, TEXT_OPTIONS ),
        value: choice
      } );
    } );

    super( reactionProperty, items, options );
  }
}

reactantsProductsAndLeftovers.register( 'ReactionRadioButtonGroup', ReactionRadioButtonGroup );
export default ReactionRadioButtonGroup;