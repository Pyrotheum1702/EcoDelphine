import GameCtrl from "../Game";
import SpawnObject, { SpawnObjectType } from "../SpawnObject";
import Trash from "../Trash";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dolphin extends cc.Component {
   static ins: Dolphin = null
   @property angleChangeSpeed: number = 0
   @property speedUpMultiplier: number = 1.5
   @property startTraverseSpeed: number = 0
   @property clampTraverseSpeed: number = 0
   @property traverseSpeedIncreaseOverTime: number = 0
   @property(sp.Skeleton) skeleton: sp.Skeleton = null
   // =====
   alive = true
   boosting = false
   headAngle: number
   traverseSpeed: number = 0
   currentHeadAngle: number = 0
   headMovingDirection: cc.Vec2 = cc.v2(Math.random(), Math.random())
   // =====
   xClamp = 600
   yClamp = 325
   // ===
   animationName = ""

   protected onLoad(): void {
      Dolphin.ins = this
      cc.director.preloadScene('1.Lobby')
   }

   moveForward(dt) {
      if (!this.alive || GameCtrl.ins.isGameOver) return
      let speed = this.traverseSpeed
      if (this.boosting) speed *= this.speedUpMultiplier
      const headDir = cc.v2(this.headMovingDirection)
      let newPos = cc.v2(this.node.position).add(headDir.multiplyScalar(speed * dt))
      this.node.setPosition(newPos)
      this.node.angle = this.headAngle
      // console.log(this.node.angle);
      this.node.scaleY = (Math.abs(this.node.angle) >= 90) ? -1 : 1

      // console.log(this.node.x.toFixed(2), this.node.y.toFixed(2));
      if (this.node.x > this.xClamp) this.node.x = this.xClamp
      if (this.node.x < -this.xClamp) this.node.x = -this.xClamp
      if (this.node.y > this.yClamp) this.node.y = this.yClamp
      if (this.node.y < -this.yClamp) this.node.y = -this.yClamp
   }

   protected update(dt: number): void {
      if (this.alive) {
         // console.log('this.traverseSpeed', this.traverseSpeed);

         if (this.traverseSpeed > 0) {
            if (this.animationName !== "Swim") {
               this.animationName = "Swim";
               this.skeleton.setAnimation(0, "Swim", true);  // Set on track 0
            }
         } else {
            if (this.animationName !== "Idle") {
               this.animationName = "Idle";
               this.skeleton.setAnimation(0, "Idle", true);  // Set on track 0
            }
         }
      }
   }

   protected onDestroy(): void { Dolphin.ins = null }


   onCollisionEnter(other: cc.Collider, self: cc.Collider) {
      if (!this.alive) return
      console.log("Collision detected!");

      let spawnObject = other.getComponent(SpawnObject)
      switch (spawnObject.objectType) {
         case SpawnObjectType.TRASH: {
            other.getComponent(Trash).collect()
            break;
         }
         case SpawnObjectType.SHARK: {
            let s = spawnObject.getComponent(sp.Skeleton)
            s.setAnimation(0, "Attack", false)
            s.addAnimation(0, "animation", true)
            this.onDeath()
            break;
         }
         default: return;
      }
   }

   onDeath() {
      if (!this.alive) return

      this.alive = false
      this.skeleton.setAnimation(0, "Dile", false)
      cc.tween(this.skeleton.node).to(0.8, { color: new cc.Color().fromHEX("#FF8A8A") }).start()
      cc.tween(this.node).delay(0.8).to(0.66, { opacity: 0 }, { easing: "sineIn" }).call(() => {
         GameCtrl.ins.onGameOver()
      }).start()
   }
}
