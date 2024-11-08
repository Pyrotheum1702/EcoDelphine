import Utils from "../../Script/Helper/Utils";
import AssetContainer from "../../Script/Main/AssetContainer";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NotificationDialog extends cc.Component {
   @property(cc.Label) title: cc.Label = null
   @property(cc.Label) desc: cc.Label = null

   callBackOnContinue = null
   clickedClose = false
   onClickClose() {
      if (this.clickedClose) return
      this.clickedClose = true

      Utils.collapseNode(this.node, 0.25, () => {
         if (this.callBackOnContinue) this.callBackOnContinue()
         this.node.destroy()
      })
   }
}

export function callNotificationPopup(title, description, callBackOnContinue = null) {
   const asset = AssetContainer.ins
   const pref = asset.notificationDialogPref

   let dialog = cc.instantiate(pref)

   dialog.setParent(cc.director.getScene().getChildByName('Canvas'))
   dialog.setPosition(cc.v2(0, 0))
   Utils.popupNode(dialog)

   let script = dialog.getComponent(NotificationDialog)
   script.title.string = title
   if (title.includes('Success')) script.title.node.color = new cc.Color().fromHEX('#ACFF53')
   script.desc.string = description
   script.callBackOnContinue = callBackOnContinue
}
