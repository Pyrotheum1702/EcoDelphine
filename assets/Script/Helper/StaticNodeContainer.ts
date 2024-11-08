const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticNodeContainer extends cc.Component {
   static ins: StaticNodeContainer = null

   protected onLoad(): void {
      if (StaticNodeContainer.ins != null) { this.node.destroy(); return }
      cc.game.addPersistRootNode(this.node)
      StaticNodeContainer.ins = this
   }

   protected onDestroy(): void { StaticNodeContainer.ins = null }
}
