import GameCtrl from "./Game";
import SpawnObject from "./SpawnObject";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Trash extends SpawnObject {
   protected onLoad(): void {
      let col = this.getComponent(cc.BoxCollider)
      col.size = cc.size(this.node.width, this.node.height)
   }

   collected = false
   collect() {
      if (this.collected) return
      this.collected = true

      cc.tween(this.node).to(0.33, { opacity: 0, scale: this.node.scale * 0.3 }, { easing: "sineIn" }).call(() => {
         GameCtrl.ins.addPoint(1)
         this.node.destroy()
      }).start()
   }
}
