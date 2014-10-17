// Copyright 2002-2014, University of Colorado Boulder

/**
 * Creates challenges where level-of-difficulty is based on the number variables that
 * we're solving for, and whether the variables are "before" or "after" terms.
 * <p>
 * Behavior is:
 * <ul>
 * <li>Level 1: one or two products random, Before (2 variables)
 * <li>Level 2: one product random, After
 * <li>Level 3: two products random, After (4 variables)
 * </ul>
 * Additional requirements:
 * <ul>
 * <li>all coefficients will be > 0
 * <li>all reactant quantities will be > 0
 * <li>every game will contain exactly one zero-products challenge
 * <li>game will contain no duplicate reactions TODO added for HTML5, OK?
 * </ul>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Challenge = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/Challenge' );
  var ChallengeType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeType' );
  var ChallengeVisibility = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeVisibility' );
  var ReactionFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/ReactionFactory' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );

  // level 2 is all the one-product reactions
  var LEVEL2_LIST = [
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
    ReactionFactory.Reaction_P4_10Cl2__4PCl5,
    ReactionFactory.Reaction_PCl3_Cl2__PCl5,
    ReactionFactory.Reaction_2SO2_O2__2SO3
  ];

  // level 3 is all the two-product reactions
  var LEVEL3_LIST = [
    ReactionFactory.Reaction_2C_2H2O__CH4_CO2,
    ReactionFactory.Reaction_CH4_H2O__3H2_CO,
    ReactionFactory.combustMethane,
    ReactionFactory.Reaction_2C2H6_7O2__4CO2_6H2O,
    ReactionFactory.Reaction_C2H4_3O2__2CO2_2H2O,
    ReactionFactory.Reaction_2C2H2_5O2__4CO2_2H2O,
    ReactionFactory.Reaction_C2H5OH_3O2__2CO2_3H2O,
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
  var LEVEL1_LIST = LEVEL2_LIST.concat( LEVEL3_LIST );

  // challenge arrays, indexed by level
  var REACTIONS = [ LEVEL1_LIST, LEVEL2_LIST, LEVEL3_LIST ];

  // challenge type, indexed by level
  var CHALLENGE_TYPE = [ ChallengeType.BEFORE, ChallengeType.AFTER, ChallengeType.AFTER ];

  var ChallengeFactory = {

    /**
     * Creates challenges.
     * @param {number} numberOfChallenges
     * @param {number} level
     * @param {number} maxQuantity
     * @param {ChallengeVisibility} challengeVisibility
     * @returns {[Challenge]}
     */
    createChallenges: function( numberOfChallenges, level, maxQuantity, challengeVisibility ) {

       // check args
      assert && assert( numberOfChallenges > 0 );
      assert && assert( level >= 0 && level < REACTIONS.length );
      assert && assert( maxQuantity > 0 );

      var factoryFunctions = REACTIONS[level].slice( 0 ); // make a copy of the array for the specified level

      // determine which challenge will have zero products
      var zeroProductsIndex = Math.floor( Math.random() * numberOfChallenges );

      var challenges = []; // [{Challenge}]
      for ( var i = 0; i < numberOfChallenges; i++ ) {

        // reaction with quantities
        var reaction = null; // {Reaction}
        if ( i == zeroProductsIndex ) {
          reaction = createChallengeWithoutProducts( factoryFunctions );
        }
        else {
          reaction = createChallengeWithProducts( factoryFunctions, maxQuantity );
        }
        //TODO
//        fixQuantityRangeViolation( reaction, maxQuantity ); // do this *before* creating the challenge, see Unfuddle #2156

        challenges.push( new Challenge( reaction, CHALLENGE_TYPE[ level ], challengeVisibility ) );
      }

      assert && assert( challenges.length === numberOfChallenges );
      return challenges;
    },

    // Runs a sanity check, for debugging.
    test: function() { doTest() }
  };

  /*
   * Generates a random number in some range.
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  var getRandomNumber = function( min, max ) {
    assert && assert( min < max );
    return min + Math.floor( Math.random() * ( max - min + 1 ) );
  };

  /**
   * Creates a reaction with non-zero quantities of at least one product.
   * @param {[function]} factoryFunctions
   * @param {number} maxQuantity
   * @returns {Reaction}
   */
  var createChallengeWithProducts = function( factoryFunctions, maxQuantity ) {

    // Choose a function and remove it from the further consideration.
    var randomIndex = getRandomNumber( 0, factoryFunctions.length - 1 );
    var factoryFunction = factoryFunctions[ randomIndex ];
    factoryFunctions.splice( randomIndex, 1 );

    // Create the reaction with non-zero quantities of at least one product.
    var reaction = factoryFunction();
    reaction.reactants.forEach( function( reactant ) {
      reactant.quantity = getRandomNumber( reactant.coefficient, maxQuantity );
    } );

    return reaction;
  };

  /*
   * Creates a reaction with zero quantities of all products.
   * @param {[function]} factoryFunctions
   * @returns {Reaction}
   */
  var createChallengeWithoutProducts = function( factoryFunctions ) {

    // Choose a reaction that is capable of having no products when all reactant quantities are non-zero.
    var reaction = null;
    var retry = true;
    while ( retry ) {

      // Choose a function and remove it from the further consideration.
      var randomIndex = getRandomNumber( 0, factoryFunctions.length - 1 );
      var factoryFunction = factoryFunctions[ randomIndex ];
      factoryFunctions.splice( randomIndex, 1 );

      // Create the reaction and test its coefficients.
      reaction = factoryFunction();
      retry = reactantCoefficientsAllOne( reaction );
    }

    // set quantities
    reaction.reactants.forEach( function( reactant ) {
      reactant.quantity = getRandomNumber( 1, Math.max( 1, reactant.coefficient - 1 ) );
    } );

    return reaction;
  };

  /*
   * Does this reaction have coefficient of 1 for all reactants? This type of reaction cannot produce
   * zero products with non-zero quantities, so we don't want to use it for that purpose.
   * @param {Reaction} reaction
   * @returns {boolean}
   */
  var reactantCoefficientsAllOne = function( reaction ) {
    var allOne = true;
    reaction.reactants.forEach( function( reactant ) {
      if ( reactant.coefficient !== 1 ) {
        allOne = false;
      }
    } );
    return allOne;
  };

  /**
   * Runs a sanity check, looking for problems with reactions and the challenge-creation algorithm.
   * Intended to be run from the browser console via ChallengeFactory.test().
   */
  var doTest = function() {

    // hoist vars that will be reused
    var factoryFunction, reaction;

    // Print reactions by level. Put all reactions in a container, removing duplicates.
    var factoryFunctions = [];
    for ( var level = 0; level < REACTIONS.length; level++ ) {
      console.log( '----------------------------------------------------------' );
      console.log( 'Level ' + ( level + 1 ) );
      console.log( '----------------------------------------------------------' );
      for ( var reactionIndex = 0; reactionIndex < REACTIONS[ level ].length; reactionIndex++ ) {
        factoryFunction = REACTIONS[ level ][ reactionIndex ];
        reaction = factoryFunction();
        console.log( reaction.toString() );
        if ( factoryFunctions.indexOf( factoryFunction ) !== -1 ) {
          factoryFunctions.push( factoryFunction );
        }
      }
    }

    // Look for reactions with coefficients > maxQuantity, we must have none of these.
    var maxQuantity = RPALConstants.QUANTITY_RANGE.max;
    console.log( '----------------------------------------------------------' );
    console.log( "Looking for coefficient-range violations ..." );
    console.log( '----------------------------------------------------------' );
    var numberOfCoefficientRangeViolations = 0;
    factoryFunctions.forEach( function( factoryFunction ) {
      reaction = factoryFunction();
      for ( var i = 0; i < reaction.reactants.length; i++ ) {
        if ( reaction.reactants[i].coefficient < 1 || reaction.reactants[i].coefficient > maxQuantity ) {
          console.log( "ERROR: coefficient out of range : " + reaction.toString() );
          numberOfCoefficientRangeViolations++;
          break;
        }
      }
    } );
    console.log( 'Number of coefficient-range violations = ' + numberOfCoefficientRangeViolations );
  };

  return ChallengeFactory;
} );


