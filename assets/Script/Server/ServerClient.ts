// import { GlobalVar } from "../Helper/GlobalVar";
// import Utils from "../Helper/Utils";
// import { Room } from "./colyseus";
// import HandleData from "./HandleData";

// enum JOIN_ROOM_FAIL_TYPE {
//    CONNECTION_ERROR = 0,
//    AUTHENTICATION_FAIL = 1,
//    UNKNOWN = 2
// }

// export const EVT = {
//    NONE: 'NONE'
// }

// export const ROOM = {
//    ExampleRoom: 'Poker',
// }

// export let COLYSEUS_WSS_URL = {
//    LOCAL: 'ws://localhost:18010',
//    PRODUCTION: 'wss://staging2.tonpoker.fun/ton-poker',
//    TEST: 'wss://staging.tonpoker.fun/ton-poker',
//    RUNTIME: '',
// }

// export default class ServerClient {
//    private static instance: ServerClient;
//    public static get ins(): ServerClient {
//       if (ServerClient.instance == null) {
//          ServerClient.instance = new ServerClient();
//       }
//       return ServerClient.instance;
//    }

//    client: Colyseus.Client;
//    currentRoom: Colyseus.Room;

//    connectURL = COLYSEUS_WSS_URL.LOCAL
//    timeCount = 0;
//    isLeave = false;
//    onConnectedCallback
//    sendPingTimeout

//    connect(onConnected = null, room = ROOM.ExampleRoom) {
//       //@ts-ignore 
//       this.connectURL = COLYSEUS_WSS_URL.RUNTIME

//       //@ts-ignore
//       this.client = new Colyseus.Client(this.connectURL);

//       setTimeout(() => {
//          console.log('client: ', this.client);
//       }, 1000)

//       // GlobalVar.profile.uuid = "u0IQxJ75e";
//       this.onConnectedCallback = onConnected;
//       console.log('@@@ table ', GlobalVar.tableSelected)
//       this.joinRoom(room, null, {
//          uuid: GlobalVar.profile.uuid,
//          tableName: GlobalVar.tableSelected.tableName,
//          buyInAmount: GlobalVar.tableSelected.buyIn,
//          timerSpeed: GlobalVar.tableSelected.speed
//       })
//    }

//    async joinRoom(roomType, onJoinedRoom = null, options = null) {
//       const afterJoinedRoom = (room) => {
//          this.currentRoom = room
//          GlobalVar.currentRoomType = roomType

//          console.log('joined room: ', room);

//          room.onMessage('pong', () => {
//             HandleData.handlePingPong();
//          })

//          room.onMessage('*', (message) => {
//             if (message == '__playground_message_types') return

//             Utils.unzip(message, (unZippedMessage) => {
//                this.onRoomMessage(unZippedMessage)
//             });
//          })


//          room.onLeave((client, consented) => {
//             console.log('left room: consented ', consented);

//          });

//          room.onError((error) => {
//             console.log('room.onError', error);

//          })
//          // end
//          if (onJoinedRoom) onJoinedRoom(room)
//          if (this.onConnectedCallback) {
//             this.onConnectedCallback()
//             this.onConnectedCallback = null
//          }
//       }

//       try {
//          await this.client.joinOrCreate(roomType, options).then(afterJoinedRoom)
//       } catch (error) {
//          console.log('join room failed: ', error);

//          let errorType

//          if (error?.type == 'error') errorType = JOIN_ROOM_FAIL_TYPE.CONNECTION_ERROR
//          else if (error.code && error.code > 1000) errorType = JOIN_ROOM_FAIL_TYPE.AUTHENTICATION_FAIL
//          else errorType = JOIN_ROOM_FAIL_TYPE.UNKNOWN

//          switch (errorType) {
//             case JOIN_ROOM_FAIL_TYPE.CONNECTION_ERROR: {
//                console.log('FAILED TO JOIN ROOM DUE TO CONNECTION!!');
//                break;
//             }
//             case JOIN_ROOM_FAIL_TYPE.AUTHENTICATION_FAIL: {
//                console.log('FAILED TO JOIN ROOM DUE TO AUTHENTICATION FAILED!!');

//                console.log('code: ' + error.code + ' - message: ', error.message);
//                break
//             }
//             default:
//                console.log('FAILED TO JOIN UNKNOWN ERROR CASE!!');
//                break;
//          }
//       }
//    }

//    onRoomMessage(message) {
//       // console.log('on message', message);
//       HandleData.handle(message);
//    }

//    leaveRoom() {
//       console.log('call LEAVE room')
//       if (this.currentRoom) this.currentRoom.leave(true);
//    }

//    sendData(data) {
//       // console.log("On client sendData: ", data)
//       Utils.zip(data, (dataSend) => {
//          // console.log(this.currentRoom.connection);
//          try { if (!this.isLeave) this.currentRoom.send(dataSend); } catch (e) {
//             console.log(e);
//          }
//       })
//    }

//    sendPing() {
//       this.currentRoom.send('ping');

//    }
// }       