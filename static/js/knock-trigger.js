var knockTrigger = (function() {
    var triggered = false;

    var clickPattern = [];
    var triggerAttribute, triggerPattern;

    var setTriggerAttribute = function(attr) {
        triggerAttribute = attr;
    };

    var setTriggerPattern = function(pattern) {
        triggerPattern = pattern;
    };

    var knockClickHandler = function (event) {
        if (!triggered) {
            clickPattern.push(this.getAttribute(triggerAttribute));
            while (clickPattern.length > triggerPattern.length) {
                clickPattern.shift();
            }
            var is_same = (clickPattern.length == triggerPattern.length) &&
                clickPattern.every(function(element, index) {
                    return element === triggerPattern[index];
                });
            if (is_same) {
                console.log("pattern match. Will trigger!");
                triggered = true;
            }
        } else {
            console.log("already triggered");
        }
        console.log(`triggerPattern: ${triggerPattern}, clickPattern: ${clickPattern}, triggered: ${triggered}`);

        // else:
        //    dispatch special mode function
    };

    return {
        triggered: triggered,
        knockClickHandler: knockClickHandler,
        setTriggerAttribute: setTriggerAttribute,
        setTriggerPattern: setTriggerPattern
    };
})();
