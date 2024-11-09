const { ccclass, property } = cc._decorator;

@ccclass
export default class AssetContainer extends cc.Component {
   canvas: cc.Node = null
   @property(cc.Prefab) loadingDialogPref: cc.Prefab = null

   public static ins: AssetContainer = null
   protected onDestroy(): void { AssetContainer.ins = null }
   protected onLoad(): void { AssetContainer.ins = this }
}
