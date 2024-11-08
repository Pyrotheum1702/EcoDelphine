import { EVT, RANKING } from "../Config/Config";
import EloHelper from "../Helper/EloHelper";
import { GlobalVar } from "../Helper/GlobalVar";
import SoundPlayer from "../Helper/SoundPlayer";
import Utils from "../Helper/Utils";
import Card from "./Card";
import GameView from "./GameView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerView extends cc.Component {
   @property(cc.Sprite) avatar: cc.Sprite = null;
   @property(cc.Label) lbName: cc.Label = null;
   @property(cc.Label) lbCoin: cc.Label = null;
   @property(cc.Label) lbBetValue: cc.Label = null;
   @property(cc.Node) iconHost: cc.Node = null;
   // @property(Card) lsCards: Card[] = [];
   @property(cc.Node) iconReady: cc.Node = null;
   @property(cc.Sprite) spTimer: cc.Sprite = null;
   @property(cc.Label) lbFinishGame: cc.Label = null;
   @property(cc.Node) nodeBet: cc.Node = null;

   @property(cc.Node) nodeInfo: cc.Node = null;
   @property(cc.Node) icCoin: cc.Node = null;
   @property(cc.Node) nodeCard: cc.Node = null;
   @property(cc.Sprite) avatarSpr: cc.Sprite = null;
   @property(cc.Sprite) spStatus: cc.Sprite = null;
   @property([cc.Sprite]) spRanks: cc.Sprite[] = [];
   @property(cc.Prefab) cardPref: cc.Prefab = null;
   @property(cc.SpriteFrame) lsSprStatus: cc.SpriteFrame[] = [];
   @property(cc.Sprite) borderAvatar: cc.Sprite = null;
   @property(cc.SpriteFrame) lsBorderAva: cc.SpriteFrame[] = [];
   @property(cc.SpriteFrame) lsBgInfo: cc.SpriteFrame[] = [];
   @property(cc.SpriteFrame) lsAvatar: cc.SpriteFrame[] = [];
   @property(cc.SpriteFrame) lsRankFrame: cc.SpriteFrame[] = [];


   isHost = false;
   isTurn = false;
   timeTurn = 0;
   currentTime = 0;
   uid = '';
   listCards = [];
   idPos = 0;
   positionCards = [cc.v3(-30, 0, 0), cc.v3(30, 0, 0)];
   currentBet = 0;
   lsStatus = ['BET', 'CALL', 'CHECK', 'RAISE', 'FOLD', 'SMALL', 'BIG', 'ALL_IN'];
   nameColors = ['#EDCA54', '#C788FF', '#C0CFD9', '#CB7C63', '#77D3DD']

   turnColor = ['#0DFF03', '#FF0000']

   onLoad() {
      this.iconHost.active = false;
      this.listCards = [];
      for (let i = 0; i < 2; i++) {
         let card = cc.instantiate(this.cardPref).getComponent(Card);
         card.setInfo(0);
         card.node.x = -30 + (i * 60);
         card.node.y = this.uid == GlobalVar.profile.uuid ? 40 : 0;
         card.node.angle = 5 - (i * 10);
         card.node.active = false;
         this.nodeCard.addChild(card.node);
         this.listCards.push(card);
      }
      this.icCoin.active = false
   }

   setInfo(data, idPos) {
      SoundPlayer.ins.play('player_join')
      console.log('data player', data)
      Utils.loadImgFromUrl(this.avatar, data.avatar);
      const playerRank = EloHelper.inst.getEloRank(GlobalVar.profile.ELO);
      this.lbName.string = data.name;
      this.lbName.node.color = cc.Color.BLACK.fromHEX(this.nameColors[idPos]);
      this.lbCoin.string = data.point.toLocaleString();
      this.isHost = data.isKey;
      this.iconHost.active = false;
      this.uid = data.uuid;
      this.spTimer.node.active = false;
      this.iconReady.color = cc.Color.GRAY;
      this.spStatus.node.active = false;
      this.nodeBet.active = false;
      this.lbFinishGame.node.active = false;
      this.idPos = idPos;

      this.node.scale = 1;
      if (this.uid != GlobalVar.profile.uuid) {
         this.node.scale = 0.6;
         if (this.idPos < 3 && this.idPos > 0) {
            this.nodeInfo.x = 85;
            this.nodeCard.x = 290; this.nodeCard.y = -165;
            this.spStatus.node.x = 300; this.spStatus.node.y = 40;
            this.spRanks.forEach(node => { node.node.x = -135; })
         }
         else {
            this.nodeInfo.x = -85;
            this.nodeCard.x = -290; this.nodeCard.y = -165;
            this.spStatus.node.x = -300; this.spStatus.node.y = 40;
            this.spRanks.forEach(node => { node.node.x = 135; })
         }
         // random rank 
         const maxRank = playerRank === RANKING.IMMORTAL ? playerRank : (playerRank === RANKING.MYTHIC ? playerRank + 1 : playerRank + 2);
         this.spRanks.forEach(node => { node.spriteFrame = this.lsRankFrame[Utils.randomRange(playerRank, maxRank, true)] })
      } else {
         // use full name insead username
         this.lbName.string = GlobalVar.profile.fullName;
         Utils.loadImgFromUrl(this.avatar, GlobalVar.profile.avatarUrl);
         this.spRanks.forEach(node => { node.spriteFrame = this.lsRankFrame[playerRank] })
      }

      this.nodeInfo.getComponent(cc.Sprite).spriteFrame = this.lsBgInfo[idPos];
      this.borderAvatar.spriteFrame = this.lsBorderAva[idPos];
      this.avatarSpr.spriteFrame = this.lsAvatar[idPos]

      this.updateBetValue(0, data.point);
   }

   resetBetValue() {
      this.lbBetValue.string = '0';
      this.currentBet = 0;
      this.nodeBet.active = false
   }
   updateMoney(money) {
      this.lbCoin.string = money.toLocaleString();
   }
   updateBetValue(bet, coin) {
      // console.log('on player bet', bet);
      if (bet != null) {
         this.currentBet = bet;
         this.lbBetValue.string = bet.toLocaleString();
         this.lbCoin.string = coin.toLocaleString() + '';

         this.nodeBet.active = bet > 0;
      }
   }

   dealCard(data) {
      let cards = [];
      this.iconReady.active = false;
      for (let i = 0; i < this.listCards.length; i++) {
         let card = this.listCards[i].getComponent(Card);
         card.node.active = true;
         card.node.opacity = 255;
         card.node.scale = 0.1;
         card.node.y = 1060;
         card.setInfo(0);
         cards.push(card);

         let myCard = this.uid == GlobalVar.profile.uuid;
         let scaleRate = 1;
         myCard && SoundPlayer.ins.play('deal_card');
         cc.tween(card.node).delay(i * .05).to(.2, { x: -30 + (i * 60), y: this.uid == GlobalVar.profile.uuid ? 40 : 0, scale: scaleRate }).call(() => {
            if (myCard) {
               setTimeout(() => {
                  i === 0 && SoundPlayer.ins.play('player_card_flip');
                  card.setInfo(data[i], true);
               }, 300)
            }
         }).start();
      }
      // this.nodeBet.active = true;
      return cards;
   }

   showCardFinish(data) {
      let cards = []
      for (let i = 0; i < this.listCards.length; i++) {
         let card = this.listCards[i].getComponent(Card);
         card.setInfo(data[i])
         card.flip(data[i]);
         cards.push(card);
      }
      return cards;
   }

   showMoneyEffect(coin) {
      SoundPlayer.ins.play('coin_collect')
      console.log('on show money effect', coin);
      this.lbFinishGame.string = `+ ${coin.toLocaleString()}`;
      this.lbFinishGame.node.y = -150;
      this.lbFinishGame.node.active = true;
      cc.tween(this.lbFinishGame.node).to(1.25, { y: 150 }).call(() => {
         this.lbFinishGame.node.active = false;
      }).start();
   }

   setReady(state) {
      let isReady = state == 'READY';
      if (!this.isHost) this.iconReady.active = isReady;
      else this.iconReady.active = false;
      this.iconReady.color = isReady ? cc.Color.GREEN : cc.Color.GRAY;
   }

   setTurn(timeTurn) {
      this.isTurn = true;
      this.timeTurn = timeTurn - 0.5;
      this.currentTime = 0;
      this.spTimer.node.active = true;
      this.spTimer.node.color = cc.Color.BLACK.fromHEX(this.turnColor[0]);
      this.isWarning = false;
      SoundPlayer.ins.play('turn_start');
   }

   hideStatus() {
      this.spStatus.node.active = false;
   }

   showStatus(status) {
      SoundPlayer.ins.stopSound('warning')
      switch (status) {
         case EVT.ACTION.BET:
            SoundPlayer.ins.play('bet');
            break;
         case EVT.ACTION.CHECK:
            SoundPlayer.ins.play('check');
            break;
         case EVT.ACTION.CALL:
            SoundPlayer.ins.play('call');
            break;
         case EVT.ACTION.RAISE:
            SoundPlayer.ins.play('raise');
            break;
         case EVT.ACTION.FOLD:
            SoundPlayer.ins.play('fold');
            break;
         case EVT.ACTION.ALL_IN:
            SoundPlayer.ins.play('all_in');
            break;
         case EVT.PLAYER_TYPE.DEALER:
            this.iconHost.active = true;
            break;
         case EVT.PLAYER_TYPE.BIG_BLIND:
         case EVT.PLAYER_TYPE.SMALL_BLIND:
            this.nodeBet.active = true;
            break;
      }

      let id = this.lsStatus.indexOf(status);
      this.spStatus.node.active = true;
      this.spStatus.spriteFrame = this.lsSprStatus[id];

      if (status === EVT.ACTION.FOLD) {
         this.node.opacity = 100;
      }
      
   }

   updateRank(ELO: number) {
      const playerRank = EloHelper.inst.getEloRank(ELO);
      this.spRanks.forEach(node => { node.spriteFrame = this.lsRankFrame[playerRank] })
   }

   setActions(data) {
      switch (data.type) {
         case EVT.ACTION.BLIND_BET:
            this.updateBetValue(data.playerBet.roundBet, data.playerBet.point);
            break;
         case EVT.ACTION.BET:
            this.updateBetValue(data.playerBet.roundBet, data.playerBet.point);
            break;
         case EVT.ACTION.CALL:
            this.updateBetValue(data.playerBet.roundBet, data.playerBet.point);
            break;
         case EVT.ACTION.RAISE:
            this.updateBetValue(data.playerBet.roundBet, data.playerBet.point);
            break;
         case EVT.ACTION.ALL_IN:
            this.updateBetValue(data.playerBet.roundBet, data.playerBet.point);
            break;
         case EVT.ACTION.SMALL:
            this.updateBetValue(data.playerBet.roundBet, data.playerBet.point);
            break;

         default:
            break;
      }

      this.showStatus(data.type);
      this.isTurn = false;
   }

   isWarning = false;

   update(dt) {
      if (!this.isTurn) {
         this.spTimer.node.active = false;
         this.isTurn = false;
         return;
      }


      this.currentTime += dt;
      let percent = 1 - (this.currentTime / this.timeTurn);
      if (this.currentTime + 0.2 >= this.timeTurn) {
         // if (percent <= 0) {
         this.spTimer.node.active = false;
         this.spTimer.node.color = cc.Color.BLACK.fromHEX(this.turnColor[0]);
         this.isTurn = false;
         this.isWarning = false;
         SoundPlayer.ins.stopSound('warning')
         GameView.instance.onTurnTimeOut();
      } else {
         this.spTimer.fillRange = percent;
         if (percent < 0.5 && !this.isWarning) {
            SoundPlayer.ins.play('warning', true)
            this.isWarning = true;
            this.spTimer.node.color = cc.Color.BLACK.fromHEX(this.turnColor[1]);
         }
      }
   }
}
