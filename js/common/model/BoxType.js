// Copyright 2014-2022, University of Colorado Boulder

/**
 * Enum for the 2 boxes that represent the 2 states of a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

const BoxType = EnumerationDeprecated.byKeys( [
  'BEFORE', // before the reaction started
  'AFTER'   // after the reaction completes
] );

reactantsProductsAndLeftovers.register( 'BoxType', BoxType );

export default BoxType;