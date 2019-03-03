const trader = (function () {

    const minEnergySellPrice = 0.4;
    const minUtriumSellPrice = 0.15;

    function tradeResource() {
        for (let roomName in Game.rooms) {
            if(typeof Game.rooms[roomName].terminal !== 'undefined') {
                const utriumBuyOrders = Game.market.getAllOrders(
                    (order) => {
                        return order.type === ORDER_BUY && order.resourceType === RESOURCE_UTRIUM
                            && Game.market.calcTransactionCost(1000, roomName, order.roomName) < 500
                            && order.price > minUtriumSellPrice;
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
    }

    function tradeEnergy() {
        for (let roomName in Game.rooms) {
            if(typeof Game.rooms[roomName].terminal !== 'undefined' && thereIsEnoughEnergyToTrade(roomName)) {
                const sortByProfitability = (orderA, orderB) => {
                    const orderAProfitability = orderA.price / (Game.market.calcTransactionCost(1000, roomName, orderA.roomName) + 1000);
                    const orderBProfitability = orderB.price / (Game.market.calcTransactionCost(1000, roomName, orderB.roomName) + 1000);
                    return orderBProfitability - orderAProfitability;
                };
                const energyBuyOrders = Game.market.getAllOrders(
                    (order) => {
                        return order.type === ORDER_BUY && order.resourceType === RESOURCE_ENERGY
                            && Game.market.calcTransactionCost(1000, roomName, order.roomName) < 1000
                            && order.price > minEnergySellPrice;
                    }).sort(sortByProfitability);

                if(energyBuyOrders.length > 0) {
                    // const order = getBestOrder();
                    const order = energyBuyOrders[0];
                    const energyStorageInTerminalAvailable = Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] - 50000;
                    if(energyStorageInTerminalAvailable > 0) {
                        const transactionCost = Game.market.calcTransactionCost(Math.min(energyStorageInTerminalAvailable, order.amount), roomName, order.roomName);
                        Game.market.deal(order.id, Math.min(energyStorageInTerminalAvailable, order.amount), roomName);
                        console.log("Selling " + Math.min(energyStorageInTerminalAvailable, order.amount) + " energy to " + order.roomName + " at a cost of " + transactionCost + " energy.")
                    }
                }
            }
        }
    }

    function thereIsEnoughEnergyToTrade(roomName) {
        let energyInStorage = 0;
        if(typeof Game.rooms[roomName].storage !== 'undefined') {
            energyInStorage = Game.rooms[roomName].storage.store[RESOURCE_ENERGY];
        }
        let energyInTerminal = 0;
        if(typeof Game.rooms[roomName].terminal !== 'undefined') {
            energyInTerminal = Game.rooms[roomName].terminal.store[RESOURCE_ENERGY];
        }
        return energyInStorage + energyInTerminal > 400000;
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