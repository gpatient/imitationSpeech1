
/**
 * @name imitationSpeech1
 * @arthor gpatient
 * @version 0.022
 */
 import Biquad from 'opendsp/biquad';
 import dbg from 'debug';
//this.aff="document";
//var err=this.aff;
//dbg('document')(" "+(object HTMLDocument));   
//this.parent.setAttribute("id", "iframeResult"); 
//dbg('asdf')(new Canvas());
dbg('arrtest ')(([[2,3,[1,2,[1,2,3],3],4],[3,4]][0][0]+4)+" "+ Math.sqrt([10,4,5][0]));
dbg('time ')(" \"&lt; &gt;"+Date()); 
dbg('getMilliseconds ')(" "+(new Date()).getMilliseconds());            
//dbg('qqq ')(" "+(new Date()).parent.parent);
var millisec=(new Date()).getMilliseconds();
for(i=0;i<millisec+13300;i++)Math.random();
dbg('Canvas ')(" "+Math['random'].call(0)+" "+(function(){return (new Date());})()['getMilliseconds']());                
          
var vcf =[];
var i=0;
for(i=0;i<5;i++){
  vcf[i]=new Biquad('bpf');
  vcf[i].cut(700) .res(15).gain(3).update(); 
}

function filterBank(snd,fn,mm)
{
  var out=0;
  var oo=[];
  // vowel a
  var ff=[650, 1080, 2650, 2900, 3250];
  var am=[ 1, 0.50118723362727, 0.44668359215096, 0.3981071705535, 0.079432823472428 ];
  var bw=[ 10, 12.777777777778, 24.166666666667, 30, 35.357142857143 ];
  if(fn==1){//vowel i
    ff=[290, 1870, 2800, 3250, 3540];
    am=[ 1, 0.17782794100389, 0.12589254117942, 0.1, 0.031622776601684 ];
    bw=[ 7.25, 20.777777777778, 28, 27.083333333333, 29.5 ];
  }
  else if(fn==2){// vowel e
    ff=[400, 1700, 2600, 3200, 3580];
    am=[ 1, 0.19952623149689, 0.25118864315096, 0.19952623149689, 0.1 ];
    bw=[ 5.7142857142857, 21.25, 26, 26.666666666667, 29.833333333333 ];
  
  }
  //q= cut/bw  res
  for(i=0;i<5;i++){
    vcf[i].cut(ff[i]+mm).res(bw[i]*(mm/100+1)).update();
    oo[i] = vcf[i].update().run(snd)*am[i];
    out+=oo[i];
    
  }
  return out*3;
  
}

var tau=3.141592*2;
var snd=0,snd2=0,snd1,mm,mm2=0,mm3,vv1=0;
  
function latch2(measher){
    if (!(this instanceof latch2)) return new latch2(measher);
  
  this.chk=0;
  this.measher=measher;
  this.val=0;
}

latch2.prototype.run=function (t,val){
    var ret=0;
    if((Math.round(t*1000000)%(this.measher*10))<100){if(this.chk===0)this.val=val;this.chk=1;}
    else{this.chk=0;}
    ret=this.val;
    return ret;
  };

var lat1=[];// latch2(70);
var i;
for(i=0;i<10;i++)lat1[i]=latch2(70);

function lfNoise(t,freq,num)
{
  lat1[num].measher=freq;
  return lat1[num].run(t,Math.random());
}
var arr=[];
var fr=130000;

export function dsp(t) {
  var i;
  for(i=0;i<10;i++)
  arr[i]=Math.abs(500*lfNoise(t,fr,i))+100;
  fr+=1;
  if(fr>150000)fr=30000;
/*  
  mm3=Math.sin(tau*t*240)*Math.sin(t*tau/2*1.63*450)*0.3;
  mm2=Math.sin(tau*t*240+mm3*2)*Math.sin(t*tau/2*2)*0.3;
  mm=Math.sin(tau*t*340+mm2*40);
  snd1=Math.sin(tau*t*340+mm)*Math.sin(t*tau/2)*0.3;
  vv1=Math.sin(tau*t*0.5)*20.3+Math.sin(tau*t*0.8)*50;
  snd2=Math.sin(tau*t*240)*Math.sin(t*tau/2*1.63+vv1)*0.3; 

*/
  mm3=Math.sin(tau*t*arr[0])*Math.sin(t*tau/2*1.63*arr[1])*0.3;
  mm2=Math.sin(tau*t*arr[2]+mm3*2)*Math.sin(t*tau/2*2)*0.3;
  mm=Math.sin(tau*t*arr[3]+mm2*4);
  snd1=Math.sin(tau*t*arr[4]+mm)*Math.sin(t*tau/2)*0.3;

  vv1=Math.sin(tau*t*arr[6]/800)*20.3+Math.sin(tau*t*arr[7]/700)*50; 
  snd2=Math.sin(tau*t*arr[5])*Math.sin(t*tau/2*arr[7]/300+vv1)*0.3; 

  //if(snd1!=0)
  //snd=Math.random()*0.3*snd1*snd2;
  snd=snd1*(snd1*(snd2-0.0013))*5;
  //snd=Math.random()*0.6;
  snd=filterBank(snd,Math.floor(arr[8]/270),snd2*150)*4;
  //snd=lfNoise(t,70000,0);;
  return snd;
}
