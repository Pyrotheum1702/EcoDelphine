import { API_OPERATION } from "../../Config/Config";
import { callLoadingDialog } from "../../Helper/Loading/LoadingDialog";
import Utils from "../../Helper/Utils";
import { openSceneLoad } from "../SceneManager";

const { ccclass, property } = cc._decorator;

enum SERVER_CONNECT_TYPE {
   LOCAL,
   LIVE
}

@ccclass
export default class LoadCtrl extends cc.Component {
   static ins: LoadCtrl = null
   @property(cc.EditBox) usernameEditBox: cc.EditBox = null
   @property(cc.EditBox) passwordEditBox: cc.EditBox = null

   useUsername = ""
   usePassword = ""

   protected onLoad(): void {
      LoadCtrl.ins = this
      cc.director.preloadScene('1.Lobby')

      this.registerEditBoxEvents(this.usernameEditBox);
      this.registerEditBoxEvents(this.passwordEditBox);
   }

   // Helper method to register events for each EditBox
   private registerEditBoxEvents(editBox: cc.EditBox): void {
      editBox.node.on('editing-did-began', this.onEditBoxDidBegin, this);
      editBox.node.on('text-changed', this.onEditBoxTextChanged, this);
      editBox.node.on('editing-did-ended', this.onEditBoxDidEnd, this);
   }

   protected onDestroy(): void { LoadCtrl.ins = null }

   private onEditBoxDidBegin(editBox): void {
      switch (editBox) {
         case this.usernameEditBox: {
            // console.log(`Editing started in this.usernameEditBox`);
            break;
         }
         case this.passwordEditBox: {
            // console.log(`Editing started in this.passwordEditBox`);
            break;
         }
      }
   }

   private onEditBoxTextChanged(editBox): void {
      switch (editBox) {
         case this.usernameEditBox: {
            this.onUsernameChange(this.usernameEditBox.string)
            // console.log(`Text changed in this.usernameEditBox`);
            break;
         }
         case this.passwordEditBox: {
            this.onPasswordChange(this.passwordEditBox.string)
            // console.log(`Text changed in this.passwordEditBox`);
            break;
         }
      }
   }

   private onEditBoxDidEnd(editBox): void {
      switch (editBox) {
         case this.usernameEditBox: {
            this.onUsernameChange(this.usernameEditBox.string)
            // console.log(`Editing ended in this.usernameEditBox`);
            break;
         }
         case this.passwordEditBox: {
            this.onPasswordChange(this.passwordEditBox.string)
            // console.log(`Editing ended in this.passwordEditBox`);
            break;
         }
      }
   }

   onUsernameChange(string) {
      console.log("onUsernameChange", string);
      this.useUsername = string
   }

   onPasswordChange(string) {
      console.log("onPasswordChange", string);
      this.usePassword = string
   }

   onClickContinue() {
      console.log({
         login: {
            username: this.useUsername,
            password: this.usePassword,
         }
      });
   }

   login() {
      let loading = callLoadingDialog(30, () => { openSceneLoad() })

      Utils.callAPI({
         operation: API_OPERATION.LOGIN,
      }, () => {

      })
   }

   openSceneLobby() {
      cc.director.loadScene('1.Lobby')
   }
}
