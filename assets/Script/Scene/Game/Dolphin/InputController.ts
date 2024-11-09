import { GlobalVar } from "../../../Helper/GlobalVar";
import SoundPlayer from "../../../Helper/SoundPlayer";
import Utils from "../../../Helper/Utils";
import GameCtrl from "../Game";
import Dolphin from "./Dolphin";
import DolphinController from "./DolphinController";


const { ccclass, property } = cc._decorator;

export enum TOUCH_EVENT_TYPE {
   START,
   MOVE,
   END
}

@ccclass
export default class InputController extends cc.Component {
   static ins: InputController = null
   @property(cc.Node) touchNodesContainer: cc.Node = null
   @property(cc.Node) touchOrigin: cc.Node = null
   @property([cc.Node]) touchNodes: cc.Node[] = []
   @property maxRange = 100
   isAllowTouch: boolean = true
   touchesId = []
   moveTouch: cc.Touch
   boostTouch: cc.Touch
   controllable = true
   isHoldingTouch = false

   direction: cc.Vec2 = null
   angle: number = null
   length: number = null

   protected onLoad(): void { InputController.ins = this }
   protected onDestroy(): void { InputController.ins = null }
   protected start(): void {
      this.setupInputCatcher()
   }

   public setupInputCatcher() {
      // console.log('setupInputCatcher');

      this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this), this);
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this), this);
      this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this), this);
      this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this), this);

      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

      // State variables to track if keys are held down
      this.isSpaceBarHeld = false;
      this.isShiftHeld = false;
   }

   isSpaceBarHeld = false;
   isShiftHeld = false

   onKeyDown(event) {
      switch (event.keyCode) {
         case cc.macro.KEY.space:
            this.isSpaceBarHeld = true;
            this.onKeyStateChange()
            break;

         case cc.macro.KEY.shift:
            this.isShiftHeld = true;
            this.onKeyStateChange()
            break;
      }
   }

   onKeyUp(event) {
      switch (event.keyCode) {
         case cc.macro.KEY.space:
            this.isShiftHeld = false;
            this.onKeyStateChange()
            break;

         case cc.macro.KEY.shift:
            this.isShiftHeld = false;
            this.onKeyStateChange()
            break;
      }
   }

   onKeyStateChange() {
      if (this.isSpaceBarHeld || this.isShiftHeld) Dolphin.ins.boosting = true
      else Dolphin.ins.boosting = false
   }

   private onTouchStart(touch: cc.Event.EventTouch) {
      // console.log("this.onTouchStart");

      if (!this.controllable) return

      this.isHoldingTouch = true;
      let pos = Utils.worldSpaceToLocal(touch.getLocation(), this.touchNodesContainer)
      if (!this.touchesId.includes(touch.getID())) this.touchesId.push(touch.getID())
      if (!this.moveTouch) {
         this.direction = cc.v2(0, 0)
         this.angle = 0
         this.length = 0

         this.touchNodes[0].active = true
         this.touchNodes[1].active = true
         this.touchNodes[0].setPosition(pos)
         this.touchNodes[1].setPosition(pos)
         this.moveTouch = touch.touch
      }
      else if (!this.boostTouch) {
         this.touchNodes[2].active = true
         this.touchNodes[2].setPosition(pos)
         this.boostTouch = touch.touch
      }

      if (this.touchesId.length > 1) {
         // SoundPlayer.ins.startSound('Speed Up')
         // Dolphin.ins.snakeHead.boosting = true
         Dolphin.ins.boosting = true
      }

      // Dolphin.ins.onTouchEvent(TOUCH_EVENT_TYPE.START, touch.getLocation())
   }
   private onTouchMove(touch: cc.Event.EventTouch) {
      // console.log("this.onTouchMove");
      if (!this.controllable) return

      if (this.moveTouch && touch.touch.getID() == this.moveTouch.getID()) {
         // let pos = Utils.worldSpaceToLocal(touch.getLocation(), this.touchNodesContainer)
         let originPos = Utils.getWorldPos(this.touchOrigin)
         let pos = cc.v2(touch.getLocation()).sub(originPos)
         let range = Math.min(this.maxRange, pos.len())
         let dir = pos.normalize()

         this.direction = cc.v2(dir)

         this.length = range / this.maxRange
         this.angle = Utils.vector2NormalToAngle(dir)

         pos = dir.mul(range)

         pos = cc.v2(this.touchOrigin.position).add(pos)
         this.touchNodes[1].setPosition(pos)

         // console.log('this.angle', this.angle);
         // console.log('this.length', this.length);
         // console.log('this.direction', this.direction);

         DolphinController.ins.onTouchEvent(TOUCH_EVENT_TYPE.MOVE, touch.getLocation())
      }
   }
   private onTouchEnd(touch: cc.Event.EventTouch) {
      if (!this.controllable) return

      if (this.touchesId.includes(touch.getID())) {
         Utils.removeElementFromArray(touch.getID(), this.touchesId)
      }

      if (this.touchesId.length <= 1) {
         // SoundPlayer.ins.stopSound('Speed Up')
         Dolphin.ins.boosting = false
      }

      if (this.moveTouch && this.moveTouch.getID() == touch.touch.getID()) {
         this.direction = cc.v2(0, 0)
         this.angle = 0
         this.length = 0

         this.isHoldingTouch = false;
         this.touchNodes[0].active = false
         this.touchNodes[1].active = false
         this.moveTouch = null
         // Dolphin.ins.onTouchEvent(TOUCH_EVENT_TYPE.END, touch.getLocation())
      }

      if (this.boostTouch && this.boostTouch.getID() == touch.touch.getID()) {
         this.boostTouch = null
         Dolphin.ins.boosting = false
         this.touchNodes[2].active = false
      }
   }
}
