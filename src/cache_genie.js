const cacheGenie = (function(){

    function getResourceSourceClosestToController(room) {
        if(typeof Memory[room.name] === 'undefined') {
            Memory[room.name] = {};
        }
        if(typeof Memory[room.name].resourceClosestToController === 'undefined') {
            let source = room.controller.pos.findClosestByPath(FIND_SOURCES);
            if(source === null) {
                source = room.controller.pos.findClosestByRange(FIND_SOURCES);
            }
            Memory[room.name].resourceClosestToController = source.id;
        }
        return Memory[room.name].resourceClosestToController;
    }

    return {
        getResourceSourceClosestToController: getResourceSourceClosestToController
    }
})();

module.exports = cacheGenie;