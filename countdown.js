
/**
 * @author Mariusz Rymarczyk
 * @license MIT
 * @version 0.1
 */

'use strict';

var Countdown = (function () {

    /**
     * Adding preceding zeros
     * @param val int 
     * @param n int ciphers in number
     */
    var fullFormat = function (val, n) {

        var len = ('' + val).length,
            zeros = n - len,
            tmp = '',
            i = 0;

        for ( ; i < zeros ; i++) {
            tmp += '0';
        }

        return tmp + val;
    };

    var Countdown = function (settings) {

        var /* setInterval id */
            timerId,
            /* days left */
            days,
            /* hours left */
            hours,
            /* minutes left */
            minutes,
            /* seconds left */
            seconds,
            /* miliseconds left */
            miliseconds,
            /* start date Object */
            startDate,
            /* end date Object */
            endDate,
            /* how the date will be showed on page */
            pattern = '%D days %HH hours %MM minutes %SS seconds %UU miliseconds',
            /* mode of countdown: 'date' or 'timer' */ /*REQUIRED!!*/
            mode, 
            /* element where remaining time will be placed */ /*REQUIRED!!*/
            node, 
            /* in seconds or miliseconds, depends on settings */
            timeLeft = null,
            /* iteration var */
            i = 0,
            /* required settings */
            required,
            /* time limit for timer mode */
            limit = 0,
            /* step of interval */
            refreshRate = 10,
            /* speed ratio*/
            speed = 1,
            /* state */
            state = 'init',
            /* inactiveTab */
            inactiveTab,
            /* date before changing tab */
            before;

        required = settings.mode === 'date' ? ['mode', 'endDate', 'nodeId'] : ['mode', 'limit', 'nodeId'];

        /* check required fields */
        for ( ; i < required.length ; i++) {

            if (!(required[i] in settings)) {

                console.error(required[i] + ' is required');
                return false;
            }
        }

        /* initialization */

        mode = settings.mode;

        inactiveTab = settings.inactiveTab || true;

        speed = settings.speed || 1;

        refreshRate = ((settings.refreshRate && settings.refreshRate < 10) ? 10 : settings.refreshRate) || 100;

        pattern = settings.pattern || pattern;
        
        limit = settings.limit;

        endDate = settings.endDate;
        
        node = document.getElementById(settings.nodeId);

        /* methods */
        var getTimerId = function () { 
                return timerId; 
            },

            getTime = function () {

                return {
                    days : days,
                    hours : hours,
                    minutes : minutes,
                    seconds : seconds,
                    miliseconds : miliseconds
                };

            },

            getState = function () {
                return state;
            },

            setSpeed = function (val) {
                speed = val;
            },

            /**
             * Executed by setInterval
             * @param timeStep number not required
             */
            tick = function (timeStep) {

                var elapsedTime = +new Date() - before,
                    tStep = typeof timeStep !== 'undefined' ? timeStep : refreshRate;

                //fixing inactive tab time
                if (inactiveTab && (elapsedTime > tStep + 10) ) {
                    timeLeft -= elapsedTime * speed;
                } else {
                    timeLeft -= tStep * speed; 
                }

                if(timeLeft <= 0) {
                    end();
                    return;
                }

                count();
                show();
                
                settings.onTick && settings.onTick(ret);
               
                before = new Date();
            },

            /* start counting */
            start = function () {

                if (mode === 'date') {

                    startDate = settings.startDate || new Date();

                    timeLeft = endDate - startDate;

                } else if (mode === 'timer') {

                    if (timeLeft === null) {
                        timeLeft = limit;
                    }
                }

                before = new Date();

                if(state === 'init'){
                    tick(0);
                }

                state = 'started';

                timerId = setInterval(function(){
                    tick(refreshRate);
                }, refreshRate);

                settings.onStart && settings.onStart(ret);

                if(timeLeft <= 0){
                    end();
                }
            },

            count = function () {

                miliseconds = (timeLeft%1000)/10 | 0;
                seconds = ((timeLeft/1000) | 0) % 60;
                minutes = ((timeLeft/60000) | 0) % 60;
                hours = ((timeLeft/3600000) | 0) % 24;
                days = (timeLeft/86400000) | 0;

            },

            show = function () {
                
                var content = pattern;

                content = content.replace(/%HH/g, fullFormat(hours, 2));
                content = content.replace(/%MM/g, fullFormat(minutes, 2));
                content = content.replace(/%SS/g, fullFormat(seconds, 2));
                content = content.replace(/%UU/g, fullFormat(miliseconds, 2));

                content = content.replace(/%D/g, days);
                content = content.replace(/%H/g, hours);
                content = content.replace(/%M/g, minutes);
                content = content.replace(/%S/g, seconds);
                content = content.replace(/%U/g, miliseconds);
              
                node.innerHTML = content;
            },

            /* stop counting */
            stop = function () {
                clearInterval(timerId);
                state = 'stopped';
                settings.onStop && settings.onStop(ret);
            },

            /* end */
            end = function () {
                days = hours = minutes = seconds = miliseconds = 0;
                show();
                clearInterval(timerId);
                state = 'ended';
                settings.onEnd && settings.onEnd(ret);
            },

            /* reset exists only for timer mode, reset to original time */
            reset = function () {
                state = null;
                timeLeft = limit;
                count();
                show();
                stop();
                settings.onReset && settings.onReset(ret);
            };

        /* public methods & properties */
        var ret = {
            getTimerId : getTimerId,
            getTime : getTime,
            getState : getState,
            start : start,
            stop : stop,
            setSpeed : setSpeed
        };

        if(mode === 'timer') {
            ret.reset = reset;
        }

        return ret;
    };

    return function (settings) {
        return new Countdown(settings);
    };

})();