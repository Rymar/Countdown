This is my first github repo. It's a simple countdown class in JavaScript. What you can do with it? Basically there are two modes 'date' and 'timer'. First one will measure time between dates, second one, will measure time from some value in miliseconds to zero.

### Creating object:

- 'timer' mode:
        ```javascript
        var settings = {
            mode : 'timer', //required!!
            limit : number, //time limit in ms, required!!
            pattern : string, //how should presentation of countdown look like, default 
            //'%D days %HH hours %MM minutes %SS seconds %UU miliseconds'
    
            //%D - days from 0 to n
            //%HH, %H - hours
            //%MM, %M - minutes
            //%SS, %S - seconds
            //%UU, %U - miliseconds
    
            //if something has double letter, it means that 0's will be put before, e.g. 12:04:02 instead of 12:4:2
    
            nodeId : , //required, pattern will be placed in this node
            speed : 1, //default 1,
            precision, //default 100 ms, how much precise counter should be
            inactiveTab, //default true, should countdown work when tab is inactive
    
            //user events, and the first argument is current object
            onStop : function(countdownObject){}, 
            onReset : function(countdownObject){},
            onStart : function(countdownObject){},
            onTick : function(countdownObject){},
            onEnd : function(countdownObject){}
        };
        ```

- 'date' mode:

        ```javascript
        var settings = {
            mode : 'date',
            fromDate : , //default new Date(), so now 
            endDate : , //required
            ...
        };
        ```

There is no type checking so be careful with types.

-----------------------------------------------------------------------------

### On objects you can call:
- getTimerId() //returns interval id
- getTime()
  
  returns object with current time 

        {
            days : ,
            hours : ,
            minutes : ,
            seconds : ,
            miliseconds : ,
        } 

- start()
- stop()
- reset() //avaiable only for 'timer' mode
- setSpeed(number) //you can adjust speed, make it faster or slower