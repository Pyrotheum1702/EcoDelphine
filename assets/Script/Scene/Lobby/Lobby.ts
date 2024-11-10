import { GlobalVar } from "../../Helper/GlobalVar";
import { callLoadingDialog } from "../../Helper/Loading/LoadingDialog";
import SoundPlayer from "../../Helper/SoundPlayer";
import Utils from "../../Helper/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyCtrl extends cc.Component {
   static ins: LobbyCtrl = null
   @property(cc.Label) balanceLb: cc.Label = null
   @property(cc.Label) trashCollectedLb: cc.Label = null

   protected onLoad(): void {
      LobbyCtrl.ins = this
      cc.director.preloadScene('2.Game')
      SoundPlayer.ins.play("Lobby")

      Utils.tweenLb(this.balanceLb, 0, GlobalVar.profile.token, 0.777, 'sineIn')
      Utils.tweenLb(this.trashCollectedLb, 0, GlobalVar.profile.score, 0.777, 'sineIn', null, '', '', Utils.formatNumberWithCommas)
   }

   protected onDestroy(): void { LobbyCtrl.ins = null }

   openSceneGame() {
      let loading = callLoadingDialog(60)
      SoundPlayer.ins.play("Btn")
      cc.director.loadScene('2.Game')
   }
}
