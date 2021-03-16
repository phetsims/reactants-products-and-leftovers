// Copyright 2014-2020, University of Colorado Boulder

/**
 * Creates challenges where level-of-difficulty is based on the number variables that
 * we're solving for, and whether the variables are 'Before' or 'After' terms.
 *
 * Behavior is:
 * - Level 1: one or two products random, Before (2 variables)
 * - Level 2: one product random, After
 * - Level 3: two products random, After (4 variables)
 *
 * Additional requirements:
 * - all coefficients will be > 0
 * - all reactant quantities will be > 0
 * - every game will contain exactly one zero-products challenge
 * - game will contain no duplicate reactions
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import BoxType from '../../common/model/BoxType.js';
import ReactionFactory from '../../common/model/ReactionFactory.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALQueryParameters from '../../common/RPALQueryParameters.js';
import DevStringUtils from '../../dev/DevStringUtils.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import Challenge from './Challenge.js';

// constants
const CHALLENGES_PER_LEVEL = 5;

// level 2 is all the one-product reactions
const LEVEL2_POOL = [
  ReactionFactory.Reaction_PCl3_Cl2__PCl5, // PCl5 is the largest molecule in this pool, so put this first for layout debugging
  ReactionFactory.makeWater,
  ReactionFactory.Reaction_H2_F2__2HF,
  ReactionFactory.Reaction_H2_Cl2__2HCl,
  ReactionFactory.Reaction_CO_2H2__CH3OH,
  ReactionFactory.Reaction_CH2O_H2__CH3OH,
  ReactionFactory.Reaction_C2H4_H2__C2H6,
  ReactionFactory.Reaction_C2H2_2H2__C2H6,
  ReactionFactory.Reaction_C_O2__CO2,
  ReactionFactory.Reaction_2C_O2__2CO,
  ReactionFactory.Reaction_2CO_O2__2CO2,
  ReactionFactory.Reaction_C_CO2__2CO,
  ReactionFactory.Reaction_C_2S__CS2,
  ReactionFactory.makeAmmonia,
  ReactionFactory.Reaction_N2_O2__2NO,
  ReactionFactory.Reaction_2NO_O2__2NO2,
  ReactionFactory.Reaction_2N2_O2__2N2O,
  ReactionFactory.Reaction_P4_6H2__4PH3,
  ReactionFactory.Reaction_P4_6F2__4PF3,
  ReactionFactory.Reaction_P4_6Cl2__4PCl3,
  ReactionFactory.Reaction_2SO2_O2__2SO3
];

// level 3 is all the two-product reactions
const LEVEL3_POOL = [
  ReactionFactory.Reaction_C2H5OH_3O2__2CO2_3H2O, // C2H5OH has the most atoms in this pool, so put this first for performance debugging
  ReactionFactory.Reaction_2C_2H2O__CH4_CO2,
  ReactionFactory.Reaction_CH4_H2O__3H2_CO,
  ReactionFactory.combustMethane,
  ReactionFactory.Reaction_2C2H6_7O2__4CO2_6H2O,
  ReactionFactory.Reaction_C2H4_3O2__2CO2_2H2O,
  ReactionFactory.Reaction_2C2H2_5O2__4CO2_2H2O,
  ReactionFactory.Reaction_C2H6_Cl2__C2H5Cl_HCl,
  ReactionFactory.Reaction_CH4_4S__CS2_2H2S,
  ReactionFactory.Reaction_CS2_3O2__CO2_2SO2,
  ReactionFactory.Reaction_4NH3_3O2__2N2_6H2O,
  ReactionFactory.Reaction_4NH3_5O2__4NO_6H2O,
  ReactionFactory.Reaction_4NH3_7O2__4NO2_6H2O,
  ReactionFactory.Reaction_4NH3_6NO__5N2_6H2O,
  ReactionFactory.Reaction_SO2_2H2__S_2H2O,
  ReactionFactory.Reaction_SO2_3H2__H2S_2H2O,
  ReactionFactory.Reaction_2F2_H2O__OF2_2HF,
  ReactionFactory.Reaction_OF2_H2O__O2_2HF
];

// level 1 is all the reactions
const LEVEL1_POOL = LEVEL2_POOL.concat( LEVEL3_POOL );

// 'pools' of factory functions, indexed by level
const POOLS = [ LEVEL1_POOL, LEVEL2_POOL, LEVEL3_POOL ];

// which box is interactive, indexed by level
const INTERACTIVE_BOXES = [ BoxType.BEFORE, BoxType.AFTER, BoxType.AFTER ];

const ChallengeFactory = {

  /**
   * Creates a set of challenges.
   * @param {number} level game level, starting at zero
   * @param {number} maxQuantity maximum quantity of any substance in the reaction
   * @param {Object} [challengeOptions] options passed to Challenge constructor
   * @returns {Challenge[]}
   */
  createChallenges: function( level, maxQuantity, challengeOptions ) {
    challengeOptions = challengeOptions || {};
    if ( RPALQueryParameters.playAll ) {
      return createChallengesPlayAll( level, maxQuantity, challengeOptions );
    }
    else {
      return createChallenges( level, maxQuantity, challengeOptions );
    }
  },

  /**
   * Gets the number of reactions in the 'pool' for a specified level.
   * @param {number} level game level, starting at zero
   * @returns {number}
   */
  getNumberOfChallenges: function( level ) {
    assert && assert( level >= 0 && level < POOLS.length );
    return RPALQueryParameters.playAll ? POOLS[ level ].length : CHALLENGES_PER_LEVEL;
  },

  // DEBUG: Runs a sanity check on this factory, prints to console.
  test: function() { doTest(); }
};

