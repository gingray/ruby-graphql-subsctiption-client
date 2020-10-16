import "./style.scss";
import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer("ws://lvh.me:4000/cable")
const hash = {
    connected: () => { console.log("connected") },
    disconnected: () => { console.log("disconnected") },
    rejected: () => { console.log("rejected") },
    received: (data) => { console.log(data) },
}
cable.subscriptions.create("NotificationsChannel", hash)