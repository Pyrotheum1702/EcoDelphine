import SoundPlayer from "../../Helper/SoundPlayer";
import Utils from "../../Helper/Utils";
import GameCtrl from "./Game";
import SpawnObject from "./SpawnObject";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Trash extends SpawnObject {
   protected onLoad(): void {
      let col = this.getComponent(cc.BoxCollider)
      col.size = cc.size(this.node.width, this.node.height)
   }

   timeLeft = 0
   targetFollow: cc.Node = null
   collected = false
   collect(target) {
      if (this.collected) return
      this.collected = true

      this.timeLeft = 0.66
      this.targetFollow = target
      cc.tween(this.node).to(0.66, { opacity: 0, scale: this.node.scale * 0.3 }, { easing: "sineIn" }).call(() => {
         SoundPlayer.ins.play("Eat")
         GameCtrl.ins.addPoint(1)
         this.node.destroy()
      }).start()
   }

   protected update(dt: number): void {
      super.update(dt)
      if (this.targetFollow) {
         this.timeLeft -= dt
         let targetPos = cc.v2(Utils.worldSpaceToLocal(Utils.getWorldPos(this.targetFollow), this.node.parent))
         let dir = cc.v2(targetPos).sub(cc.v2(this.node.position)).normalize()
         let delta = (0.66 - this.timeLeft) / 0.66
         let distance = cc.v2(cc.v2(targetPos).sub(cc.v2(this.node.position))).len()
         this.node.setPosition(cc.v2(this.node.position).add(dir.multiplyScalar(distance * 0.03)))
      }
   }
}
