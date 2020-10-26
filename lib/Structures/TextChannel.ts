export class TextChannelBase extends Channel {
    lastMessageID: string;

    constructor (data: any, bot: Bot, token: string) {
        super(data, bot, token);

        this.lastMessageID = data.last_message_id;
    }

    /**
     * @description Sends a message to the channel
     * @param {string} message The message to send
     */
    send (message: string): Promise<Message> {
        return new Promise((resolve, reject) => {
            axios.post(baseUrl + this.id + '/messages', {
                content: message,
            }, {
                headers: {
                    Authorization: 'Bot ' + this.token,
                }
            })
                .then(reply => resolve(new Message(reply.data, this.b, this.token)))
                .catch(err => reject(err.response));
        })
    }
}