/**
 * Creates a set of random challenges.
 *
 * @param {number} level
 * @param {number} maxQuantity
 * @param {Object} challengeOptions options to the Challenge constructor
 * @returns {Challenge[]}
 */
function createChallenges( level, maxQuantity, challengeOptions ) {

  assert && assert( level >= 0 && level < POOLS.length );
  assert && assert( maxQuantity > 0 );

  const numberOfChallenges = CHALLENGES_PER_LEVEL;
  const factoryFunctions = POOLS[ level ].slice( 0 ); // make a copy of the array for the specified level

  // Determine which challenge will have zero products.
  const zeroProductsIndex = dotRandom.nextInt( numberOfChallenges );

  const challenges = []; // [{Challenge}]
  for ( let i = 0; i < numberOfChallenges; i++ ) {

    // reaction with quantities
    let reaction = null; // {Reaction}
    if ( i === zeroProductsIndex ) {
      reaction = createChallengeWithoutProducts( factoryFunctions );
    }
    else {
      reaction = createChallengeWithProducts( factoryFunctions, maxQuantity );
    }

    // Adjust quantities if they exceed the maximum. Do this before creating the challenge.
    fixQuantityRangeViolation( reaction, maxQuantity );

    challenges.push( new Challenge( reaction, INTERACTIVE_BOXES[ level ], challengeOptions ) );
  }

  assert && assert( challenges.length === numberOfChallenges );
  return challenges;
}

/**
 * DEBUG: This is called when 'playAll' query parameter is present.
 * A challenge is randomly generated for every reaction in the level's pool, and the reactions always
 * appear in the same order. Quantities are randomly generated, so they will vary each a level is played.
 *
 * @param level
 * @param maxQuantity
 * @param challengeOptions
 */
function createChallengesPlayAll( level, maxQuantity, challengeOptions ) {

  const challenges = []; // [{Challenge}]
  const factoryFunctions = POOLS[ level ].slice( 0 ); // make a copy of the array for the specified level

  for ( let i = 0; i < factoryFunctions.length; i++ ) {

    // Create a reaction with non-zero quantities of at least one product.
    const reaction = factoryFunctions[ i ]();
    reaction.reactants.forEach( reactant => {
      reactant.quantityProperty.set( dotRandom.nextIntBetween( reactant.coefficientProperty.get(), maxQuantity ) );
    } );

    // Adjust quantities if they exceed the maximum. Do this before creating the challenge.
    fixQuantityRangeViolation( reaction, maxQuantity );

    challenges.push( new Challenge( reaction, INTERACTIVE_BOXES[ level ], challengeOptions ) );
  }

  return challenges;
}

