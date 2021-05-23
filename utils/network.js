// import * as Network from "expo-network"
// import { Toast } from "native-base"
// import NetInfo from "@react-native-community/netinfo"

// console.log(NetInfo)
// console.log(NetInfo.configure)
// NetInfo.configure({
//     reachabilityLongTimeout: 5 * 1000,
//     reachabilityShortTimeout: 5 * 1000,
// })

export const isInternetReachable = async () => {
    return true
}
//     console.log("is internet rechable fct")
//     // const network = await Network.getNetworkStateAsync()
//     console.log(NetInfo)
//     // const network = await NetInfo.fetch()

//     return  NetInfo.fetch().then(state => {
//         console.log("Connection type", state.type);
//         console.log("Is connected?", state.isConnected);
//     });
//     console.log("ended")
//     // console.log(network)
//     // const network = await NetInfo.getConnectionInfo()

//     // if (!network.isInternetReachable) {
//     //     Toast.show({
//     //         text: "Aucune connexion internet.",
//     //         duration: 3000
//     //     })
//     // }
//     // return network.isInternetReachable
// }