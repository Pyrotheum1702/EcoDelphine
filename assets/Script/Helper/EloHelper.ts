import { API_OPERATION, RANKING } from "../Config/Config";
import { GlobalVar } from "./GlobalVar";
import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EloHelper extends cc.Component {
   @property(cc.SpriteFrame) rankingIcons: cc.SpriteFrame[] = []

   ELO_THRESH_HOLD = [
      1000,   // BRONZE
      3000,   // SILVER
      6000,   // GOLD
      10000,  // PLATINUM
      15000,  // DIAMOND
      20000,  // MASTER
      25000,  // GRANDMASTER
      35000,  // LEGEND
      50000,  // MYTHIC
      50001   // IMMORTAL
   ]

   public static inst: EloHelper = null;

   onLoad() { EloHelper.inst = this; }

   public eloTableConfigs = []

   getEloConfig(onDone) {
      Utils.callAPI({
         operation: API_OPERATION.GET_LEVELS,
      }, (res) => {
         console.log('GET_LEVELS ', res)
         this.ELO_THRESH_HOLD = [];
         this.eloTableConfigs = res.levels;
         res.levels.forEach(level => {
            this.ELO_THRESH_HOLD.push(level.max)
         })

         if (onDone) onDone()
      }, () => {
      })
   }

   getEloRank(elo) {
      let isFound = false;
      let rank = RANKING.IMMORTAL;
      for (let i = 0; i < this.ELO_THRESH_HOLD.length - 1; i++) {
         if (elo <= this.ELO_THRESH_HOLD[i]) {
            isFound = true;
            rank = i;
            break;
         }
      }
      return rank
   }

   getEloRankInString(elo) {
      const rank = this.getEloRank(elo);
      return this.eloTableConfigs[rank].name;
   }

   getRankIcon(rank: RANKING) {
      return this.rankingIcons[rank];
   }

   getRankIconFromElo(elo) {
      const rank = this.getEloRank(elo);
      return this.getRankIcon(rank);
   }
   /** Get Rewards from ELO : multiplier, hourlyReward, friendReward
  */

   getRewardsFromElo(elo) {
      const rank = this.getEloRank(elo);
      const config = this.eloTableConfigs[rank];
      return {
         multiplier: config.multiplier,
         friendReward: config.friendReward,
         hourlyReward: config.hourlyReward,
         rank: config.name,
         range: [config.min, config.max]
      }
   }

   getEarnMultiplier() {
      const elo = GlobalVar.profile.ELO
      const rank = this.getEloRank(elo);
      const config = this.eloTableConfigs[rank];
      return config.multiplier
   }

   getEarnMultiplierAsString() {
      const elo = GlobalVar.profile.ELO
      const rank = this.getEloRank(elo);
      const config = this.eloTableConfigs[rank];
      return ('x' + (config.multiplier).toFixed(1))
   }

   getEloNeededToRankUp(elo) {
      // incase already in highest RANK, return -1
      let eloNeed = -1
      const rank = this.getEloRank(elo);
      if (rank < this.eloTableConfigs.length - 1) {
         eloNeed = Math.floor(this.eloTableConfigs[rank + 1].min - elo)
      }
      return eloNeed
   }

   getPercentCurrentRank(elo) {
      // incase already in highest RANK, return 1 (100%)
      let curPercent = -1
      const rank = this.getEloRank(elo);
      const curRank = this.eloTableConfigs[rank];
      if (rank < this.eloTableConfigs.length - 1) {
         const distance = curRank.max - curRank.min;
         curPercent = (elo - curRank.min) / distance
      }
      return curPercent
   }
}
