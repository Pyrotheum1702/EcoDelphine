
const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyCtrl extends cc.Component {
   static ins: LobbyCtrl = null

   protected onLoad(): void {
      LobbyCtrl.ins = this
      cc.director.preloadScene('2.Game')
   }

   protected onDestroy(): void { LobbyCtrl.ins = null }

   async login() {

   }

   openSceneGame() {
      cc.director.loadScene('2.Game')
   }
}
