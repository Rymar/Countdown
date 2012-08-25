window.addEventListener('DOMContentLoaded', function () {

}, false);

var Countdown = (function () {

    //static private

    /**
     * Adding preceding zeros
     * @param val int 
     * @param n int ciphers in number
     */
    var fullFormat = function(val, n){

        var len = ('' + val).length,
            zeros = n - len,
            tmp = '';

        //mozna zaczac od drugiej cyfry bo pierwsza zawsze bedzie
        for(var i = 0 ; i < zeros ; i++){
            tmp += '0';
        }

        return tmp + val;
    };
    //zmienne prywatne statyczne

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
            start,
            /* end date Object */
            end,
            /* how the date will be showed on page */
            pattern = '%D days %HH hours %MM minutes %SS seconds %UU miliseconds',
            /* mode of countdown: 'date' or 'timer' */ /*REQUIRED!!*/
            mode, 
            /* element where remaining time will be placed */ /*REQUIRED!!*/
            node, 
            /* in seconds or miliseconds, depends on settings */
            timeLeft = null,
            /* current state */
            paused = false,
            /* iteration var */
            i = 0,
            /* required settings */
            required,
            /* time limit for timer mode */
            limit = 0,
            /* step of interval */
            precision = 10,
            /* speed ratio*/
            speed = 1,
            /* state */
            state = null,
            /* date before changing tab */
            before;


        /* initialization */
        required = settings.mode === 'date' ? ['mode', 'endDate', 'nodeId'] : ['mode', 'limit', 'nodeId'];

        /* check required fields */
        for (; i < required.length ; i++) {

            if (!(required[i] in settings)) {

                console.error(required[i] + ' is required');
                return false;
            }
        }

        mode = settings.mode;

        speed = settings.speed || 1;

        precision = ((settings.precision && settings.precision < 10) ? 10 : settings.precision) || 100;

        pattern = settings.pattern || pattern;
        
        limit = settings.limit;

        endDate = settings.endDate;
        
        node = document.getElementById(settings.nodeId);


        /* methods */
        var getId = function () { 
                return timerId; 
            },

            getLeftTime = function () {

                return {
                    days : days,
                    hours : hours,
                    minutes : minutes,
                    seconds : seconds,
                    miliseconds : miliseconds
                };

            },

            setSpeed = function(val){
                speed = val;
            },

            tick = function (timeStep) {

                var elapsedTime = new Date() - before,
                    tStep = typeof timeStep !== 'undefined' ? timeStep : precision;

                //fixing inactive tab time
                if(elapsedTime > tStep){
                    timeLeft -= elapsedTime * speed;
                } else {
                    timeLeft -= tStep * speed; 
                }

                if(timeLeft <= 0){
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
                if(state === null){
                    tick(0);
                    state = 'started';
                }

                

                timerId = setInterval(function(){
                    tick(precision);
                }, precision);


                settings.onStart && settings.onStart(ret);

                if(timeLeft <= 0){
                    end();
                }
            },
            count = function(){

                miliseconds = (timeLeft%1000)/10 | 0;
                seconds = ((timeLeft/1000) | 0) % 60;
                minutes = ((timeLeft/60000) | 0) % 60;
                hours = ((timeLeft/3600000) | 0) % 24;
                days = (timeLeft/86400000) | 0;

            },
            show = function(){
                
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
                settings.onStop && settings.onStop(ret);
            },

            /* end */
            end = function(){
                days = hours = minutes = seconds = miliseconds = 0;
                show();
                clearInterval(timerId);
                settings.onEnd && settings.onEnd(ret);
            },
            /* reset exists only for timer mode, reset to original time */
            reset = function () {
                timeLeft = limit;
                count();
                show();
                settings.onReset && settings.onReset(ret);
            };

        /* public methods & properties */
        var ret = {
            getId : getId,
            getLeftTime : getLeftTime,
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

/*

speed ?


There is no type checking

var settings = {
    mode : 'date',
    endDate : , //required
    pattern : , //default "{%DD days %HH hours %MM minutes %SS seconds}"
                //%DD %HH %MM %SS preceded by zero
    nodeId : , //html id node required
    onStop : , //user events
    onReset : ,
    onStart : ,
    onTick : ,
    onEnd :,
    step : //default 1s
};

do eventow mozna dodac jako pierwszy argument parametr this moze komus sie przyda

//zrobic druga wersje tego samego na prototype i nie dawac return tylko wszystkie pola musza byc publiczne lub wiekszosc i poprzedzic
//je _ zeby mozna bylo latwo odroznic je od siebie

//na odrebnej galezi

var settings = {
    mode : 'timer',
    limit : ,// ms
    pattern : ,//
    nodeId : //
    onStop : , //user events
    onReset : ,
    onStart : ,
    onTick : ,
    onEnd :
};

*/

//inactiveTab

//dodac prototype ? zastanowic sie nad funkcjami wspolnymi

/**
 * There are two modes:
 * - date, which counts from now to 'dateTo' date
 * - timer, which counts from 'start' time to 0
 */

//reset, przy statusie zatrzymany powinno ladnie odswiezyc widok