const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCtrl extends cc.Component {
   static ins: GameCtrl = null

   protected onLoad(): void {
      GameCtrl.ins = this
      cc.director.preloadScene('1.Lobby')
   }

   protected onDestroy(): void { GameCtrl.ins = null }

   async login() {

   }

   openSceneLobby() {
      cc.director.loadScene('1.Lobby')
   }
}
