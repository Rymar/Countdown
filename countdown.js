
/**
 * @author Mariusz Rymarczyk
 * @license MIT
 * @version 0.1
 */

var Countdown = (function () {

    'use strict';

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
        
        /* setInterval id */
        this._timerId = 0;
        /* days left */
        this._days = 0;
        /* hours left */
        this._hours = 0;
        /* minutes left */
        this._minutes = 0;
        /* seconds left */
        this._seconds = 0;
        /* miliseconds left */
        this._miliseconds = 0;
        /* start date Object */
        this._startDate = null;
        /* end date Object */
        this._endDate = null;
        /* how the date will be shown on page */
        this._pattern = '%D days %HH hours %MM minutes %SS seconds %UU miliseconds';
        /* mode of countdown: 'date' or 'timer' */
        this._mode = '';
        /* element where remaining time will be placed */
        this._node = null;
        /* in seconds or miliseconds, depends on settings */
        this._timeLeft = null;
        /* time limit for timer mode */
        this._limit = 0;
        /* step of interval, the more the better */
        this._refreshRate = 50;
        /* speed ratio*/
        this._speed = 1;
        /* state */
        this._state = 'init';
        /* date before changing tab */
        this._before = null;
        /* initial settings */
        this._settings = settings;
        /* loop flag */
        this._stopLoop = false;

        /* private */
        var /* iteration var */
            i = 0,
            /* required settings */
            required;

        required = settings.mode === 'date' ? ['mode', 'endDate'] : ['mode', 'limit'];

        /* check required fields */
        for ( ; i < required.length ; i++) {

            if (!(required[i] in settings)) {

                console.error(required[i] + ' is required');
                return false;
            }
        }

        /* initialization */

        this._mode = settings.mode;

        this._speed = settings.speed || 1;

        this._refreshRate = ((settings.refreshRate && settings.refreshRate < 10) ? 10 : settings.refreshRate) || 100;

        this._pattern = settings.pattern || this._pattern;
        
        this._limit = settings.limit;

        this._endDate = settings.endDate;
        
        this._node = document.getElementById(settings.nodeId);

    };

    Countdown.prototype = {

        getTimerId : function () { 
            return this._timerId; 
        },

        getTime : function () {

            return {
                days : this._days,
                hours : this._hours,
                minutes : this._minutes,
                seconds : this._seconds,
                miliseconds : this._miliseconds
            };

        },

        getState : function () {
            return this._state;
        },

        setSpeed : function (val) {
            this._speed = val;
        },

        /**
         * Executed by setInterval
         * @param timeStep number not required
         */
        _tick : function (timeStep) {

            var elapsedTime = +new Date() - this._before;

            this._timeLeft -= elapsedTime * this._speed;
            
            if(this._timeLeft <= 0) {
                this._end();
                return;
            }

            this._count();
            this._show();
            
            this._settings.onTick && this._settings.onTick(this);
           
            this._before = new Date();
        },

        /* start counting */
        start : function () {

            if (this._mode === 'date') {

                this._startDate = this._settings.startDate || new Date();

                this._timeLeft = this._endDate - this._startDate;

            } else if (this._mode === 'timer') {

                if (this._timeLeft === null) {
                    this._timeLeft = this._limit;
                }
            }

            this._before = new Date();
            this._state = 'started';

            var self = this;

            self._stopLoop = false;

            if(this._state === 'init'){
               this._tick(0);
            }

            this.prev = +new Date();

            var loop = function (refreshRate) {

                setTimeout(function () {
                    if (!self._stopLoop) {
                        self._tick(refreshRate);
                        loop(refreshRate);
                    }
                }, refreshRate);
            };

            loop(this._refreshRate);
            this._tick(this._refreshRate);

            this._settings.onStart && this._settings.onStart(this);

            if(this._timeLeft <= 0){
                this._end();
            }
        },

        _count : function () {

            this._miliseconds = (this._timeLeft%1000)/10 | 0;
            this._seconds = ((this._timeLeft/1000) | 0) % 60;
            this._minutes = ((this._timeLeft/600000) | 0) % 60;
            this._hours = ((this._timeLeft/3600000) | 0) % 24;
            this._days = (this._timeLeft/86400000) | 0;

        },

        _show : function () {

            if (!this._node) { return; }
            
            var content = this._pattern;

            content = content.replace(/%HH/g, fullFormat(this._hours, 2));
            content = content.replace(/%MM/g, fullFormat(this._minutes, 2));
            content = content.replace(/%SS/g, fullFormat(this._seconds, 2));
            content = content.replace(/%UU/g, fullFormat(this._miliseconds, 2));

            content = content.replace(/%D/g, this._days);
            content = content.replace(/%H/g, this._hours);
            content = content.replace(/%M/g, this._minutes);
            content = content.replace(/%S/g, this._seconds);
            content = content.replace(/%U/g, this._miliseconds);
          
            this._node.innerHTML = content;
        },

        /* stop counting */
        stop : function () {
            this._stopLoop = true;
            this._state = 'stopped';
            this._settings.onStop && this._settings.onStop(this);
        },

        /* end */
        _end : function () {
            this._days = this._hours = this._minutes = this._seconds = this._miliseconds = 0;
            this._show();
            this._stopLoop = true;
            this._state = 'ended';
            this._settings.onEnd && this._settings.onEnd(this);
        },

        /* reset exists only for timer mode, reset to original time */
        reset : function () {

            if(this._mode === 'date'){ return; }
            
            this._state = null;
            this._timeLeft = this._limit;
            this._count();
            this._show();
            this.stop();
            this._settings.onReset && this._settings.onReset(this);
        }
    }

    return function (settings) {
        return new Countdown(settings);
    };

})();