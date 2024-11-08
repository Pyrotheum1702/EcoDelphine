export enum SERVER_CONNECT_TYPE {
   LOCAL,
   SERVER
}
export enum SERVER_URL {
   LOCAL = "http://localhost:20000",
   SERVER = "http://localhost:20000"
}

export const PROFILE_UUID = {}
export const ALT_UUID = []

export const networkOptions = { globalConnectType: SERVER_CONNECT_TYPE.LOCAL }
export const isLocalHost = (location.hostname == 'localhost' || location.hostname.includes('192.168.1'))