/**
 * Creates a reaction with non-zero quantities of at least one product.
 * @param {function[]} factoryFunctions
 * @param {number} maxQuantity
 * @returns {Reaction}
 */
function createChallengeWithProducts( factoryFunctions, maxQuantity ) {

  assert && assert( factoryFunctions.length > 0 );
  assert && assert( maxQuantity > 0 );

  // Choose a function and remove it from the further consideration.
  const randomIndex = dotRandom.nextIntBetween( 0, factoryFunctions.length - 1 );
  const factoryFunction = factoryFunctions[ randomIndex ];
  factoryFunctions.splice( randomIndex, 1 );

  // Create a reaction with non-zero quantities of at least one product.
  const reaction = factoryFunction();
  reaction.reactants.forEach( reactant => {
    reactant.quantityProperty.set( dotRandom.nextIntBetween( reactant.coefficientProperty.get(), maxQuantity ) );
  } );

  return reaction;
}

/**
 * Creates a reaction with zero quantities of all products.
 * @param {function[]} factoryFunctions
 * @returns {Reaction}
 */
function createChallengeWithoutProducts( factoryFunctions ) {

  assert && assert( factoryFunctions.length > 0 );

  // Choose a reaction that is capable of having no products when all reactant quantities are non-zero.
  let reaction = null;
  let retry = true;
  const disqualifiedFunctions = []; // functions that were disqualified
  while ( retry ) {

    assert && assert( factoryFunctions.length > 0 );

    // Choose a function and remove it from the further consideration.
    const randomIndex = dotRandom.nextIntBetween( 0, factoryFunctions.length - 1 );
    const factoryFunction = factoryFunctions[ randomIndex ];
    factoryFunctions.splice( randomIndex, 1 );

    // Create the reaction and test its coefficients.
    reaction = factoryFunction();
    retry = reactantCoefficientsAllOne( reaction );

    if ( retry ) {
      disqualifiedFunctions.push( factoryFunction );
    }
  }

  // Put the functions that we didn't use back in the pool.
  disqualifiedFunctions.forEach( disqualifiedFunction => {
    factoryFunctions.push( disqualifiedFunction );
  } );

  // set quantities
  reaction.reactants.forEach( reactant => {
    reactant.quantityProperty.set( dotRandom.nextIntBetween( 1, Math.max( 1, reactant.coefficientProperty.get() - 1 ) ) );
  } );

  return reaction;
}

/**
 * Does this reaction have coefficient of 1 for all reactants? This type of reaction cannot produce
 * zero products with non-zero quantities, so we don't want to use it for that purpose.
 * @param {Reaction} reaction
 * @returns {boolean}
 */
function reactantCoefficientsAllOne( reaction ) {
  let allOne = true;
  reaction.reactants.forEach( reactant => {
    if ( reactant.coefficientProperty.get() !== 1 ) {
      allOne = false;
    }
  } );
  return allOne;
}

/**
 * Checks a reaction for quantity range violations.
 * @param {Reaction} reaction
 * @param {number} maxQuantity
 * @returns {boolean}
 */
function hasQuantityRangeViolation( reaction, maxQuantity ) {
  let violation = false;
  let i;
  for ( i = 0; !violation && i < reaction.reactants.length; i++ ) {
    violation = ( reaction.reactants[ i ].quantityProperty.get() > maxQuantity );
  }
  for ( i = 0; !violation && i < reaction.products.length; i++ ) {
    violation = ( reaction.products[ i ].quantityProperty.get() > maxQuantity );
  }
  for ( i = 0; !violation && i < reaction.leftovers.length; i++ ) {
    violation = ( reaction.leftovers[ i ].quantityProperty.get() > maxQuantity );
  }
  return violation;
}

/**
 * Fixes any quantity-range violations in a reaction.
 * We do this by decrementing reactant quantities by 1, alternating reactants as we do so.
 * Each reactant must have a quantity of at least 1, in order to have a valid reaction.
 *
 * In the Java version of this simulation, this manifested itself as Unfuddle #2156.
 *
 * @param {Reaction} reaction
 * @param {number} maxQuantity
 * @param {boolean} enableDebugOutput prints to the console when a violation is fixed
 */
