// Copyright 2014-2023, University of Colorado Boulder

/**
 * View of a Game challenge. This node is not 'active' (connected to the model) until the activate() function is called.
 * This supports the ability to preload a node, then activate it at some later time.  See issue #17.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import FaceWithPointsNode from '../../../../scenery-phet/js/FaceWithPointsNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import BoxType from '../../common/model/BoxType.js';
import RPALColors from '../../common/RPALColors.js';
import RPALConstants from '../../common/RPALConstants.js';
import HideBox from '../../common/view/HideBox.js';
import MoleculesEquationNode from '../../common/view/MoleculesEquationNode.js';
import QuantitiesNode from '../../common/view/QuantitiesNode.js';
import RightArrowNode from '../../common/view/RightArrowNode.js';
import DevStringUtils from '../../dev/DevStringUtils.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import Challenge from '../model/Challenge.js';
import GameModel from '../model/GameModel.js';
import PlayState from '../model/PlayState.js';
import GameButtons from './GameButtons.js';
import RandomBox from './RandomBox.js';

const DEFAULT_MIN_ICON_SIZE = new Dimension2( 0, 0 );

type SelfOptions = {
  boxSize?: Dimension2; // size of the 'Before' and 'After' boxes
  quantityRange?: Range; // range of the quantity values
  minIconSize?: Dimension2; // minimum amount of layout space reserved for Substance icons
};

type ChallengeNodeOptions = SelfOptions;

export default class ChallengeNode extends Node {

  private readonly checkButtonEnabledProperty: TReadOnlyProperty<boolean>;
  private playStateProperty: EnumerationProperty<PlayState> | null; // set by activate()
  private readonly playStateObserver: ( playState: PlayState ) => void;
  private readonly buttons: GameButtons;
  private readonly disposeChallengeNode: () => void;

  /**
   * @param model
   * @param challenge
   * @param challengeBounds - portion of the screen where the Challenge can be displayed
   * @param audioPlayer
   * @param [providedOptions]
   */
  public constructor( model: GameModel, challenge: Challenge, challengeBounds: Bounds2, audioPlayer: GameAudioPlayer,
                      providedOptions?: ChallengeNodeOptions ) {

    const options = optionize<ChallengeNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      boxSize: RPALConstants.GAME_BEFORE_AFTER_BOX_SIZE,
      quantityRange: RPALConstants.QUANTITY_RANGE,
      minIconSize: DEFAULT_MIN_ICON_SIZE
    }, providedOptions );

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
    const equationBackground = new Rectangle( 0, 0, equationNode.width + 30, equationNode.height + 6, {
      cornerRadius: 3,
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
    const quantityProperties: TReadOnlyProperty<number>[] = [];
    if ( interactiveBox === BoxType.BEFORE ) {
      guess.reactants.forEach( reactant => quantityProperties.push( reactant.quantityProperty ) );
    }
    else {
      guess.products.forEach( product => quantityProperties.push( product.quantityProperty ) );
      guess.leftovers.forEach( leftover => quantityProperties.push( leftover.quantityProperty ) );
    }

    // true if any quantity that the user can guess is non-zero
    this.checkButtonEnabledProperty = DerivedProperty.deriveAny( quantityProperties, () =>
      !!_.find( quantityProperties, quantityProperty => ( quantityProperty.value !== 0 ) )
    );

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

    // 'Before Reaction' box, with molecules at random positions
    const beforeBox = new RandomBox( reactants, {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      right: arrowNode.left - 5,
      top: equationNode.bottom + 10
    } );
    this.addChild( beforeBox );
    arrowNode.centerY = beforeBox.centerY;

    // 'After Reaction' box, with molecules at random positions
    const afterBox = new RandomBox( products.concat( leftovers ), {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      left: arrowNode.right + 5,
      top: beforeBox.top
    } );
    this.addChild( afterBox );

    //------------------------------------------------------------------------------------
    // Face
    //------------------------------------------------------------------------------------

    let faceNode: FaceWithPointsNode | null = null; // created on demand

    //------------------------------------------------------------------------------------
    // Question mark
    //------------------------------------------------------------------------------------

    const questionMark = new Text( ReactantsProductsAndLeftoversStrings.questionMarkStringProperty, {
      font: new PhetFont( { size: 150, weight: 'bold' } ),
      maxWidth: 0.75 * options.boxSize.width // constrain width for i18n
    } );
    this.addChild( questionMark );
    questionMark.centerX = ( interactiveBox === BoxType.BEFORE ) ? beforeBox.centerX : afterBox.centerX;
    // centerY is handled below

    // visible only until the user has entered a valid guess
    const checkButtonEnabledObserver = ( checkButtonEnabled: boolean ) => {
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

    const buttons = new GameButtons( model, this.checkButtonEnabledProperty, {
      maxTextWidth: 0.65 * options.boxSize.width
    } );
    this.addChild( buttons );

    buttons.boundsProperty.link( () => {
      buttons.centerX = ( interactiveBox === BoxType.BEFORE ) ? beforeBox.centerX : afterBox.centerX;
      buttons.bottom = beforeBox.bottom - 15;
    } );

    // center question mark in negative space above buttons
    questionMark.centerY = beforeBox.top + ( buttons.top - beforeBox.top ) / 2;

    //------------------------------------------------------------------------------------
    // Everything below the boxes
    //------------------------------------------------------------------------------------

    // x-offsets of substances relative to their boxes
    const beforeXOffsets = QuantitiesNode.createXOffsets( reactants.length, options.boxSize.width );
    const afterXOffsets = QuantitiesNode.createXOffsets( products.length + leftovers.length, options.boxSize.width );

    const quantitiesNode = new QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, {
      interactiveBox: interactiveBox,
      boxWidth: options.boxSize.width,
      afterBoxXOffset: afterBox.left - beforeBox.left,
      minIconSize: options.minIconSize,
      quantityRange: options.quantityRange,
      hideNumbersBox: !challenge.numbersVisible,
      x: beforeBox.x,
      top: beforeBox.bottom + 4
    } );
    this.addChild( quantitiesNode );

    //------------------------------------------------------------------------------------
    // Optional 'Hide molecules' box on top of Before or After box
    //------------------------------------------------------------------------------------

    let hideMoleculesBox: HideBox | null = null;
    if ( !challenge.moleculesVisible ) {
      hideMoleculesBox = new HideBox( {
        boxSize: options.boxSize,
        iconHeight: 0.4 * options.boxSize.height,
        cornerRadius: 3,
        left: ( interactiveBox === BoxType.BEFORE ) ? afterBox.left : beforeBox.left,
        bottom: beforeBox.bottom
      } );
      this.addChild( hideMoleculesBox );
    }

    //------------------------------------------------------------------------------------
    // Observers
    //------------------------------------------------------------------------------------

    // Move from "Try Again" to "Check" state when a quantity is changed, see reactants-products-and-leftovers#37.
    // Must be disposed.
    const answerChangedLink = Multilink.lazyMultilinkAny( quantityProperties, () => {
      const playStateProperty = this.playStateProperty!;
      assert && assert( playStateProperty, 'playStateProperty should have been set by now.' );
      if ( playStateProperty.value === PlayState.TRY_AGAIN ) {
        playStateProperty.value = PlayState.SECOND_CHECK;
      }
    } );

    // handle PlayState changes
    const playStateObserver = ( playState: PlayState ) => {

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
        faceNode.centerX = ( interactiveBox === BoxType.BEFORE ) ? beforeBox.centerX : afterBox.centerX;
        faceNode.centerY = questionMark.centerY = beforeBox.top + ( buttons.top - beforeBox.top ) / 2;
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
          afterBox.visible = !hideBoxVisible;
        }
        else {
          beforeBox.visible = !hideBoxVisible;
        }
      }
      quantitiesNode.setHideNumbersBoxVisible( hideBoxVisible );

      // switch between spinners and static numbers
      quantitiesNode.setInteractive( _.includes( [ PlayState.FIRST_CHECK, PlayState.SECOND_CHECK, PlayState.TRY_AGAIN ], playState ) );
    };

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

    this.disposeChallengeNode = () => {

      if ( this.playStateProperty ) {
        this.playStateProperty.unlink( playStateObserver );
      }

      // buttons
      buttons.dispose();
      this.checkButtonEnabledProperty.unlinkAll();
      this.checkButtonEnabledProperty.dispose();
      answerChangedLink.dispose();

      // boxes
      beforeBox.dispose();
      afterBox.dispose();
      questionMark.dispose();

      // stuff below the boxes
      quantitiesNode.dispose();
    };

    this.playStateProperty = null; // will be set by activate()
    this.playStateObserver = playStateObserver;
    this.buttons = buttons;
  }

  /**
   * Connects this node to the model. Until this is called, the node is preloaded, but not fully functional.
   */
  public activate( playStateProperty: EnumerationProperty<PlayState> ): void {
    this.buttons.activate( playStateProperty );
    this.playStateProperty = playStateProperty;
    // optimization: we're set up in the correct initial state, so wait for state change
    this.playStateProperty.lazyLink( this.playStateObserver ); // must be unlinked in dispose
  }

  public override dispose(): void {
    this.disposeChallengeNode();
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'ChallengeNode', ChallengeNode );