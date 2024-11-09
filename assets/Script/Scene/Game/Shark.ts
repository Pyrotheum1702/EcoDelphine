import SpawnObject from "./SpawnObject";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shark extends SpawnObject {
   protected onLoad(): void {
      this.node.scale = this.node.scale * (1 + Math.random() * 0.15)
   }

}
