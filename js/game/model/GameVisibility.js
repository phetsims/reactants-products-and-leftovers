// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration that describes the visibility choices for the Game.
 * The inverted logic of "Hide" vs "Show" isn't great, but it matches the UI and prevents us from having to use
 * adapter Properties. See https://github.com/phetsims/reactants-products-and-leftovers/issues/68.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

const GameVisibility = Enumeration.byKeys( [ 'HIDE_MOLECULES', 'HIDE_NUMBERS', 'SHOW_ALL' ] );

reactantsProductsAndLeftovers.register( 'GameVisibility', GameVisibility );
export default GameVisibility;