function fixQuantityRangeViolation( reaction, maxQuantity, enableDebugOutput ) {

  enableDebugOutput = !!enableDebugOutput || false;

  if ( hasQuantityRangeViolation( reaction, maxQuantity ) ) {

    const beforeFixString = DevStringUtils.reactionString( reaction );

    // First, make sure all reactant quantities are in range.
    reaction.reactants.forEach( reactant => {
      if ( reactant.quantityProperty.get() > maxQuantity ) {
        reactant.quantityProperty.set( maxQuantity );
      }
    } );

    // Then incrementally reduce reactant quantities, alternating reactants.
    let reactantIndex = 0;
    let changed = false;
    while ( hasQuantityRangeViolation( reaction, maxQuantity ) ) {
      const reactant = reaction.reactants[ reactantIndex ];
      const quantity = reactant.quantityProperty.get();
      if ( quantity > 1 ) {
        reactant.quantityProperty.set( reactant.quantityProperty.get() - 1 );
        changed = true;
      }
      reactantIndex++;
      if ( reactantIndex > reaction.reactants.length - 1 ) {
        reactantIndex = 0;
        if ( !changed ) {
          // we have not been able to reduce any reactant
          break;
        }
      }
    }

    // If all reactants have been reduced and we are still out of range, bail with a serious error.
    if ( hasQuantityRangeViolation( reaction, maxQuantity ) ) {
      throw new Error( `ERROR: quantity-range violation cannot be fixed: ${beforeFixString}` );
    }

    if ( enableDebugOutput ) {
      console.log( `quantity range violation: ${beforeFixString
      } fixed: ${DevStringUtils.quantitiesString( reaction )}` );
    }
  }
}

/**
 * DEBUG
 * Runs a sanity check, looking for problems with reactions and the challenge-creation algorithm.
 * Intended to be run from the browser console via ChallengeFactory.test(), or run the simulation
 * with 'dev' query parameter and press the 'Test' button that appears on the Game's level-selection screen.
 * Output is printed to the console.
 */
