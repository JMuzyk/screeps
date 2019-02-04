const trader = (function () {

    function tradeResource() {
        for (let room in Game.rooms) {
            const utriumBuyOrders = Game.market.getAllOrders(
                (order) => {
                    return order.type === ORDER_BUY && order.resourceType === RESOURCE_UTRIUM
                        && Game.market.calcTransactionCost(1000, room, order.roomName) < 1000
                        && order.price > 0.1;
                    });

            if(utriumBuyOrders.length > 0) {
                const order = utriumBuyOrders[0];
                const resourceStorageInTerminal = Game.rooms[room].terminal.store[RESOURCE_UTRIUM];
                if(resourceStorageInTerminal > 1000) {
                    Game.market.deal(order.id, Math.min(resourceStorageInTerminal, order.amount), room);
                    console.log("Selling " + Math.min(resourceStorageInTerminal, order.amount) + " utrium to " + order.roomName)
                }
            }
        }
    }

    function run() {

       if(Game.time % 10 === 0) {
           tradeResource();
       }
    }

    return {
        run: run
    }
})();

module.exports = trader;