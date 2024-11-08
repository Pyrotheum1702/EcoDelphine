const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadController extends cc.Component {
   // protected onLoad(): void {
   //    cc.director.preloadScene('Main')
   // }

   // login() {
   //    let uuidUse = ''

   //    try {
   //       const overflow = 5
   //       document.body.style.overflowY = 'hidden'
   //       document.body.style.marginTop = `${overflow}px`
   //       document.body.style.height = window.innerHeight + overflow + "px"
   //       document.body.style.paddingBottom = `${overflow}px`
   //       window.scrollTo(0, overflow)
   //    } catch (error) { }

   //    networkOptions.globalConnectType = CONNECT_TYPE.SERVER
   //    // @ts-ignore
   //    // if (window.isInProduction != null && window.isInProduction == true)
   //    //    networkOptions.globalConnectType = CONNECT_TYPE.SERVER
   //    // else
   //    //    networkOptions.globalConnectType = CONNECT_TYPE.LOCAL

   //    if (networkOptions.globalConnectType == CONNECT_TYPE.LOCAL) uuidUse = localUUIDUse
   //    else try {
   //       // @ts-ignore
   //       uuidUse = window.Telegram.WebApp.initDataUnsafe.user.id
   //       // @ts-ignore
   //       console.log(window.Telegram.WebApp);
   //       // @ts-ignore
   //       console.log(window.Telegram);
   //       // @ts-ignore
   //       window.Telegram.WebApp.isClosingConfirmationEnabled = false
   //       // @ts-ignore
   //       window.Telegram.WebApp.expand()

   //       // @ts-ignore
   //       // console.log('window.Telegram.WebApp.initDataUnsafe.user', window.Telegram.WebApp.initDataUnsafe.user);
   //    } catch (error) {
   //       if (uuidUse == '') uuidUse = localUUIDUse
   //       // console.log('LoadController.onload', error);
   //    }

   //    const forceInviterId = ""
   //    const forceAppInitData = {
   //       user: {

   //       },
   //       // start_param = ""
   //    }

   //    Utils.callAPI({
   //       operation: API_OPERATION.LOGIN,
   //       uuid: uuidUse,
   //    }, (response) => {
   //       if (response) {
   //          GlobalVar.profile.uuid = response.uuid
   //          GlobalVar.profile.avatarUrl = response.avatarUrl
   //          GlobalVar.profile.firstName = response.firstName
   //          GlobalVar.profile.lastName = response.lastName
   //          GlobalVar.profile.nickName = '(Pirate)'
   //          GlobalVar.friendInvitedCount = response.friendInvitedCount
   //          if (response.rewardCoin > 0) {
   //             GlobalVar.rewardCoin = response.rewardCoin
   //          }
   //          // console.log('GlobalVar.profile:', GlobalVar.profile);
   //          // console.log('GlobalVar.friendInvitedCount:', GlobalVar.friendInvitedCount);


   //          this.scheduleOnce(() => {
   //             cc.director.loadScene('Main')
   //          }, 0.1)
   //       }
   //    })

   //    cc.director.loadScene('Main')
   // }
}
