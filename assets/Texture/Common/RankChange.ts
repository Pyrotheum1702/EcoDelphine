const {ccclass, property} = cc._decorator;

@ccclass
export default class RankChange extends cc.Component {

    @property(cc.Label) multiplier: cc.Label = null;
    @property(cc.Label) chipHour: cc.Label = null;
    @property(cc.Label) eloRange: cc.Label = null;
    @property(cc.Label) rank: cc.Label = null;
    @property(cc.Node) up: cc.Node = null;
    @property(cc.Node) down: cc.Node = null;

    show(reward, isUp) {
        console.log('@@@ showwww')
        this.up.active = isUp;
        this.down.active = !isUp;
        this.rank.string = reward.rank;
        this.multiplier.string = 'x ' + reward.multiplier.toFixed(1);
        this.chipHour.string = reward.hourlyReward.toLocaleString() + '/h';
        this.eloRange.string = reward.range[0].toLocaleString() + ' - ' + reward.range[1].toLocaleString();
        if (reward.rank === 'Immortal') {
            this.eloRange.string =  reward.range[0].toLocaleString() + '+'
        }

        cc.tween(this.node)
        .to(0.25, { opacity: 255 }, { easing: 'backIn' })
        .delay(2.5)
        .to(0.25, { opacity: 0 }, { easing: 'backIn' }).call( () => {
            this.node.active = false
        })
        .start();
    }
}
