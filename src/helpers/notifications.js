import { Expo } from 'expo-server-sdk';
import { customError } from './Errors.js';

const expo = new Expo();

const notification = {
    setData: (data) => {
        return new Promise((resolve, reject) => {
            let messages = [];

            data.forEach(element => {
                if(!expo.isExpoPushToken(element.pushToken)) reject(new customError('Invalid Push Token!'))

                messages.push({
                    to: element.pushToken,
                    sound: 'default',
                    body: element.body,
                    data: {
                        sender: element.sender
                    },
                })
            });

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
}

export default notification