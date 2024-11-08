import { callLoadingDialog } from "../../Helpers/Loading/LoadingDialog";
import RankChange from "../../Views/GlobalPopup/RankChange/RankChange";
import { API_OPERATION, EVT, POKER_STATUS } from "../Config/Config";
import EloHelper from "../Helper/EloHelper";
import { GlobalVar } from "../Helper/GlobalVar";
import SoundPlayer from "../Helper/SoundPlayer";
import Utils from "../Helper/Utils";
import GlobalModal from "../Modals/GlobalModal";
import NetworkManager from "../Server/NetworkManager";
import ServerClient from "../Server/ServerClient";
import BuyBtn from "../UIElements/BuyBtn/BuyBtn";
import ObjectiveBtn from "../UIElements/ObjectiveBtn/ObjectiveBtn";
import UIElementController from "../UIElements/UIElementController";
import Card from "./Card";
import PlayerView from "./PlayerView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends cc.Component {
   static instance: GameView = null;

   @property(sp.Skeleton) dealerSkeleton: sp.Skeleton = null;
   @property(cc.Node) btnStart: cc.Node = null;
   @property(cc.Node) btnReady: cc.Node = null;
   // @property(cc.Node) btnLeaveTable: cc.Node = null;
   @property(cc.Node) betSlider: cc.Node = null;
   @property(cc.Label) valuePot: cc.Label = null;
   @property(cc.Label) slideValue: cc.Label = null;
   @property(cc.Node) btnSlider: cc.Node = null;

   @property(cc.Prefab) prfPlayer: cc.Prefab = null;
   @property(cc.Prefab) prfCard: cc.Prefab = null;
   @property(cc.Node) table: cc.Node = null;
   @property(cc.Node) nodeCardTable: cc.Node = null;
   @property(cc.Node) nodePlayer: cc.Node = null;
   @property(cc.Node) highlight: cc.Node = null;
   @property(cc.Node) lsButtonActions: cc.Node[] = [];

   @property(cc.Sprite) slider: cc.Sprite = null;
   @property(cc.Sprite) sliderBar: cc.Sprite = null;

   @property(cc.SpriteFrame) sliFrame: cc.SpriteFrame[] = [];
   @property(cc.SpriteFrame) sliBarFrame: cc.SpriteFrame[] = [];

   @property(cc.Label) pingValue: cc.Label = null;
   @property(cc.Sprite) betRaiseSpr: cc.Sprite = null;
   @property(cc.SpriteFrame) betRaiseFrames: cc.SpriteFrame[] = [];

   @property(cc.Label) winTypeLbl: cc.Label = null;
   @property(cc.Prefab) rankChange: cc.Prefab = null;

   objectiveBtn: ObjectiveBtn = null
   buyBtn: BuyBtn = null
   potNode: cc.Node = null

   allCard: Card[] = []


   players = [];
   cardTables = [];
   betValues = 0;
   minRaise = 0;
   raiseValues = 0;
   listPositions = [cc.v3(0, -600, 0), cc.v3(-404, -225, 0), cc.v3(-404, 365, 0), cc.v3(404, 365, 0), cc.v3(404, -225, 0)];
   countReady = 1;
   minePlayer = null;
   round = 1;
   startPingTime: number;
   protected onDestroy(): void {
      GameView.instance = null;
   }
   onLoad() {
      GameView.instance = this;
      ServerClient.ins.connect();
      this.resetGame();

      this.btnSlider.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
      this.btnSlider.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
      this.btnSlider.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
      this.btnSlider.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

      this.highlight.active = false;
      this.potNode = this.valuePot.node.parent
   }

   sendPing() {
      this.startPingTime = Date.now();
      ServerClient.ins.sendPing();
   }

   latencyTime = []

   onPong() {
      setTimeout(() => {
         this.sendPing()
      }, 500)
      const time = Date.now() - this.startPingTime;
      if (this.latencyTime.length === 10) {
         this.latencyTime.shift();
      }
      this.latencyTime.push(time);
      const totalLatency = this.latencyTime.reduce((acc, curr) => acc + curr, 0);
      const averagePing = this.latencyTime.length > 0 ? totalLatency / this.latencyTime.length : -1;
      this.pingValue.string = Math.floor(averagePing).toString() + 'ms';
   }

   protected start(): void {
      this.objectiveBtn = UIElementController.ins.ObjectiveBtn
      this.buyBtn = UIElementController.ins.BuyBtn
      const purchaseModal = GlobalModal.ins.PurchaseModal
      const objectiveModal = GlobalModal.ins.ObjectiveModal

      this.objectiveBtn.show()
      this.buyBtn.show()

   }

   resetGame() {
      this.highlight.active = false;
      for (let el of this.cardTables) el.node.removeFromParent();
      for (let pl of this.players) {
         for (let c of pl.listCards) c.node.active = false;
         pl.getComponent(PlayerView).resetBetValue();
         pl.node.opacity = 255;
      }
      this.cardTables = [];
      this.allCard = []
      this.btnReady.active = false;
      this.btnStart.active = false;
      this.countReady = 1;

      for (let el of this.lsButtonActions) el.active = false;
      this.valuePot.string = '0';
   }

   onPlayerJTable(data) {
      GlobalVar.profile.uuid = data.data.uuid;
      GlobalVar.profile.point = data.data.point;
      console.log('profile:', GlobalVar.profile);
   }

   onTurnTimeOut() {
      const action = this.betValues === 0 ? 'check' : 'fold';
      this.onClick(null, action)
   }

   onPlayerSTable(data) {
      this.resetGame();
      for (let el of this.players) el.node.removeFromParent();
      this.players = [];
      for (let el of data.data) {
         this.onPlayerJoinTable({ players: data.data, playerJoin: el });
      }
   }

   onPlayerJoinTable(data) {
      console.log('onPlayerJoinTable', data);

      this.btnStart.active = false;

      let thisIndex = data.players.findIndex(p => p.uuid == GlobalVar.profile.uuid) || 0;
      let indexPlayerJoin = data.players.findIndex(p => p.uuid == data.playerJoin.uuid);
      let indexPosition = indexPlayerJoin - thisIndex;
      if (indexPosition < 0) indexPosition = data.players.length - thisIndex + indexPlayerJoin;
      // console.log('indexPosition', indexPosition);

      let pl = cc.instantiate(this.prfPlayer).getComponent(PlayerView);
      pl.setInfo(data.playerJoin, indexPosition);
      pl.uid = data.playerJoin.uuid;
      this.table.addChild(pl.node);
      this.players.push(pl);
      if (data.playerJoin.index == 0) pl.setReady(true);
      if (data.playerJoin.uuid == GlobalVar.profile.uuid) {
         this.minePlayer = pl;
         if (data.playerJoin.state != 'READY' && !data.playerJoin.isKey) {
            NetworkManager.sendReady();
         }
      }

      pl.node.position = this.listPositions[indexPosition];
   }

   onPlayerReady(data) {
      // console.log('data ready', data, this.players);
      let pl = this.players.find(p => p.uid == data.uuid);
      if (pl) {
         pl.getComponent(PlayerView).setReady(data.state);

         if (data.state == 'READY') {
            this.countReady++;
            if (this.minePlayer.isHost && this.countReady == this.players.length) {
               // game will start after 1s when all player ready
               setTimeout(() => {
                  this.onClick(null, 'start')
               }, 1000)
               // this.btnStart.active = true;
            }
            else this.btnReady.active = false;
         }
      }
   }

   dealCards(data) {
      this.round = 1;
      this.btnStart.active = false;
      // this.valuePot.string = data.pot.toLocaleString();
      for (let pl of this.players) {
         const cards = pl.getComponent(PlayerView).dealCard(data.data);
         if (pl.uid === GlobalVar.profile.uuid) {
            this.allCard.push(...cards);
         }
      }

   }

   preStart(data) {
      // this.valuePot.string = data.pot.toLocaleString();

      for (let pl of this.players) {
         const comp = pl.getComponent(PlayerView);
         if (pl.uid == data.dealer) comp.showStatus(EVT.PLAYER_TYPE.DEALER);

         const bigBlind = data.bigBlind;
         if (pl.uid == bigBlind.uuid) {
            comp.showStatus(EVT.PLAYER_TYPE.BIG_BLIND);
            comp.updateBetValue(bigBlind.bet, bigBlind.point)
         }

         const smallBlind = data.smallBlind;
         if (pl.uid == smallBlind.uuid) {
            comp.showStatus(EVT.PLAYER_TYPE.SMALL_BLIND);
            comp.updateBetValue(smallBlind.bet, smallBlind.point)
         }
      }
   }

   updateOnFinishRound(pot) {
      const wPotNode = Utils.getWorldPos(this.potNode);
      for (let el of this.players) {

         let player = el;

         if (!player.node.getChildByName('totalPotBet')) {
            const totalBet = new cc.Node('totalPotBet');
            player.node.addChild(totalBet)
         }

         const totalBetNode = player.node.getChildByName('totalPotBet')
         Utils.setWorldPos(totalBetNode, wPotNode);
         const oldPlayerPot = player.icCoin.position;

         player.icCoin.active = player.nodeBet.active;
         player.nodeBet.active = false;
         cc.tween(player.icCoin)
            .to(0.75, { position: totalBetNode.position }, { easing: 'sineIn' }).call(() => {
               // .to(0.75, {position: totalBetNode.position},{ easing: 'cubicIn' }).call( () => {
               player.icCoin.position = oldPlayerPot;
               player.icCoin.active = false
               player.resetBetValue();

               let start = parseInt(Utils.removeComma(this.valuePot.string))
               if (Number.isNaN(start)) start = 0
               if (pot == null) pot = 0
               if (start != pot) Utils.tweenLb(this.valuePot, start, pot, 0.33, 'sineIn', null, '', '', Utils.formatNumberWithCommas)
            })
            .start()
      }
   }

   dealCardsRound(data, pot) {
      this.round++;
      this.updateOnFinishRound(pot)

      this.dealerSkeleton.setAnimation(4, "reveal-card", false);
      // Set up a listener to detect when the animation completes
      this.dealerSkeleton.setCompleteListener((trackEntry) => {
         if (trackEntry.animation.name === 'reveal-card') this.dealerSkeleton.setAnimation(1, "idle", true);
      });

      for (let i = 0; i < data.length; i++) {
         let card = cc.instantiate(this.prfCard).getComponent(Card);
         card.node.scale = 0.1;
         card.node.y = 1060;// this.node.height / 2 + 100;
         card.setInfo(data[i]);
         this.nodeCardTable.addChild(card.node);
         this.cardTables.push(card);
         this.allCard.push(card);
         i === 0 && SoundPlayer.ins.play('deal_card')
         cc.tween(card.node).delay(0.75 + i * .05).to(.2, { x: (2 - this.cardTables.length) * 100, y: -105 }).call(() => {
            i === 0 && SoundPlayer.ins.play('player_card_flip')
            card.flip(data[i]);
         }).start();
      }

      for (let el of this.players) {
         if (this.round >= 1 && el.status != EVT.ACTION.FOLD && el.status != EVT.ACTION.ALL_IN) {
            el.hideStatus();
         }
      };
   }

   startTurn(data) {
      let player = this.players.find(p => p.uid === data.data.uuid);
      if (player) {
         if (data.data.uuid == GlobalVar.profile.uuid) {
            this.betValues = data.bet;
            this.minRaise = data.minRaise;
         }
         player.setTurn(data.data.timeTurn);
         if (player.uid == GlobalVar.profile.uuid) {
            for (let el of this.lsButtonActions) el.active = true;
            if (this.betValues > 0) {
               this.lsButtonActions[2].active = true;
               this.betRaiseSpr.spriteFrame = this.betRaiseFrames[1]
            } else {
               this.lsButtonActions[2].active = false;
               this.betRaiseSpr.spriteFrame = this.betRaiseFrames[0]
            }
            if (this.minRaise * 2 > GlobalVar.profile.point) {
               this.betRaiseSpr.node.parent.getComponent(cc.Button).interactable = false;
            } else {
               this.betRaiseSpr.node.parent.getComponent(cc.Button).interactable = true;
            }


            this.lsButtonActions[4].active = !this.lsButtonActions[2].active;
         }
         else {
            for (let el of this.lsButtonActions) el.active = false;
         }
      }
   }

   onPlayerActions(data) {
      let player = this.players.find(p => p.uid == data.playerBet.uuid);
      if (player) {
         player.status = data.type;
         player.getComponent(PlayerView).setActions(data);
         if (player.uid == GlobalVar.profile.uuid) GlobalVar.profile.point = data.playerBet.point;
      }
      // this.valuePot.string = data.pot.toLocaleString();
   }

   finishGame(data) {
      let isChangRank = false;
      let isUp = false;
      const ELOs = data.ELO || [];
      const getELO = (uuid) => {
         const player = ELOs.find(p => p.uuid === uuid);
         return player ? player.ELO : null;
      }

      for (let el of data.data) {
         let pl = this.players.find(p => p.uid === el.uuid).getComponent(PlayerView);
         if (pl) {
            pl.showStatus('NONE');
            if (el.uuid != GlobalVar.profile.uuid) {
               SoundPlayer.ins.play('player_card_flip')
               if (el.status !== POKER_STATUS.FOLD) {
                  const cards = pl.showCardFinish(el.cards);
                  this.allCard.push(...cards)
               }
               // update rank 
               if (!el.isBot) {
                  const ELO = getELO(el.uuid);
                  pl.updateRank(ELO);
               }
            } else {
               const curRank = EloHelper.inst.getEloRank(GlobalVar.profile.ELO);
               const ELO = getELO(el.uuid);
               GlobalVar.profile.ELO = ELO
               const newRank = EloHelper.inst.getEloRank(ELO);
               isChangRank = curRank !== newRank;
               isUp = newRank > curRank
               GlobalVar.profile.point = el.point
            }
            pl.updateMoney(el.point);

         }
      }

      const winArr = data.winData;
      const winLenght = winArr.length;

      const finishCB = () => {
         if (isChangRank) {
            const changeNode = cc.instantiate(this.rankChange);
            changeNode.parent = this.node
            const comp = changeNode.getComponent(RankChange);
            const reward = EloHelper.inst.getRewardsFromElo(GlobalVar.profile.ELO);
            changeNode.opacity = 0;
            changeNode.setPosition(0, 0);
            comp.show(reward, isUp);
         } else {
            this.resetGame();
         }
         console.log('@@@ finish CB  RESET GAME')

         const isPlayerOutOfCoint = GlobalVar.profile.point < GlobalVar.tableSelected.bigBlind;
         if (isPlayerOutOfCoint) {
            console.log('user out chip')
            SoundPlayer.ins.stopSound('warning', true)
            Utils.callAPI({
               operation: API_OPERATION.FETCH_PROFILE,
               uuid: GlobalVar.profile.uuid,
            }, (res) => {
               console.log('FETCH_PROFILE ', res)
               GlobalVar.profile.ELO = res.profile.ELO;
               GlobalVar.profile.point = res.profile.point;
               GlobalVar.friendInvitedCount = res.refCount;;
               setTimeout(() => {
                  cc.director.loadScene('1.Lobby')
               }, isChangRank ? 3000 : 1000);
            }, () => {
            })
         }
      }

      // make all chip go POT
      this.updateOnFinishRound(data.pot)

      // show Win one by one
      const showWin = (idx => {
         this.highlight.active = true;
         this.highlight.opacity = 0;
         const winData = winArr[idx];

         let clPlayerWin: PlayerView = null;

         if (winData.winType === 'NONE') {
            if (idx + 1 < winLenght) {
               showWin(idx + 1);
            } else {
               finishCB && finishCB();
            }
            return
         }
         const gameWinCards = winData.cards;
         const winType = winData.winType || '';
         let winText = winType.split('_').slice(1).join(' ');
         winText = winText === 'PAIR' ? 'ONE PAIR' : winText
         this.winTypeLbl.string = winText;
         let winCardOnTable = [];
         for (let c of this.cardTables) {
            for (let win of gameWinCards) {
               if (c.code === win) {
                  winCardOnTable.push(c);
               }
            }
         }


         const preShow = () => {
            let playerWin = this.players.find(p => p.uid == winData.uuid);
            const tempParent = this.highlight.getChildByName('cards');
            tempParent.removeAllChildren();
            const winPlayerPos = Utils.getWorldPos(playerWin.node);

            const clPlayerWinNode = cc.instantiate(playerWin.node);
            clPlayerWinNode.parent = tempParent;
            Utils.setWorldPos(clPlayerWinNode, winPlayerPos)

            clPlayerWin = clPlayerWinNode.getComponent(PlayerView);

            for (let card of winCardOnTable) {
               const clone = cc.instantiate(card.node);
               const wPos = Utils.getWorldPos(card.node);
               clone.parent = tempParent;
               Utils.setWorldPos(clone, wPos)
            }

            let playerWinCardsNode = clPlayerWin.nodeCard.children;
            let wCards = winData.myCards;

            for (let i = 0; i < wCards.length; i++) {
               const card = playerWinCardsNode[i].getComponent(Card);
               card.setInfo(wCards[i]);
               card.highlight();
               if (gameWinCards.indexOf(card.code) === -1) {
                  card.unHighlight();
               }
            }
         }

         const delayTime = idx === 0 ? 1.25 : 0;
         cc.tween(this.highlight)
            .delay(delayTime).call(preShow)
            .to(1, { opacity: 255 }).call(() => {
               clPlayerWin.getComponent(PlayerView).showMoneyEffect(winData.potAmount);
            })
            .delay(1.75).call(() => {
               // this.highlight.active = false;
               if (idx + 1 < winLenght) {
                  showWin(idx + 1);
               } else {
                  finishCB && finishCB();
               }
            })
            .start();
      })

      showWin(0);

   }

   openSlider() {
      this.betSlider.active = true;
      this.btnSlider.x = -345;
      const isBetAction = this.betValues === 0;
      this.raiseValues = this.minRaise
      // this.raiseValues = isBetAction ? this.minRaise : this.minRaise * 2
      this.slideValue.string = (this.raiseValues + this.minePlayer.currentBet).toLocaleString();

      this.slider.spriteFrame = this.sliFrame[0];
      this.sliderBar.spriteFrame = this.sliBarFrame[0];
   }

   onClick(target, data) {
      SoundPlayer.ins.stopAllSFX();
      if (data == 'start') {
         NetworkManager.sendStartGame();
      }
      else if (data == 'ready') {
         NetworkManager.sendReady();
      }
      else if (data == 'bet') {
         NetworkManager.sendPlayerAction({
            evt: EVT.PLAYER_ACTION,
            type: EVT.ACTION.BET,
            bet: this.betValues
         });
      }
      else if (data == 'call') {
         NetworkManager.sendPlayerAction({
            evt: EVT.PLAYER_ACTION,
            type: EVT.ACTION.CALL,
            bet: this.betValues
         });
      }
      else if (data == 'check') {
         NetworkManager.sendPlayerAction({
            evt: EVT.PLAYER_ACTION,
            type: EVT.ACTION.CHECK,
            bet: this.betValues
         });
      }
      else if (data == 'fold') {
         NetworkManager.sendPlayerAction({
            evt: EVT.PLAYER_ACTION,
            type: EVT.ACTION.FOLD,
            bet: 0
         });
      }
      else if (data == 'all_in') {
         NetworkManager.sendPlayerAction({
            evt: EVT.PLAYER_ACTION,
            type: EVT.ACTION.ALL_IN,
            bet: GlobalVar.profile.point
         });
      }
      else if (data == 'raise') {
         NetworkManager.sendPlayerAction({
            evt: EVT.PLAYER_ACTION,
            type: EVT.ACTION.RAISE,
            bet: this.raiseValues
         });
      }
      else if (data == 'bid') {
         SoundPlayer.ins.play('snd_but1')
         this.openSlider();
      }
      else if (data == 'confirm-bid') {
         const isBet = this.betValues === 0;
         // if raised MAX, call All In instead
         const allIn = this.raiseValues === GlobalVar.profile.point
         const raiseBy = isBet ? 0 : this.raiseValues - this.betValues
         NetworkManager.sendPlayerAction({
            evt: EVT.PLAYER_ACTION,
            type: allIn ? EVT.ACTION.ALL_IN : (isBet ? EVT.ACTION.BET : EVT.ACTION.RAISE),
            bet: this.raiseValues,
            raiseBy: raiseBy
         });
      }
      else if (data == 'leave') {
         SoundPlayer.ins.play('snd_but1')
         NetworkManager.sendLeaveTable();
      }

      if (data === 'confirm-bid' || data === 'all-in' || data === 'bet' || data === 'call' || data === 'check' || data === 'fold') {
         for (let el of this.lsButtonActions) el.active = false;
      }

      // close Bid slider after any action except 'bid'
      if (data !== 'bid') {
         this.closeBetSlider();
      }
   }

   closeBetSlider() {
      if (this.betSlider.active) {
         this.betSlider.active = false;
      }
   }

   onTouchBegan(touch) {
      let location = cc.v2(touch.getLocation());
   }

   onTouchMove(touch) {
      this.btnSlider.x += touch.getDeltaX();
      if (this.btnSlider.x > 345) this.btnSlider.x = 345;
      if (this.btnSlider.x < -345) this.btnSlider.x = -345;

      const isMax = this.btnSlider.x === 345;
      this.slider.spriteFrame = isMax ? this.sliFrame[1] : this.sliFrame[0];
      if (isMax) {
         this.slideValue.string = 'All In'
      }
      this.sliderBar.spriteFrame = isMax ? this.sliBarFrame[1] : this.sliBarFrame[0];
   }

   onTouchEnd(touch) {
      this.checkBet();
   }

   onTouchCancel(touch) {
      this.checkBet();
   }

   checkBet() {
      let width = this.btnSlider.x + 345;
      const isBetAction = this.betValues === 0;
      const minRaise = this.minRaise
      // const minRaise = isBetAction ? this.minRaise : this.minRaise * 2
      const raiseTo = Math.floor((GlobalVar.profile.point - (minRaise + this.minePlayer.currentBet)) * (width / 690)) + (minRaise + this.minePlayer.currentBet);
      this.raiseValues = raiseTo - this.minePlayer.currentBet;
      const isMax = this.btnSlider.x === 345;
      if (isMax) {
         this.slideValue.string = 'All In'
      } else {
         this.slideValue.string = raiseTo.toLocaleString();
      }
      console.log('Touch console Raise values', this.raiseValues, GlobalVar.profile.point);
   }

   onClickLeave() {
      let loading = callLoadingDialog(100)
      ServerClient.ins.leaveRoom()
      Utils.callAPI({
         operation: API_OPERATION.FETCH_PROFILE,
         uuid: GlobalVar.profile.uuid,
      }, (res) => {
         console.log('FETCH_PROFILE ', res)
         GlobalVar.profile.ELO = res.profile.ELO;
         GlobalVar.profile.point = res.profile.point;
         GlobalVar.friendInvitedCount = res.refCount;
         SoundPlayer.ins.stopSound('warning', true)
         cc.director.loadScene('1.Lobby')
      }, () => {
      })
   }
}