//TODO continue porting doTest()
//
//        // Look for quantity range violations in all reactions. We expect these, but require that they can be fixed.
//        System.out.println( "LOOKING FOR QUANTITY RANGE VIOLATIONS THAT CANNOT BE FIXED ..." );
//        System.out.println();
//        for ( Class<? extends ChemicalReaction> reactionClass : reactionClasses ) {
//            ChemicalReaction reaction = instantiateReaction( reactionClass );
//            // set all reactant quantities to their max values.
//            for ( Reactant reactant : reaction.getReactants() ) {
//                reactant.setQuantity( maxQuantity );
//            }
//            // look for violations and try to fix them.
//            fixQuantityRangeViolation( reaction, maxQuantity, true /* enableDebugOutput */ );
//        }
//
//        // Generate many challenges for each level, and validate our expectations.
//        System.out.println();
//        System.out.println( "TESTING CHALLENGE GENERATION ..." );
//        System.out.println();
//        for ( int level = GameModel.LEVEL_RANGE.getMin(); level <= GameModel.LEVEL_RANGE.getMax(); level++ ) {
//            for ( int i = 0; i < 100; i++ ) {
//
//                // create challenges
//                GameChallenge[] challenges = factory.createChallenges( GameModel.getChallengesPerGame(), level, maxQuantity, ChallengeVisibility.BOTH );
//
//                // validate
//                int numberWithZeroProducts = 0;
//                for ( GameChallenge challenge : challenges ) {
//
//                    // verify that all reactant quantities are > 0
//                    boolean zeroReactants = false;
//                    for ( Reactant reactant : challenge.getReaction().getReactants() ) {
//                        if ( reactant.getQuantity() < 1 ) {
//                            zeroReactants = true;
//                        }
//                    }
//                    if ( zeroReactants ) {
//                        System.out.println( "ERROR: challenge has zero reactants, level=" + level + " : " +  challenge.getReaction().toString() );
//                    }
//
//                    // count how many challenges have zero products
//                    int nonZeroProducts = 0;
//                    for ( Product product : challenge.getReaction().getProducts() ) {
//                        if ( product.getQuantity() > 0 ) {
//                            nonZeroProducts++;
//                        }
//                    }
//                    if ( nonZeroProducts == 0 ) {
//                        numberWithZeroProducts++;
//                    }
//                }
//
//                // should have exactly one challenge with zero products
//                if ( numberWithZeroProducts != 1 ) {
//                    System.out.println( "ERROR: more than one challenge with zero products, level=" + level + " challenges=" );
//                    for ( int j = 0; j < challenges.length; j++ ) {
//                        System.out.println( j + ": " + challenges[j].getReaction().toString() );
//                    }
//                }
//            }
//        }
//        System.out.println( "Done." );
//    }
//}
//
