var Countdown=function(){var l=function(a,f){for(var g=f-(""+a).length,c="",d=0;d<g;d++)c+="0";return c+a},D=function(a){var f,g,c,d,i,j,v,w,r="%D days %HH hours %MM minutes %SS seconds %UU miliseconds",m,x,b=null,n=0,o,s=0,p=10,q=1,h="init",y,t;for(o="date"===a.mode?["mode","endDate","nodeId"]:["mode","limit","nodeId"];n<o.length;n++)if(!(o[n]in a))return console.error(o[n]+" is required"),!1;m=a.mode;y=a.inactiveTab||!0;q=a.speed||1;p=(a.refreshRate&&10>a.refreshRate?10:a.refreshRate)||100;r=a.pattern||
r;s=a.limit;w=a.endDate;x=document.getElementById(a.nodeId);var B=function(k){var c=+new Date-t,k="undefined"!==typeof k?k:p;b=y&&c>k+10?b-c*q:b-k*q;0>=b?z():(A(),u(),a.onTick&&a.onTick(e),t=new Date)},A=function(){j=b%1E3/10|0;i=(b/1E3|0)%60;d=(b/6E4|0)%60;c=(b/36E5|0)%24;g=b/864E5|0},u=function(){var a=r,a=a.replace(/%HH/g,l(c,2)),a=a.replace(/%MM/g,l(d,2)),a=a.replace(/%SS/g,l(i,2)),a=a.replace(/%UU/g,l(j,2)),a=a.replace(/%D/g,g),a=a.replace(/%H/g,c),a=a.replace(/%M/g,d),a=a.replace(/%S/g,i),a=
a.replace(/%U/g,j);x.innerHTML=a},C=function(){clearInterval(f);h="stopped";a.onStop&&a.onStop(e)},z=function(){g=c=d=i=j=0;u();clearInterval(f);h="ended";a.onEnd&&a.onEnd(e)},e={getTimerId:function(){return f},getTime:function(){return{days:g,hours:c,minutes:d,seconds:i,miliseconds:j}},getState:function(){return h},start:function(){"date"===m?(v=a.startDate||new Date,b=w-v):"timer"===m&&null===b&&(b=s);t=new Date;"init"===h&&B(0);h="started";f=setInterval(function(){B(p)},p);a.onStart&&a.onStart(e);
0>=b&&z()},stop:C,setSpeed:function(a){q=a}};"timer"===m&&(e.reset=function(){h=null;b=s;A();u();C();a.onReset&&a.onReset(e)});return e};return function(a){return new D(a)}}();