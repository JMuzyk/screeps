const enums = (function(){

    const CreepType = (function () {
        const obj = {};
        obj.BUILDER = 'builder';
        obj.UPGRADER = 'upgrader';
        obj.HARVESTER = 'harvester';
        obj.FIGHTER = 'fighter';
        obj.MINER = 'miner';
        obj.MINERAL_HARVESTER = 'mineral_harvester';
        obj.CARRIER = 'carrier';
        Object.freeze(obj);
        return obj;
    })();

    return {
        CreepType: CreepType
    }
})();

module.exports = enums;