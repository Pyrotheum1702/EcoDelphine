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
   // @property angleRequireToSteer = 1
   public isMove = true
   private currentTouchNormal: cc.Vec2
   public snakeHead: Dolphin = null
   private touchStartPos: cc.Vec2 = null
   private controlType = CONTROL_TYPE.JOYSTICK


   public serverSyncDeltaTime = 0

   time = 1 / 30
   timeInterval = 1 / 30

   public onTouchEvent(touchType: TOUCH_EVENT_TYPE, touchLoc: cc.Vec2) {
      if (!this.snakeHead) return

      switch (touchType) {
         case TOUCH_EVENT_TYPE.START:
            if (!this.touchStartPos) this.touchStartPos = touchLoc
            break
         case TOUCH_EVENT_TYPE.MOVE:
            let touchDir
            touchDir = touchLoc.sub(cc.v2(this.touchStartPos))
            this.currentTouchNormal = touchDir.normalize()
            break
         case TOUCH_EVENT_TYPE.END:
            this.touchStartPos = null
            this.currentTouchNormal = null
            break
      }
   }
   protected update(dt: number): void {
      if (!this.snakeHead || !this.isMove) return

      let headDirNormal = this.snakeHead.headMovingDirection

      if (InputController.ins.isHoldingTouch && this.currentTouchNormal) {
         let cProduct = headDirNormal.cross(cc.v2(this.currentTouchNormal))
         let c = (cProduct > 0) ? 1 : -1

         let rawAngleA = Utils.vector2NormalToAngle(this.currentTouchNormal)
         let rawAngleB = Utils.vector2NormalToAngle(this.snakeHead.headMovingDirection)
         let absAngleDiff = Math.abs(rawAngleA - rawAngleB)

         if (absAngleDiff <= this.snakeHead.angleChangeSpeed * dt || cProduct == 0) {

         } else {
            this.snakeHead.currentHeadAngle += this.snakeHead.angleChangeSpeed * dt * c * this.snakeHead.traverseSpeed
            headDirNormal = Utils.rotateVector2ByDegree(this.snakeHead.headMovingDirection, this.snakeHead.angleChangeSpeed * dt * c).normalize()
            this.snakeHead.headMovingDirection = headDirNormal
         }
      }

      this.snakeHead.headMovingDirection = headDirNormal

      this.snakeHead.node.angle = Utils.vector2NormalToAngle(headDirNormal) + 90
      this.snakeHead.moveForward(dt)
   }
}
