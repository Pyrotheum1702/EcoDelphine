const { ccclass, property } = cc._decorator;

@ccclass
export default class Dolphin extends cc.Component {
   static ins: Dolphin = null
   // =====
   boosting
   headMovingDirection
   angleChangeSpeed
   currentHeadAngle
   traverseSpeed
   // =====

   protected onLoad(): void {
      Dolphin.ins = this
      cc.director.preloadScene('1.Lobby')
   }

   moveForward(dt) {

   }

   protected onDestroy(): void { Dolphin.ins = null }
}
