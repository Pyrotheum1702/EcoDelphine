import { API_OPERATION } from "../../Config/Config";
import { GlobalVar } from "../../Helper/GlobalVar";
import { callLoadingDialog } from "../../Helper/Loading/LoadingDialog";
import SoundPlayer from "../../Helper/SoundPlayer";
import Utils from "../../Helper/Utils";
import { openSceneLoad } from "../SceneManager";
import Dolphin from "./Dolphin/Dolphin";
import InputController from "./Dolphin/InputController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCtrl extends cc.Component {
   static ins: GameCtrl = null
   @property(cc.Node) ui: cc.Node = null
   @property(cc.Node) spawnObjectContainer: cc.Node = null
   @property(cc.Node) gameOverPopup: cc.Node = null
   @property(cc.Node) gameOverRewardIcon: cc.Node = null
   @property(cc.Node) scoreResultLayout: cc.Node = null
   @property(cc.Node) tokenResultLayout: cc.Node = null
   @property(cc.Label) resultScoreLb: cc.Label = null
   @property(cc.Label) resultTokenLb: cc.Label = null
   @property(cc.Label) gameOverTitle: cc.Label = null
   @property(cc.Label) pointLb: cc.Label = null
   @property(cc.Label) timeLeftsLb: cc.Label = null

   isGameOver = false
   gameStarted = false

   sessionsStats = {
      point: 0,
      timeLeft: 0,
   }

   protected onLoad(): void {
      GameCtrl.ins = this
      SoundPlayer.ins.play("Swoosh")
      this.gameOverPopup.active = false
      cc.director.preloadScene('1.Lobby')

      let colManager = cc.director.getCollisionManager()
      colManager.enabled = true
      // colManager.enabledDebugDraw = true
      this.sessionsStats.timeLeft = 45
      this.scheduleOnce(() => {
         SoundPlayer.ins.play("Btn1")
      })
      this.scheduleOnce(() => { this.gameStarted = true }, 2)
   }

   protected update(dt: number): void {
      if (this.gameStarted && !this.isGameOver) {
         this.sessionsStats.timeLeft -= dt
         if (this.sessionsStats.timeLeft < 0) {
            this.sessionsStats.timeLeft = 0
            this.onGameOver(false)
         }
         this.timeLeftsLb.string = this.sessionsStats.timeLeft.toFixed(1) + "s"
      }
   }

   addPoint(amount) {
      this.sessionsStats.point += amount
      this.pointLb.string = '' + this.sessionsStats.point
   }

   protected onDestroy(): void { GameCtrl.ins = null }

   onGameOver(die = true) {
      if (this.isGameOver) return
      this.isGameOver = true

      if (die) {
         this.gameOverRewardIcon.active = false
         this.gameOverTitle.string = "GameOver!"
      } else this.gameOverTitle.string = "Your reward!"

      cc.tween(Dolphin.ins.node).to(0.77, { opacity: 0 }, { easing: 'sineIn' }).start()
      cc.tween(this.ui).to(0.55, { opacity: 0 }, { easing: "sineIn" }).start()

      cc.tween(this.spawnObjectContainer).to(1, { opacity: 0 }, { easing: "sineIn" }).call(() => {
         this.spawnObjectContainer.destroy()
         InputController.ins.touchNodes.forEach(node => { node.opacity = 0 })

         let loading = callLoadingDialog(30, () => { openSceneLoad() })

         Utils.callAPI({
            operation: API_OPERATION.REPORT_GAME_RESULT,
            username: GlobalVar.profile.username,
            score: this.sessionsStats.point,
         }, (response) => {
            loading.endImmediately()
            this.gameOverPopup.active = true
            GlobalVar.profile = response.profile
            const result = response.result

            this.scoreResultLayout.active = false
            this.tokenResultLayout.active = false

            this.scoreResultLayout.active = true
            this.scheduleOnce(() => {
               SoundPlayer.ins.play("Collect")
               Utils.tweenLb(this.resultScoreLb, 0, result.score, 0.777, 'sineIn', () => {
                  SoundPlayer.ins.play("Collect")
                  this.tokenResultLayout.active = true
                  Utils.tweenLb(this.resultTokenLb, 0, result.token, 0.777, 'sineIn', null, ': ')
               }, ': ')
            }, 0.5)
         })

      }).start()

   }

   onClickPlayAgain() {
      SoundPlayer.ins.play("Btn")
      let loading = callLoadingDialog(10000)
      cc.director.loadScene('2.Game')
   }

   openSceneLobby() {
      SoundPlayer.ins.play("Btn")
      let loading = callLoadingDialog(10000)
      cc.director.loadScene('1.Lobby')
   }
}
