import Utils from "../../Helper/Utils";
import GameCtrl from "./Game";
import Shark from "./Shark";
import SpawnObject from "./SpawnObject";
import Trash from "./Trash";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ObjectSpawner extends cc.Component {
   public static ins: ObjectSpawner = null
   @property(cc.Prefab) sharkPref: cc.Prefab = null
   @property(cc.Prefab) trashPref: cc.Prefab = null
   @property([cc.SpriteFrame]) trashSprFrames: cc.SpriteFrame[] = []
   @property spawnMinInterval = 1
   @property spawnMaxInterval = 1
   @property minSpawnSharkOffset = 1
   @property chanceToSpawnShark = 10
   @property maxChanceToSpawnShark = 40
   @property minDisBetweenEachSpawnObject = 100
   @property maxDisBetweenEachSpawnObject = 150
   @property spawnHeightRange = 150

   countAfterSpawnShark = 0
   timeLeftToSpawn = 0.5
   timeScale = 1
   lastSpawnedObject: SpawnObject = null
   protected onLoad(): void { ObjectSpawner.ins = this }
   protected onDestroy(): void { ObjectSpawner.ins = null }

   protected start(): void {

   }

   protected update(dt: number): void {
      this.timeLeftToSpawn -= dt
      if (this.timeLeftToSpawn <= 0) {
         this.spawnObjects()
         this.timeLeftToSpawn = Utils.randomRange(this.spawnMinInterval, this.spawnMaxInterval, false)
      }

      if (GameCtrl.ins.isGameOver) {
         this.timeScale = Math.max(0, this.timeScale + dt / 3)
      }
   }

   spawnObjects() {
      // console.log('spawnObjects');

      const spawnTrash = () => {
         // console.log('spawnTrash');

         this.countAfterSpawnShark++
         let spawnY = (Math.random() * this.spawnHeightRange) * Utils.getOneOrMinusOne()
         if (this.lastSpawnedObject != null) {
            const dis = cc.v2(this.lastSpawnedObject.node.position).sub(cc.v2(0, spawnY)).len()
            let i = 0
            while (dis < this.minDisBetweenEachSpawnObject && i < 100) {
               i++; spawnY = (Math.random() * this.spawnHeightRange) * Utils.getOneOrMinusOne()
            }
         }

         let object = cc.instantiate(this.trashPref).getComponent(Trash)
         this.lastSpawnedObject = object
         object.node.setParent(this.node)
         object.node.x = 0
         object.node.y = spawnY
         object.node.angle = Math.random() * 360
         object.getComponent(cc.Sprite).spriteFrame = Utils.getRandomItemInArray(this.trashSprFrames)
         let col = object.getComponent(cc.BoxCollider)
         col.size = cc.size(object.node.width, object.node.height)
      }

      const spawnShark = () => {
         // console.log('spawnShark');

         this.countAfterSpawnShark = 0
         let spawnY = (Math.random() * this.spawnHeightRange) * Utils.getOneOrMinusOne()
         if (this.lastSpawnedObject != null) {
            const dis = cc.v2(this.lastSpawnedObject.node.position).sub(cc.v2(0, spawnY)).len()
            let i = 0
            while (dis < this.minDisBetweenEachSpawnObject && i < 100) {
               i++; spawnY = (Math.random() * this.spawnHeightRange) * Utils.getOneOrMinusOne()
            }
         }

         let object = cc.instantiate(this.sharkPref).getComponent(Shark)
         object.node.setParent(this.node)
         object.node.x = 0
         object.node.y = spawnY
         this.lastSpawnedObject = object
         object.node.angle = Math.random() * 5 * Utils.getOneOrMinusOne()
      }

      if (this.countAfterSpawnShark >= this.minSpawnSharkOffset) {
         const rand = Math.random() * 100
         if (rand < this.chanceToSpawnShark) spawnShark()
         else spawnTrash()
      } else spawnTrash()
   }
}