function doTest() {

  assert && assert( !RPALQueryParameters.playAll ); // test doesn't work with some query parameters

  // Cumulative counts for this test
  let numberOfChallengesGenerated = 0;
  let numberOfCoefficientRangeErrors = 0;
  let numberOfReactantErrors = 0;
  let numberOfProductErrors = 0;
  let numberOfQuantityRangeErrors = 0;

  // hoist vars that will be reused
  let factoryFunction;
  let reaction;
  let level;
  let i;
  let j;

  // Print reactions by level. Put all reactions in a container, removing duplicates.
  const factoryFunctions = [];
  for ( level = 0; level < POOLS.length; level++ ) {
    console.log( '----------------------------------------------------------' );
    console.log( `Level ${level + 1}` );
    console.log( '----------------------------------------------------------' );
    for ( i = 0; i < POOLS[ level ].length; i++ ) {
      factoryFunction = POOLS[ level ][ i ];
      reaction = factoryFunction();
      console.log( DevStringUtils.equationString( reaction ) );
      if ( factoryFunctions.indexOf( factoryFunction ) === -1 ) {
        factoryFunctions.push( factoryFunction );
      }
    }
  }

  // Look for reactions with coefficients > maxQuantity, we must have none of these.
  const maxQuantity = RPALConstants.QUANTITY_RANGE.max;
  console.log( '----------------------------------------------------------' );
  console.log( 'Looking for coefficient-range violations ...' );
  console.log( '----------------------------------------------------------' );
  factoryFunctions.forEach( factoryFunction => {
    reaction = factoryFunction();
    for ( i = 0; i < reaction.reactants.length; i++ ) {
      if ( reaction.reactants[ i ].coefficientProperty.get() > maxQuantity ) {
        console.log( `ERROR: reactant coefficient out of range : ${DevStringUtils.equationString( reaction )}` );
        numberOfCoefficientRangeErrors++;
        break;
      }
    }
    for ( i = 0; i < reaction.products.length; i++ ) {
      if ( reaction.products[ i ].coefficientProperty.get() > maxQuantity ) {
        console.log( `ERROR: product coefficient out of range : ${DevStringUtils.equationString( reaction )}` );
        numberOfCoefficientRangeErrors++;
        break;
      }
    }
  } );

  /*
   * Look for quantity range violations in all reactions. We expect these, but require that they can be fixed.
   * This test will halt if we encounter a violation that can't be fixed.
   */
  console.log( '-----------------------------------------------------------------' );
  console.log( 'Looking for quantity-range violations that cannot be fixed ...' );
  console.log( '----------------------------------------------------------------' );
  factoryFunctions.forEach( factoryFunction => {
    reaction = factoryFunction();
    // set all reactant quantities to their max values.
    for ( i = 0; i < reaction.reactants.length; i++ ) {
      reaction.reactants[ i ].quantityProperty.set( maxQuantity );
    }
    // look for violations and try to fix them.
    fixQuantityRangeViolation( reaction, maxQuantity, true /* enableDebugOutput */ );
  } );

  // Generate many challenges for each level, and validate our expectations.
  console.log( '----------------------------------------------------------' );
  console.log( 'Testing challenge generation ...' );
  console.log( '----------------------------------------------------------' );

  for ( level = 0; level < POOLS.length; level++ ) {
    for ( i = 0; i < 100; i++ ) {

      // create challenges
      const challenges = ChallengeFactory.createChallenges( level, maxQuantity );
      numberOfChallengesGenerated += challenges.length;

      // validate
      let numberWithZeroProducts = 0;
      challenges.forEach( challenge => {

        // verify that all reactant quantities are > 0
        let zeroReactants = false;
        challenge.reaction.reactants.forEach( reactant => {
          if ( reactant.quantityProperty.get() < 1 ) {
            zeroReactants = true;
          }
        } );
        if ( zeroReactants ) {
          console.log( `ERROR: challenge has zero reactants, level=${level} : ${
            DevStringUtils.reactionString( challenge.reaction )}` );
          numberOfReactantErrors++;
        }

        // count how many challenges have zero products
        let nonZeroProducts = 0;
        challenge.reaction.products.forEach( product => {
          if ( product.quantityProperty.get() > 0 ) {
            nonZeroProducts++;
          }
        } );
        if ( nonZeroProducts === 0 ) {
          numberWithZeroProducts++;
        }

        // quantity-range violation?
        if ( hasQuantityRangeViolation( reaction, maxQuantity ) ) {
          console.log( `ERROR: challenge has quantity-range violation, level=${level} : ${
            DevStringUtils.reactionString( challenge.reaction )}` );
          numberOfQuantityRangeErrors++;
        }
      } );

      // should have exactly one challenge with zero products (irrelevant for 'playAll')
      if ( numberWithZeroProducts !== 1 && !RPALQueryParameters.playAll ) {
        numberOfProductErrors++;
        console.log( `ERROR: more than one challenge with zero products, level=${level} challenges=` );
        for ( j = 0; j < challenges.length; j++ ) {
          console.log( `${j}: ${DevStringUtils.reactionString( challenges[ j ].reaction )}` );
        }
      }
    }
  }

  // This is the bit that you want to look at, when the test has completed.  Errors should all be zero.
  console.log( '----------------------------------------------------------' );
  console.log( 'Summary' );
  console.log( '----------------------------------------------------------' );
  console.log( `challenges generated = ${numberOfChallengesGenerated}` );
  console.log( `coefficient-range errors = ${numberOfCoefficientRangeErrors}` );
  console.log( `zero-reactant errors = ${numberOfReactantErrors}` );
  console.log( `zero-product errors = ${numberOfProductErrors}` );
  console.log( `quantity-range errors = ${numberOfQuantityRangeErrors}` );
  console.log( '<done>' );
}

reactantsProductsAndLeftovers.register( 'ChallengeFactory', ChallengeFactory );
export default ChallengeFactory;