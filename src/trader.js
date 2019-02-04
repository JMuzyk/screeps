const trader = (function () {

    function tradeResource() {
        for (let roomName in Game.rooms) {
            const utriumBuyOrders = Game.market.getAllOrders(
                (order) => {
                    return order.type === ORDER_BUY && order.resourceType === RESOURCE_UTRIUM
                        && Game.market.calcTransactionCost(1000, roomName, order.roomName) < 1000
                        && order.price > 0.1;
                    });

            if(utriumBuyOrders.length > 0) {
                const order = utriumBuyOrders[0];
                const resourceStorageInTerminal = Game.rooms[roomName].terminal.store[RESOURCE_UTRIUM];
                if(resourceStorageInTerminal > 1000) {
                    const transactionCost = Game.market.calcTransactionCost(Math.min(resourceStorageInTerminal, order.amount), roomName, order.roomName);
                    Game.market.deal(order.id, Math.min(resourceStorageInTerminal, order.amount), roomName);
                    console.log("Selling " + Math.min(resourceStorageInTerminal, order.amount) + " utrium to " + order.roomName + " at a cost of " + transactionCost + " energy.")
                }
            }
        }
    }

    function tradeEnergy() {
        for (let roomName in Game.rooms) {
            const sortByTransactionCost = (a, b) => Game.market.calcTransactionCost(1000, roomName, a.roomName) - Game.market.calcTransactionCost(1000, roomName, b.roomName)
            const utriumBuyOrders = Game.market.getAllOrders(
                (order) => {
                    return order.type === ORDER_BUY && order.resourceType === RESOURCE_ENERGY
                        && Game.market.calcTransactionCost(1000, roomName, order.roomName) < 1000
                        && order.price > 0.2;
                }).sort(sortByTransactionCost);

            if(utriumBuyOrders.length > 0) {
                const order = getBestOrder();
                // const order = utriumBuyOrders[0];
                const energyStorageInTerminalAvailable = Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] - 100000;
                if(energyStorageInTerminalAvailable > 0) {
                    const transactionCost = Game.market.calcTransactionCost(Math.min(energyStorageInTerminalAvailable, order.amount), roomName, order.roomName);
                    Game.market.deal(order.id, Math.min(energyStorageInTerminalAvailable, order.amount), roomName);
                    console.log("Selling " + Math.min(energyStorageInTerminalAvailable, order.amount) + " energy to " + order.roomName + " at a cost of " + transactionCost + " energy.")
                }
            }
        }
    }


    function run() {

       if(Game.time % 10 === 0) {
           tradeResource();
           tradeEnergy();
       }
    }

    return {
        run: run
    }
})();

module.exports = trader;