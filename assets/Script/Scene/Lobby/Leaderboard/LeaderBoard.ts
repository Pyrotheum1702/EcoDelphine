import { API_OPERATION } from "../../../Config/Config";
import Utils from "../../../Helper/Utils";
import LeaderBoardItem from "./LeaderBoardItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeaderBoard extends cc.Component {
   @property(cc.Node) bg: cc.Node = null
   @property(cc.Node) arrow: cc.Node = null
   @property(cc.Node) leaderBoardItemContainer: cc.Node = null
   @property(cc.Prefab) leaderBoardItemPref: cc.Prefab = null
   @property(cc.Prefab) leaderBoardLoadingItemPref: cc.Prefab = null
   @property(cc.Prefab) leaderBoardLoadingRankingOrderPref: cc.Prefab = null
   @property([cc.Prefab]) leaderBoardItemIconPrefs: cc.Prefab[] = []

   protected onEnable(): void {
      this.updateLeaderBoard()
   }

   clearLeaderBoard() {
      this.leaderBoardItemContainer.removeAllChildren(true)
   }

   setLoading() {
      let loading = cc.instantiate(this.leaderBoardItemPref)
      loading.setParent(this.leaderBoardItemContainer)
   }

   async updateLeaderBoard() {
      this.clearLeaderBoard()
      this.setLoading()
      let leaderBoardData = await this.fetchLeaderBoard()
      this.clearLeaderBoard()
      this.buildLeaderBoard(leaderBoardData)
   }

   buildLeaderBoard(leaderBoardData) {
      if (!leaderBoardData) return

      for (let i = 0; i < leaderBoardData.length; i++) {
         this.scheduleOnce(() => {
            const data = leaderBoardData[i];
            let item = cc.instantiate(this.leaderBoardItemPref)
            item.setParent(this.leaderBoardItemContainer)
            let script = item.getComponent(LeaderBoardItem)
            script.nameLb.string = data.name
            script.tokenLb.string = Utils.formatNumberWithCommas(data.score)

            if (i == 0) {
               const icon = cc.instantiate(this.leaderBoardItemIconPrefs[0])
               icon.setParent(item)
               icon.setPosition(0, 0)
            } else if (i == 1) {
               const icon = cc.instantiate(this.leaderBoardItemIconPrefs[1])
               icon.setParent(item)
               icon.setPosition(0, 0)
            } else if (i == 2) {
               const icon = cc.instantiate(this.leaderBoardItemIconPrefs[2])
               icon.setParent(item)
               icon.setPosition(0, 0)
            } else {
               const text = cc.instantiate(this.leaderBoardLoadingRankingOrderPref)
               text.setParent(item)
               text.setPosition(0, 0)
               text.getComponentInChildren(cc.Label).string = '#' + data.rank
            }
         }, i * 0.1)
      }
   }

   async fetchLeaderBoard() {
      return await new Promise((res) => {
         Utils.callAPI({
            operation: API_OPERATION.GET_LEADER_BOARD
         }, (response) => {
            console.log({ leaderBoardData: response.leaderboard });
            res(response.leaderboard)
         }, () => { res({}) })
      })
   }

   expanded = false
   blockClickExpand = false
   onClickExpand() {
      console.log('onClickExpand');

      if (this.blockClickExpand) return
      this.blockClickExpand = true

      if (!this.expanded) {
         cc.tween(this.arrow).to(0.244, { angle: 90 }, { easing: "sineOut" }).start()
         cc.tween(this.bg).to(0.244, { height: 1139.5 }, { easing: "sineOut" }).call(() => {
            this.blockClickExpand = false
         }).start()
      } else {
         cc.tween(this.arrow).to(0.244, { angle: -90 }, { easing: "sineOut" }).start()
         cc.tween(this.bg).to(0.244, { height: 479.6 }, { easing: "sineOut" }).call(() => {
            this.blockClickExpand = false
         }).start()
      }
      this.expanded = !this.expanded
   }
}
