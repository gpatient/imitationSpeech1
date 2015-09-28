
/**
 * @name imitationSpeech1
 * @arthor gpatient
 * @version 0.011
 */
 import biquad from 'opendsp/biquad';
 
 
var vcf = new Biquad('bpf');
var osc = Saw();

vcf
  .cut(700)
  .res(15)
  .gain(3)
  .update();
  

function filterBank(snd)
{
  var out;
  
  out = vcf.update().run(snd);
  return out;
  
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
var fr=30000;

export function dsp(t) {
  var i;
  for(i=0;i<10;i++)
  arr[i]=Math.abs(400*lfNoise(t,fr,i))+100;
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

  vv1=Math.sin(tau*t*arr[6]/500)*20.3+Math.sin(tau*t*arr[7]/400)*50; 
  snd2=Math.sin(tau*t*arr[5])*Math.sin(t*tau/2*arr[7]/200+vv1)*0.3; 

  //if(snd1!=0)
  //snd=Math.random()*0.3*snd1*snd2;
  snd=(snd1*(snd2-0.0013))*5;
  //snd=filterBank(snd);
  //snd=lfNoise(t,70000,0);;
  return snd;
}
