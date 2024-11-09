import Utils from "../../Helper/Utils";
import ObjectSpawner from "./ObjectSpawner";

const { ccclass, property } = cc._decorator;

export enum SpawnObjectType {
   DEFAULT,
   TRASH,
   SHARK,
   MAP_PIECE
}
@ccclass
export default class SpawnObject extends cc.Component {
   @property({ type: cc.Enum(SpawnObjectType) }) objectType: SpawnObjectType = SpawnObjectType.DEFAULT

   @property minSpeed = 100
   @property maxSpeed = 120
   moveSpeed = 0

   yDir = Utils.getOneOrMinusOne()
   switchDirTimeLeft = Math.random()

   protected start(): void {
      this.moveSpeed = Utils.randomRange(this.minSpeed, this.maxSpeed)
   }

   protected update(dt: number): void {
      this.node.x -= dt * this.moveSpeed
      this.node.y += this.yDir * Math.random() * 8 * dt

      if (this.switchDirTimeLeft <= 0) {
         this.yDir *= -1
         this.switchDirTimeLeft = (Math.random() * 0.2) + 0.2
      }
   }
}
