const { ccclass, property } = cc._decorator;

@ccclass
export default class LeaderBoardItem extends cc.Component {
   @property(cc.Label) nameLb: cc.Label = null;
   @property(cc.Label) tokenLb: cc.Label = null;
}
