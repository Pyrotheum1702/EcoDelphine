import { GlobalVar } from "../../../Helper/GlobalVar";
import Utils from "../../../Helper/Utils";
import GameCtrl from "../Game";
import Dolphin from "./Dolphin";
import InputController, { TOUCH_EVENT_TYPE } from "./InputController";


const { ccclass, property } = cc._decorator;

enum CONTROL_TYPE {
   JOYSTICK,
   HEAD_TO_POINTING
}
@ccclass
export default class DolphinController extends cc.Component {
   public static ins: DolphinController = null
   // @property angleRequireToSteer = 1
   public isMove = true
   private currentTouchNormal: cc.Vec2
   public dolphin: Dolphin = null
   private touchStartPos: cc.Vec2 = null


   public serverSyncDeltaTime = 0

   time = 1 / 30
   timeInterval = 1 / 30
   protected onLoad(): void { DolphinController.ins = this; this.dolphin = this.getComponent(Dolphin) }
   protected onDestroy(): void { DolphinController.ins = null }

   public onTouchEvent(touchType: TOUCH_EVENT_TYPE, touchLoc: cc.Vec2) {
      if (!this.dolphin) return

      switch (touchType) {
         case TOUCH_EVENT_TYPE.START:
            if (!this.touchStartPos) this.touchStartPos = touchLoc
            break
         case TOUCH_EVENT_TYPE.MOVE:
            this.currentTouchNormal = InputController.ins.direction
            break
         case TOUCH_EVENT_TYPE.END:
            this.touchStartPos = null
            this.currentTouchNormal = null
            break
      }
   }
   protected update(dt: number): void {
      if (!this.dolphin || !InputController.ins.isHoldingTouch) {
         if (!this.dolphin.alive) return

         this.dolphin.traverseSpeed = Math.max(0, this.dolphin.traverseSpeed - (this.dolphin.traverseSpeedIncreaseOverTime * 1.7 * dt))
         this.dolphin.moveForward(dt)
         return
      }

      let headDirNormal = cc.v2(this.dolphin.headMovingDirection)
      this.currentTouchNormal = InputController.ins.direction
      // console.log("headDirNormal", headDirNormal.toString());


      if (InputController.ins.isHoldingTouch && this.currentTouchNormal) {
         this.dolphin.traverseSpeed =
            Math.max(this.dolphin.startTraverseSpeed,
               Math.min(this.dolphin.traverseSpeed + this.dolphin.traverseSpeedIncreaseOverTime * dt * InputController.ins.length,
                  this.dolphin.clampTraverseSpeed))

         let cProduct = cc.v2(headDirNormal).cross(cc.v2(this.currentTouchNormal))
         // console.log(cProduct.toFixed(2));

         let c = (cProduct > 0) ? 1 : -1

         let rawAngleA = InputController.ins.angle
         let rawAngleB = Utils.vector2NormalToAngle(headDirNormal)
         let absAngleDiff = Math.abs(rawAngleA - rawAngleB)
         // console.log({
         //    rawAngleA: rawAngleA.toFixed(2),
         //    rawAngleB: rawAngleB.toFixed(2)
         // });

         // console.log('absAngleDiff <= this.dolphin.angleChangeSpeed * dt ', absAngleDiff <= this.dolphin.angleChangeSpeed * dt);

         if (absAngleDiff <= this.dolphin.angleChangeSpeed * dt || cProduct == 0) {
            // console.log('1');
            this.dolphin.headMovingDirection = this.currentTouchNormal
         } else {
            // console.log('this.dolphin.angleChangeSpeed * dt * c', this.dolphin.angleChangeSpeed * dt * c);
            const angleChange = this.dolphin.angleChangeSpeed * dt * c
            // console.log(angleChange.toFixed(2));

            this.dolphin.currentHeadAngle += angleChange
            headDirNormal = Utils.rotateVector2ByDegree(headDirNormal, angleChange).normalize()
            // console.log('headDirNormal', headDirNormal.toString());
         }
         // headDirNormal = Utils.rotateVector2ByDegree(headDirNormal, dt * 10).normalize()
      } else {
      }

      if (!this.dolphin || !InputController.ins.isHoldingTouch) return
      this.dolphin.headMovingDirection = headDirNormal
      this.dolphin.headAngle = Utils.vector2NormalToAngle(headDirNormal)
      this.dolphin.moveForward(dt)
   }
}
