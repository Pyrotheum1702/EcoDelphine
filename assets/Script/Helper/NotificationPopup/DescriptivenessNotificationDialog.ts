import Utils from "../../Script/Helper/Utils";
import AssetContainer from "../../Script/Main/AssetContainer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DescriptivenessNotificationDialog extends cc.Component {
   @property(cc.Label) title: cc.Label = null
   @property(cc.Label) descriptionLb: cc.Label = null

   clickedClose = false
   onClickClose() {
      if (this.clickedClose) return
      this.clickedClose = true

      Utils.fadeOutNode(this.node, 0.25, () => { this.node.destroy() })
   }
}

export function callDescriptivenessNotificationDialog(title, description, existTime = 100) {
   const asset = AssetContainer.ins
   const pref = asset.descriptivenessNotificationDialogPref
   let dialog = cc.instantiate(pref)

   dialog.setParent(cc.director.getScene().getChildByName('Canvas'))
   dialog.setPosition(cc.v2(0, 0))
   Utils.fadeInNode(dialog)

   let script = dialog.getComponent(DescriptivenessNotificationDialog)
   script.title.string = title
   script.descriptionLb.string = description
   if (title.includes('Success')) script.title.node.color = new cc.Color().fromHEX('#ACFF53')
   script.scheduleOnce(() => { script.onClickClose() }, existTime)
}
