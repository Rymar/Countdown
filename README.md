It's a simple countdown module in JavaScript. What you can do with it? Basically there are two modes 'date' and 'timer'. First one will measure time between dates, second one measure time from some value in miliseconds to zero.

### Creating object:
- 'timer' mode:
```javascript       
        var settings = {
            mode : 'timer', //required!!
            limit : number, //time limit in ms, required!!
            pattern : string, //pattern format, default 
            //'%D days %HH hours %MM minutes %SS seconds %UU miliseconds'
    
            //%D - days from 0 to n
            //%HH, %H - hours
            //%MM, %M - minutes
            //%SS, %S - seconds
            //%UU, %U - miliseconds
    
            //if something has double letter, it means that 0's will be put before, e.g. 12:04:02 instead of 12:4:2
    
            nodeId : 'timer', //string, pattern will be placed in this node
            speed : 1, //default 1,
            refreshRate: 50, //number, default 50 ms, how often counter should be refreshed
            inactiveTab, //boolean, default true, should countdown work when tab is inactive
    
            //user events, and the first argument is current object
            onStop : function(countdownObject){}, 
            onReset : function(countdownObject){},
            onStart : function(countdownObject){},
            onTick : function(countdownObject){},
            onEnd : function(countdownObject){}
        };

        var ob = new Countdown(settings);
```
   

- 'date' mode:
```javascript
    var settings = {
        mode : 'date',
        startDate : , //Date object, default new Date(),
        endDate : , //Date object required!!, 
        ...
    };
```

There is no type checking so be careful with types.

-----------------------------------------------------------------------------

### On objects you can call:
- getTimerId() //returns interval id
- getState() //returns current state init, started, stopped, ended
- getTime()
  
  returns object with current time 

        {
            days : 1,
            hours : 11,
            minutes : 16,
            seconds : 12,
            miliseconds : 23,
        } 

- start()
- stop()
- reset() //avaiable only for 'timer' mode
- setSpeed(number) //you can adjust speed, make it faster or slower
 
### Example:
http://jsfiddle.net/Rymar/H8fxU/7/show/
