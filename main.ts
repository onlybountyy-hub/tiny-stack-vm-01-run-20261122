// Tiny stack VM (ISA v1) for make.fun tiny-stack-vm-01-run-20261122.
// Answers a whole 40-instance set in one run: /input/<id>/program.bin +
// input.bin -> /output/<id>/stdout.bin + exit.txt. Node 22, built-ins only.
// Pre-decodes every byte position once (a jump may land mid-immediate),
// then runs a tight dispatch loop over typed arrays.
import {mkdirSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
const OUT=new Uint8Array(65536),DG=new Uint8Array(11);
let olen=0;
function run(p,inp){
  const n=p.length;
  const op=new Int16Array(n),im=new Int32Array(n),nx=new Int32Array(n),
        po=new Uint8Array(n),pu=new Uint8Array(n),bd=new Uint8Array(n);
  for(let i=0;i<n;i++){
    const b=p[i];
    const k=b<=7||(b>=16&&b<=34)||(b>=48&&b<=52)||b===64||b===65||(b>=80&&b<=83);
    const m=b===1?1:b===2?4:b>=48&&b<=51?2:0;
    op[i]=k?b:-1;
    bd[i]=k&&i+m>=n?1:0;
    nx[i]=i+1+m;
    let q=0,w=0;
    if(b===3||b===4||b===23||b===27||b===49||b===50||b===64||b===80||b===81||b===83)q=1;
    else if(b===7)q=3;
    else if(b===5||b===6||b===65||(b>=16&&b<=22)||(b>=24&&b<=26)||(b>=28&&b<=30)||(b>=32&&b<=34))q=2;
    if(b===1||b===2||(b>=16&&b<=34)||b===64||b===82)w=1;
    if(b===4||b===5)w=2;
    if(b===6||b===7)w=3;
    po[i]=q;pu[i]=w;
    if(b===1)im[i]=(p[i+1]<<24)>>24;
    else if(b===2)im[i]=p[i+1]|p[i+2]<<8|p[i+3]<<16|p[i+4]<<24;
    else if(b>=48&&b<=50)im[i]=(p[i+1]|p[i+2]<<8)<<16>>16;
    else if(b===51)im[i]=p[i+1]|p[i+2]<<8;
  }
  const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256);
  let sp=0,cp=0,ip=0,pc=0,s=0;
  olen=0;
  for(;;){
    if(s===1e6)return 10;
    if(pc<0||pc>=n)return 9;
    const o=op[pc];
    if(o<0)return 5;
    if(bd[pc])return 9;
    s++;
    if(sp<po[pc])return 2;
    if(sp-po[pc]+pu[pc]>256)return 3;
    const c=pc;pc=nx[c];
    switch(o){
      case 0:return 0;
      case 1:case 2:D[sp++]=im[c];break;
      case 3:sp--;break;
      case 4:D[sp]=D[sp-1];sp++;break;
      case 5:{const t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t;break;}
      case 6:D[sp]=D[sp-2];sp++;break;
      case 7:{const a=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=a;break;}
      case 23:D[sp-1]=-D[sp-1]|0;break;
      case 27:D[sp-1]=~D[sp-1];break;
      case 16:case 17:case 18:case 19:case 20:case 21:case 22:
      case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
        const b=D[sp-1],a=D[sp-2];let r=0;
        switch(o){
          case 16:r=a+b|0;break;
          case 17:r=a-b|0;break;
          case 18:r=Math.imul(a,b);break;
          case 19:if(!b)return 4;r=a===-2147483648&&b===-1?a:a/b|0;break;
          case 20:if(!b)return 4;r=b===-1?0:a%b|0;break;
          case 21:if(!b)return 4;r=Math.floor((a>>>0)/(b>>>0))|0;break;
          case 22:if(!b)return 4;r=(a>>>0)%(b>>>0)|0;break;
          case 24:r=a&b;break;
          case 25:r=a|b;break;
          case 26:r=a^b;break;
          case 28:r=a<<(b&31);break;
          case 29:r=a>>(b&31);break;
          case 30:r=a>>>(b&31)|0;break;
          case 32:r=a===b?1:0;break;
          case 33:r=a<b?1:0;break;
          case 34:r=(a>>>0)<(b>>>0)?1:0;break;
        }
        sp-=2;D[sp++]=r;break;
      }
      case 48:pc+=im[c];break;
      case 49:{const v=D[--sp];if(!v)pc+=im[c];break;}
      case 50:{const v=D[--sp];if(v)pc+=im[c];break;}
      case 51:if(cp===64)return 7;C[cp++]=pc;pc=im[c];break;
      case 52:if(!cp)return 8;pc=C[--cp];break;
      case 64:{const a=D[sp-1];if(a<0||a>255)return 6;D[sp-1]=M[a];break;}
      case 65:{const a=D[sp-1];if(a<0||a>255)return 6;sp-=2;M[a]=D[sp];break;}
      case 80:{
        const v=D[sp-1],ng=v<0;let m=ng?-v:v,L=0;
        do{DG[L++]=48+m%10;m=(m/10)|0;}while(m>0);
        if(ng)L++;
        if(olen+L>65536)return 11;
        sp--;
        if(ng)OUT[olen++]=45;
        for(let k=L-(ng?1:0)-1;k>=0;k--)OUT[olen++]=DG[k];
        break;
      }
      case 81:if(olen+1>65536)return 11;OUT[olen++]=D[--sp]&255;break;
      case 82:D[sp++]=ip<inp.length?inp[ip++]:-1;break;
      case 83:return D[--sp]&255;
    }
  }
}
for(const id of readdirSync(I).sort()){
  const e=run(readFileSync(join(I,id,'program.bin')),readFileSync(join(I,id,'input.bin')));
  mkdirSync(join(O,id),{recursive:true});
  writeFileSync(join(O,id,'stdout.bin'),OUT.subarray(0,olen));
  writeFileSync(join(O,id,'exit.txt'),e+'\n');
}
