import { SERVER_CONNECT_TYPE, networkOptions } from "./NetworkConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NetworkInitializer extends cc.Component {

   protected onLoad(): void {
      if (CC_PREVIEW) networkOptions.globalConnectType = SERVER_CONNECT_TYPE.LOCAL
      else networkOptions.globalConnectType = SERVER_CONNECT_TYPE.SERVER
   }
}
