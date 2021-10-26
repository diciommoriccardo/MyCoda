import { Expo } from 'expo-server-sdk';
import { customError } from './Errors.js';

const expo = new Expo();

const notification = {
    setData: (data) => {
        return new Promise((resolve, reject) => {
            let messages = [];

            for(let row of data){
                if(!expo.isExpoPushToken(row.pushToken)) reject(new customError('Invalid Push Token!'))

                messages.push({
                    to: row.pushToken,
                    sound: 'default',
                    body: row.body,
                    data: {
                        sender: row.sender
                    },
                })
            }

            resolve(messages)
        })
    },
    sendNotifications: (messages) => {
        return new Promise((resolve, reject) => {
            let chunks = expo.chunkPushNotifications(messages);
            let tickets = [];

            for(let chunk of chunks){
                expo.sendPushNotificationsAsync(chunk)
                .then(ticketChunk => {
                    tickets.push(...ticketChunk);
                })
                .catch(err => reject(err))
                resolve(tickets)
            }
        })
    },
    getToken: () => {
        return new Promise((resolve, reject) => {
            expo.getDevicePushTokenAsync()
            .then(token => resolve(token))
            .catch(err => {console.log(err); return reject(err)})
        })
    }
}

export default notification