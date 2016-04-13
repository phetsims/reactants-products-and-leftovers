// Copyright 2014-2015, University of Colorado Boulder

/*
 * RequireJS configuration file for the 'Reactants, Products and Leftovers' sim.
 * Paths are relative to the location of this file.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

require.config( {

  deps: [ 'reactants-products-and-leftovers-main' ],

  paths: {

    // third-party libs
    text: '../../sherpa/lib/text-2.0.12',

    // PhET plugins
    audio: '../../chipper/js/requirejs-plugins/audio',
    image: '../../chipper/js/requirejs-plugins/image',
    mipmap: '../../chipper/js/requirejs-plugins/mipmap',
    string: '../../chipper/js/requirejs-plugins/string',

    // PhET libs, uppercase names to identify them in require.js imports
    AXON: '../../axon/js',
    BRAND: '../../brand/' + phet.chipper.brand + '/js',
    DOT: '../../dot/js',
    JOIST: '../../joist/js',
    KITE: '../../kite/js',
    NITROGLYCERIN: '../../nitroglycerin/js',
    PHET_CORE: '../../phet-core/js',
    PHETCOMMON: '../../phetcommon/js',
    REPOSITORY: '..',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    SHERPA: '../../sherpa',
    SUN: '../../sun/js',
    TANDEM: '../../tandem/js',
    VEGAS: '../../vegas/js',
    VIBE: '../../vibe/js',

    // sim code
    REACTANTS_PRODUCTS_AND_LEFTOVERS: '.'
  },

  // optional cache buster to make browser refresh load all included scripts, can be disabled with ?cacheBuster=false
  urlArgs: phet.chipper.getCacheBusterArgs()
} );
