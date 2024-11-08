const { ccclass, property } = cc._decorator;

@ccclass
export default class OperationFailDialog extends cc.Component {
   @property(cc.Label) title: cc.Label = null
   @property(cc.Label) desc: cc.Label = null
}
