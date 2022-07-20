// Copyright 2014-2022, University of Colorado Boulder

/**
 * View of a Game challenge. This node is not 'active' (connected to the model) until the activate() function is called.
 * This supports the ability to preload a node, then activate it at some later time.  See issue #17.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import FaceWithPointsNode from '../../../../scenery-phet/js/FaceWithPointsNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import BoxType from '../../common/model/BoxType.js';
import RPALColors from '../../common/RPALColors.js';
import RPALConstants from '../../common/RPALConstants.js';
import HideBox from '../../common/view/HideBox.js';
import MoleculesEquationNode from '../../common/view/MoleculesEquationNode.js';
import QuantitiesNode from '../../common/view/QuantitiesNode.js';
import RightArrowNode from '../../common/view/RightArrowNode.js';
import DevStringUtils from '../../dev/DevStringUtils.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import reactantsProductsAndLeftoversStrings from '../../reactantsProductsAndLeftoversStrings.js';
import PlayState from '../model/PlayState.js';
import GameButtons from './GameButtons.js';
import RandomBox from './RandomBox.js';

class ChallengeNode extends Node {

  /**
   * @param {GameModel} model
   * @param {Challenge} challenge
   * @param {Bounds2} challengeBounds portion of the screen where the Challenge can be displayed
   * @param {GameAudioPlayer} audioPlayer
   * @param {Object} [options]
   */
  constructor( model, challenge, challengeBounds, audioPlayer, options ) {

    options = merge( {
      boxSize: RPALConstants.GAME_BEFORE_AFTER_BOX_SIZE, // {Dimension2} size of the 'Before' and 'After' boxes
      quantityRange: RPALConstants.QUANTITY_RANGE, // {Range} range of the quantity values
      minIconSize: new Dimension2( 0, 0 ) // {Dimension2} minimum amount of layout space reserved for Substance icons
    }, options );

    super();

    // convenience variables, to improve readability
    const reaction = challenge.reaction;
    const guess = challenge.guess;
    const interactiveBox = challenge.interactiveBox;
    assert && assert( interactiveBox === BoxType.BEFORE || interactiveBox === BoxType.AFTER );

    // which substances are visible depends on whether we're guessing 'Before' or 'After' quantities
    const reactants = ( interactiveBox === BoxType.BEFORE ) ? guess.reactants : reaction.reactants;
    const products = ( interactiveBox === BoxType.AFTER ) ? guess.products : reaction.products;
    const leftovers = ( interactiveBox === BoxType.AFTER ) ? guess.leftovers : reaction.leftovers;

    //------------------------------------------------------------------------------------
    // Equation
    //------------------------------------------------------------------------------------

    // equation
    const equationNode = new MoleculesEquationNode( reaction, {
      fill: 'black',
      top: challengeBounds.top + 10,
      plusXSpacing: 25,
      arrowXSpacing: 25
    } );
    equationNode.left = challengeBounds.centerX - equationNode.arrowCenterX; // arrow at center of bounds

    // equations background
    const equationBackground = new Rectangle( 0, 0, equationNode.width + 30, equationNode.height + 6, 3, 3, {
      fill: 'white',
      stroke: 'black',
      center: equationNode.center
    } );

    this.addChild( equationBackground );
    this.addChild( equationNode );

    //------------------------------------------------------------------------------------
    // Property that tells us whether the 'Check' button should be enabled
    //------------------------------------------------------------------------------------

    // Check button is disabled if all guessable quantities are zero
    const quantityProperties = [];
    if ( interactiveBox === BoxType.BEFORE ) {
      guess.reactants.forEach( reactant => quantityProperties.push( reactant.quantityProperty ) );
    }
    else {
      guess.products.forEach( product => quantityProperties.push( product.quantityProperty ) );
      guess.leftovers.forEach( leftover => quantityProperties.push( leftover.quantityProperty ) );
    }

    // @private must be detached in dispose
    this.checkButtonEnabledProperty = new DerivedProperty( quantityProperties, () => {
      // true if any quantity that the user can guess is non-zero
      for ( let i = 0, j = arguments.length; i < j; i++ ) {
        // eslint-disable-next-line prefer-rest-params
        if ( arguments[ i ] !== 0 ) { return true; }
      }
      return false;
    } );

    //------------------------------------------------------------------------------------
    // Boxes & arrow
    //------------------------------------------------------------------------------------

    // Arrow between boxes
    const arrowNode = new RightArrowNode( {
      fill: RPALColors.PANEL_FILL,
      stroke: null,
      scale: 0.75,
      centerX: challengeBounds.centerX
      // y position handled below
    } );
    this.addChild( arrowNode );

    // @private 'Before Reaction' box, with molecules at random positions
    this.beforeBox = new RandomBox( reactants, {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      right: arrowNode.left - 5,
      top: equationNode.bottom + 10
    } );
    this.addChild( this.beforeBox );
    arrowNode.centerY = this.beforeBox.centerY;

    // @private 'After Reaction' box, with molecules at random positions
    this.afterBox = new RandomBox( products.concat( leftovers ), {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      left: arrowNode.right + 5,
      top: this.beforeBox.top
    } );
    this.addChild( this.afterBox );

    //------------------------------------------------------------------------------------
    // Face
    //------------------------------------------------------------------------------------

    let faceNode = null; // created on demand

    //------------------------------------------------------------------------------------
    // Question mark
    //------------------------------------------------------------------------------------

    const questionMark = new Text( reactantsProductsAndLeftoversStrings.questionMark, {
      font: new PhetFont( { size: 150, weight: 'bold' } ),
      maxWidth: 0.75 * options.boxSize.width // constrain width for i18n
    } );
    this.addChild( questionMark );
    questionMark.centerX = ( interactiveBox === BoxType.BEFORE ) ? this.beforeBox.centerX : this.afterBox.centerX;
    // centerY is handled below

    // visible only until the user has entered a valid guess
    const checkButtonEnabledObserver = checkButtonEnabled => {
      questionMark.visible = !checkButtonEnabled;
      if ( checkButtonEnabled ) {
        this.checkButtonEnabledProperty.unlink( checkButtonEnabledObserver );
      }
    };
    // unlink is unnecessary, since this property belongs to this instance
    this.checkButtonEnabledProperty.link( checkButtonEnabledObserver );

    //------------------------------------------------------------------------------------
    // Buttons (Check, Try Again, ...)
    //------------------------------------------------------------------------------------

    // @private
    this.buttons = new GameButtons( model, this.checkButtonEnabledProperty, {
      maxWidth: 0.85 * options.boxSize.width // constrain width for i18n
    } );
    this.addChild( this.buttons );
    this.buttons.centerX = ( interactiveBox === BoxType.BEFORE ) ? this.beforeBox.centerX : this.afterBox.centerX;
    this.buttons.bottom = this.beforeBox.bottom - 15;

    // center question mark in negative space above buttons
    questionMark.centerY = this.beforeBox.top + ( this.buttons.top - this.beforeBox.top ) / 2;

    //------------------------------------------------------------------------------------
    // Everything below the boxes
    //------------------------------------------------------------------------------------

    // x-offsets of substances relative to their boxes
    const beforeXOffsets = QuantitiesNode.createXOffsets( reactants.length, options.boxSize.width );
    const afterXOffsets = QuantitiesNode.createXOffsets( products.length + leftovers.length, options.boxSize.width );

    // @private
    this.quantitiesNode = new QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, {
      interactiveBox: interactiveBox,
      boxWidth: options.boxSize.width,
      afterBoxXOffset: this.afterBox.left - this.beforeBox.left,
      minIconSize: options.minIconSize,
      quantityRange: options.quantityRange,
      hideNumbersBox: !challenge.numbersVisible,
      x: this.beforeBox.x,
      top: this.beforeBox.bottom + 4
    } );
    this.addChild( this.quantitiesNode );

    //------------------------------------------------------------------------------------
    // Optional 'Hide molecules' box on top of Before or After box
    //------------------------------------------------------------------------------------

    let hideMoleculesBox = null;
    if ( !challenge.moleculesVisible ) {
      hideMoleculesBox = new HideBox( {
        boxSize: options.boxSize,
        iconHeight: 0.4 * options.boxSize.height,
        cornerRadius: 3,
        left: ( interactiveBox === BoxType.BEFORE ) ? this.afterBox.left : this.beforeBox.left,
        bottom: this.beforeBox.bottom
      } );
      this.addChild( hideMoleculesBox );
    }

    //------------------------------------------------------------------------------------
    // Observers
    //------------------------------------------------------------------------------------

    // @private must be disposed
    // Move from "Try Again" to "Check" state when a quantity is changed, see reactants-products-and-leftovers#37.
    this.answerChangedLink = Multilink.lazyMultilink( quantityProperties, () => {
      if ( this.playStateProperty.get() === PlayState.TRY_AGAIN ) {
        this.playStateProperty.set( PlayState.SECOND_CHECK );
      }
    } );

    // @private handle PlayState changes
    this.playStateObserver = playState => {

      // face
      let faceVisible = false;
      let facePoints = 0;
      if ( playState === PlayState.TRY_AGAIN || playState === PlayState.SHOW_ANSWER ) {
        audioPlayer.wrongAnswer();
        facePoints = 0;
        faceVisible = true;
      }
      else if ( playState === PlayState.NEXT ) {
        // Check facePoints instead of correctness of challenge, because correct answer has been filled in by now.
        facePoints = challenge.points;
        if ( challenge.points > 0 ) {
          audioPlayer.correctAnswer();
          faceVisible = true;
        }
      }

      // create face on demand
      if ( !faceNode && faceVisible ) {
        faceNode = new FaceWithPointsNode( {
          faceDiameter: 150,
          faceOpacity: 0.5,
          pointsAlignment: 'rightCenter',
          pointsFill: 'yellow',
          pointsStroke: 'rgb(50,50,50)',
          pointsOpacity: 0.65
        } );
        this.addChild( faceNode );
        // put it in the correct box
        faceNode.centerX = ( interactiveBox === BoxType.BEFORE ) ? this.beforeBox.centerX : this.afterBox.centerX;
        faceNode.centerY = questionMark.centerY = this.beforeBox.top + ( this.buttons.top - this.beforeBox.top ) / 2;
      }
      if ( faceNode ) {
        faceNode.setPoints( facePoints );
        ( facePoints === 0 ) ? faceNode.frown() : faceNode.smile();
        faceNode.visible = faceVisible;
      }

      // 'hide' boxes
      const hideBoxVisible = ( playState !== PlayState.NEXT );
      if ( hideMoleculesBox ) {
        hideMoleculesBox.visible = hideBoxVisible;
        // also hide the Before/After box, so we don't see its stroke
        if ( interactiveBox === BoxType.BEFORE ) {
          this.afterBox.visible = !hideBoxVisible;
        }
        else {
          this.beforeBox.visible = !hideBoxVisible;
        }
      }
      this.quantitiesNode.setHideNumbersBoxVisible( hideBoxVisible );

      // switch between spinners and static numbers
      this.quantitiesNode.setInteractive( _.includes( [ PlayState.FIRST_CHECK, PlayState.SECOND_CHECK, PlayState.TRY_AGAIN ], playState ) );
    };
    this.playStateProperty = null; // @private will be set by activate()

    // pdom keyboard nav order
    this.pdomOrder = [ this.quantitiesNode, this.buttons ];

    //------------------------------------------------------------------------------------
    // Developer
    //------------------------------------------------------------------------------------

    // The answer to the current challenge, bottom center
    if ( phet.chipper.queryParameters.showAnswers ) {
      this.addChild( new Text( DevStringUtils.quantitiesString( reaction ), {
        fill: 'red',
        font: new PhetFont( 12 ),
        centerX: challengeBounds.centerX,
        bottom: challengeBounds.bottom - 5
      } ) );
    }

    this.mutate( options );
  }

  /**
   * Connects this node to the model. Until this is called, the node is preloaded, but not fully functional.
   * @param {EnumerationDeprecatedProperty.<PlayState>} playStateProperty
   * @public
   */
  activate( playStateProperty ) {
    this.buttons.activate( playStateProperty );
    this.playStateProperty = playStateProperty;
    // optimization: we're set up in the correct initial state, so wait for state change
    this.playStateProperty.lazyLink( this.playStateObserver ); // must be unlinked in dispose
  }

  /**
   * @public
   * @override
   */
  dispose() {

    // model
    if ( this.playStateProperty ) {
      this.playStateProperty.unlink( this.playStateObserver );
    }

    // boxes
    this.beforeBox.dispose();
    this.beforeBox = null;
    this.afterBox.dispose();
    this.afterBox = null;

    // buttons
    this.buttons.dispose();
    this.buttons = null;
    this.checkButtonEnabledProperty.unlinkAll();
    this.checkButtonEnabledProperty.dispose();
    this.answerChangedLink.dispose();

    // stuff below the boxes
    this.quantitiesNode.dispose();
    this.quantitiesNode = null;

    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'ChallengeNode', ChallengeNode );
export default ChallengeNode;