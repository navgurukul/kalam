import{aE as r,aF as i,a as M,aG as o,_ as Y,aH as e}from"./vendor.5ff35c24.js";function m(){var n=e([`
  height: `,`px;
  width: `,`px;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  .spinner-inner {
    position: relative;
    display: block;
    height: 100%;
    width: 100%;
  }

  .spinner-circle {
    display: block;
    position: absolute;
    color: `,`;
    font-size: calc(`,`px * 0.24);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .spinner-line {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation-duration: `,`ms;
    border-left-width: calc(`,`px / 25);
    border-top-width: calc(`,`px / 25);
    border-left-color: `,`;
    border-left-style: solid;
    border-top-style: solid;
    border-top-color: transparent;
  }

  .spinner-line:nth-child(1) {
    animation: atom-spinner-animation-1 `,`ms
      linear infinite;
    transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg);
  }

  .spinner-line:nth-child(2) {
    animation: atom-spinner-animation-2 `,`ms
      linear infinite;
    transform: rotateZ(240deg) rotateX(66deg) rotateZ(0deg);
  }

  .spinner-line:nth-child(3) {
    animation: atom-spinner-animation-3 `,`ms
      linear infinite;
    transform: rotateZ(360deg) rotateX(66deg) rotateZ(0deg);
  }

  @keyframes atom-spinner-animation-1 {
    100% {
      transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg);
    }
  }
  @keyframes atom-spinner-animation-2 {
    100% {
      transform: rotateZ(240deg) rotateX(66deg) rotateZ(360deg);
    }
  }
  @keyframes atom-spinner-animation-3 {
    100% {
      transform: rotateZ(360deg) rotateX(66deg) rotateZ(360deg);
    }
  }
`]);return m=function(){return n},n}r.div(m(),function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.animationDuration},function(n){return n.animationDuration});i.number,i.number,i.string,i.string,i.object;function f(){var n=e([`
  height: `,`px;
  width: `,`px;
  position: relative;
  transform: rotate(45deg);

  * {
    box-sizing: border-box;
  }

  .rhombus {
    height: calc(`,`px / 7.5);
    width: calc(`,`px / 7.5);
    animation-duration: `,`ms;
    top: calc(`,`px / 2.3077);
    left: calc(`,`px / 2.3077);
    background-color: `,`;
    position: absolute;
    animation-iteration-count: infinite;
  }

  .rhombus:nth-child(2n + 0) {
    margin-right: 0;
  }

  .rhombus.child-1 {
    animation-name: breeding-rhombus-spinner-animation-child-1;
    animation-delay: calc(`,`ms * 1);
  }

  .rhombus.child-2 {
    animation-name: breeding-rhombus-spinner-animation-child-2;
    animation-delay: calc(`,`ms * 2);
  }

  .rhombus.child-3 {
    animation-name: breeding-rhombus-spinner-animation-child-3;
    animation-delay: calc(`,`ms * 3);
  }

  .rhombus.child-4 {
    animation-name: breeding-rhombus-spinner-animation-child-4;
    animation-delay: calc(`,`ms * 4);
  }

  .rhombus.child-5 {
    animation-name: breeding-rhombus-spinner-animation-child-5;
    animation-delay: calc(`,`ms * 5);
  }

  .rhombus.child-6 {
    animation-name: breeding-rhombus-spinner-animation-child-6;
    animation-delay: calc(`,`ms * 6);
  }

  .rhombus.child-7 {
    animation-name: breeding-rhombus-spinner-animation-child-7;
    animation-delay: calc(`,`ms * 7);
  }

  .rhombus.child-8 {
    animation-name: breeding-rhombus-spinner-animation-child-8;
    animation-delay: calc(`,`ms * 8);
  }

  .rhombus.big {
    height: calc(`,`px / 3);
    width: calc(`,`px / 3);
    animation-duration: `,`ms;
    top: calc(`,`px / 3);
    left: calc(`,`px / 3);
    background-color: `,`;
    animation: breeding-rhombus-spinner-animation-child-big
      `,` infinite;
    animation-delay: 0.5s;
  }

  @keyframes breeding-rhombus-spinner-animation-child-1 {
    50% {
      transform: translate(-325%, -325%);
    }
  }
  @keyframes breeding-rhombus-spinner-animation-child-2 {
    50% {
      transform: translate(0, -325%);
    }
  }
  @keyframes breeding-rhombus-spinner-animation-child-3 {
    50% {
      transform: translate(325%, -325%);
    }
  }
  @keyframes breeding-rhombus-spinner-animation-child-4 {
    50% {
      transform: translate(325%, 0);
    }
  }
  @keyframes breeding-rhombus-spinner-animation-child-5 {
    50% {
      transform: translate(325%, 325%);
    }
  }
  @keyframes breeding-rhombus-spinner-animation-child-6 {
    50% {
      transform: translate(0, 325%);
    }
  }
  @keyframes breeding-rhombus-spinner-animation-child-7 {
    50% {
      transform: translate(-325%, 325%);
    }
  }
  @keyframes breeding-rhombus-spinner-animation-child-8 {
    50% {
      transform: translate(-325%, 0);
    }
  }
  @keyframes breeding-rhombus-spinner-animation-child-big {
    50% {
      transform: scale(0.5);
    }
  }
`]);return f=function(){return n},n}r.div(f(),function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.delayModifier},function(n){return n.delayModifier},function(n){return n.delayModifier},function(n){return n.delayModifier},function(n){return n.delayModifier},function(n){return n.delayModifier},function(n){return n.delayModifier},function(n){return n.delayModifier},function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration});i.number,i.number,i.string,i.string,i.object;function d(){var n=e([`
  height: `,`px;
  width: `,`px;
  display: flex;
  align-items: center;
  justify-content: center;

  * {
    box-sizing: border-box;
  }

  .circle {
    height: `,`px;
    width: `,`px;
    margin-left: `,`px;
    transform: rotate(45deg);
    border-radius: 10%;
    border: 3px solid `,`;
    overflow: hidden;
    background: transparent;
    animation: circles-to-rhombuses-animation
      `,`ms linear infinite;
  }
  .circle:nth-child(1) {
    animation-delay: calc(`,`ms * 1);
    margin-left: 0;
  }
  .circle:nth-child(2) {
    animation-delay: calc(`,`ms * 2);
  }
  .circle:nth-child(3) {
    animation-delay: calc(`,`ms * 3);
  }
  @keyframes circles-to-rhombuses-animation {
    0% {
      border-radius: 10%;
    }
    17.5% {
      border-radius: 10%;
    }
    50% {
      border-radius: 100%;
    }
    93.5% {
      border-radius: 10%;
    }
    100% {
      border-radius: 10%;
    }
  }
`]);return d=function(){return n},n}r.div(d(),function(n){return n.size},function(n){return(n.size+n.circleMarginLeft)*n.circleNum},function(n){return n.size},function(n){return n.size},function(n){return n.circleMarginLeft},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.delay},function(n){return n.delay},function(n){return n.delay});i.number,i.number,i.string,i.string,i.object;function p(){var n=e([`
  height: `,`px;
  width: `,`px;
  padding: `,`px;
  overflow: hidden;
  position: relative;

  * {
    box-sizing: border-box;
  }

  .spinner-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: `,`;
    animation: fingerprint-spinner-animation
      `,`ms
      cubic-bezier(0.68, -0.75, 0.265, 1.75) infinite forwards;
    margin: auto;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }
  .spinner-ring:nth-child(1) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 1);
  }
  .spinner-ring:nth-child(2) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 2);
  }
  .spinner-ring:nth-child(3) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 3);
  }
  .spinner-ring:nth-child(4) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 4);
  }
  .spinner-ring:nth-child(5) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 5);
  }
  .spinner-ring:nth-child(6) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 6);
  }
  .spinner-ring:nth-child(7) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 7);
  }
  .spinner-ring:nth-child(8) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 8);
  }
  .spinner-ring:nth-child(9) {
    height: `,`px;
    width: `,`px;
    animation-delay: calc(50ms * 9);
  }

  @keyframes fingerprint-spinner-animation {
    100% {
      transform: rotate(360deg);
    }
  }
`]);return p=function(){return n},n}r.div(p(),function(n){return n.size},function(n){return n.size},function(n){return n.containerPadding},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.ringBase+0*n.ringBase},function(n){return n.ringBase+0*n.ringBase},function(n){return n.ringBase+1*n.ringBase},function(n){return n.ringBase+1*n.ringBase},function(n){return n.ringBase+2*n.ringBase},function(n){return n.ringBase+2*n.ringBase},function(n){return n.ringBase+3*n.ringBase},function(n){return n.ringBase+3*n.ringBase},function(n){return n.ringBase+4*n.ringBase},function(n){return n.ringBase+4*n.ringBase},function(n){return n.ringBase+5*n.ringBase},function(n){return n.ringBase+5*n.ringBase},function(n){return n.ringBase+6*n.ringBase},function(n){return n.ringBase+6*n.ringBase},function(n){return n.ringBase+7*n.ringBase},function(n){return n.ringBase+7*n.ringBase},function(n){return n.ringBase+8*n.ringBase},function(n){return n.ringBase+8*n.ringBase});i.number,i.number,i.string,i.string,i.object;function h(){var n=e([`
  height: `,`px;
  width: `,`px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  * {
    box-sizing: border-box;
  }

  .dots-container {
    height: `,`px;
    width: `,`px;
  }
  .smaller-dot {
    background: `,`;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    animation: flower-spinner-smaller-dot-animation
      `,`ms 0s infinite both;
  }
  .bigger-dot {
    background: `,`;
    height: 100%;
    width: 100%;
    padding: 10%;
    border-radius: 50%;
    animation: flower-spinner-bigger-dot-animation
      `,`ms 0s infinite both;
  }
  @keyframes flower-spinner-bigger-dot-animation {
    0%,
    100% {
      box-shadow: 0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`;
    }
    50% {
      transform: rotate(180deg);
    }
    25%,
    75% {
      box-shadow: `,`px 0 0
          `,`,
        -`,"px 0 0 ",`,
        0 `,"px 0 ",`,
        0 -`,"px 0 ",`,
        `,"px -",`px
          0 `,`,
        `,"px ",`px
          0 `,`,
        -`,"px -",`px
          0 `,`,
        -`,"px ",`px
          0 `,`;
    }
    100% {
      transform: rotate(360deg);
      box-shadow: 0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`;
    }
  }
  @keyframes flower-spinner-smaller-dot-animation {
    0%,
    100% {
      box-shadow: 0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`;
    }
    25%,
    75% {
      box-shadow: `,`px 0 0
          `,`,
        -`,"px 0 0 ",`,
        0 `,"px 0 ",`,
        0 -`,"px 0 ",`,
        `,"px -","px 0 ",`,
        `,"px ",`px 0
          `,`,
        -`,"px -",`px 0
          `,`,
        -`,"px ","px 0 ",`;
    }
    100% {
      box-shadow: 0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`,
        0px 0px 0px `,`;
    }
  }
`]);return h=function(){return n},n}r.div(h(),function(n){return n.size},function(n){return n.size},function(n){return n.dotSize},function(n){return n.dotSize},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.dotSize*2.6},function(n){return n.color},function(n){return n.dotSize*2.6},function(n){return n.color},function(n){return n.dotSize*2.6},function(n){return n.color},function(n){return n.dotSize*2.6},function(n){return n.color},function(n){return n.dotSize*1.9},function(n){return n.dotSize*1.9},function(n){return n.color},function(n){return n.dotSize*1.9},function(n){return n.dotSize*1.9},function(n){return n.color},function(n){return n.dotSize*1.9},function(n){return n.dotSize*1.9},function(n){return n.color},function(n){return n.dotSize*1.9},function(n){return n.dotSize*1.9},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.dotSize*1.4},function(n){return n.color},function(n){return n.dotSize*1.4},function(n){return n.color},function(n){return n.dotSize*1.4},function(n){return n.color},function(n){return n.dotSize*1.4},function(n){return n.color},function(n){return n.dotSize},function(n){return n.dotSize},function(n){return n.color},function(n){return n.dotSize},function(n){return n.dotSize},function(n){return n.color},function(n){return n.dotSize},function(n){return n.dotSize},function(n){return n.color},function(n){return n.dotSize},function(n){return n.dotSize},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color},function(n){return n.color});i.number,i.number,i.string,i.string,i.object;function x(){var n=e([`
  height: `,`px;
  width: `,`px;
  position: relative;
  animation: fulfilling-bouncing-circle-spinner-animation infinite
    `,`ms ease;

  * {
    box-sizing: border-box;
  }

  .orbit {
    height: `,`px;
    width: `,`px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    border: calc(`,`px * 0.03) solid
      `,`;
    animation: fulfilling-bouncing-circle-spinner-orbit-animation infinite
      `,`ms ease;
  }
  .circle {
    height: `,`px;
    width: `,`px;
    color: `,`;
    display: block;
    border-radius: 50%;
    position: relative;
    border: calc(`,`px * 0.1) solid
      `,`;
    animation: fulfilling-bouncing-circle-spinner-circle-animation infinite
      `,`ms ease;
    transform: rotate(0deg) scale(1);
  }
  @keyframes fulfilling-bouncing-circle-spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes fulfilling-bouncing-circle-spinner-orbit-animation {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1);
    }
    62.5% {
      transform: scale(0.8);
    }
    75% {
      transform: scale(1);
    }
    87.5% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes fulfilling-bouncing-circle-spinner-circle-animation {
    0% {
      transform: scale(1);
      border-color: transparent;
      border-top-color: inherit;
    }
    16.7% {
      border-color: transparent;
      border-top-color: initial;
      border-right-color: initial;
    }
    33.4% {
      border-color: transparent;
      border-top-color: inherit;
      border-right-color: inherit;
      border-bottom-color: inherit;
    }
    50% {
      border-color: inherit;
      transform: scale(1);
    }
    62.5% {
      border-color: inherit;
      transform: scale(1.4);
    }
    75% {
      border-color: inherit;
      transform: scale(1);
      opacity: 1;
    }
    87.5% {
      border-color: inherit;
      transform: scale(1.4);
    }
    100% {
      border-color: transparent;
      border-top-color: inherit;
      transform: scale(1);
    }
  }
`]);return x=function(){return n},n}r.div(x(),function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration});i.number,i.number,i.string,i.string,i.object;function g(){var n=e([`
  height: `,`px;
  width: `,`px;
  position: relative;
  border: 4px solid `,`;
  animation: fulfilling-square-spinner-animation
    `,`ms infinite ease;

  * {
    box-sizing: border-box;
  }

  .spinner-inner {
    vertical-align: top;
    display: inline-block;
    background-color: `,`;
    width: 100%;
    opacity: 1;
    animation: fulfilling-square-spinner-inner-animation
      `,`ms infinite ease-in;
  }

  @keyframes fulfilling-square-spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(180deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes fulfilling-square-spinner-inner-animation {
    0% {
      height: 0%;
    }
    25% {
      height: 0%;
    }
    50% {
      height: 100%;
    }
    75% {
      height: 100%;
    }
    100% {
      height: 0%;
    }
  }
`]);return g=function(){return n},n}r.div(g(),function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.color},function(n){return n.animationDuration});i.number,i.number,i.string,i.string,i.object;function b(){var n=e([`
  width: `,`px;
  height: `,`px;
  border-radius: 100%;
  position: relative;

  * {
    box-sizing: border-box;
  }

  .circle {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: calc(`,`px / 10) solid transparent;
  }
  .circle.circle-1 {
    border-top-color: `,`;
    animation: half-circle-spinner-animation
      `,`ms infinite;
  }
  .circle.circle-2 {
    border-bottom-color: `,`;
    animation: half-circle-spinner-animation
      `,`ms infinite alternate;
  }
  @keyframes half-circle-spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`]);return b=function(){return n},n}var T=r.div(b(),function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.color},function(n){return n.animationDuration}),H={size:i.number,animationDuration:i.number,color:i.string,className:i.string,style:i.object},L=function(t){var a=t.size,N=a===void 0?60:a,c=t.color,Z=c===void 0?"#fff":c,u=t.animationDuration,$=u===void 0?1e3:u,s=t.className,l=s===void 0?"":s,X=t.style,W=M(t,["size","color","animationDuration","className","style"]);return o.createElement(T,Y({size:N,color:Z,animationDuration:$,className:"half-circle-spinner"+(l?" "+l:""),style:X},W),o.createElement("div",{className:"circle circle-1"}),o.createElement("div",{className:"circle circle-2"}))};L.propTypes=H;function z(){var n=e([`
  height: `,`px;
  width: `,`px;

  * {
    box-sizing: border-box;
  }

  .dot {
    width: `,`px;
    height: `,`px;
    margin: 0 calc(`,`px / 2);
    border: calc(`,"px / 5) solid ",`;
    border-radius: 50%;
    float: left;
    transform: scale(0);
    animation: hollow-dots-spinner-animation
      `,`ms ease infinite 0ms;
  }
  .dot:nth-child(1) {
    animation-delay: calc(`,`ms * 1);
  }
  .dot:nth-child(2) {
    animation-delay: calc(`,`ms * 2);
  }
  .dot:nth-child(3) {
    animation-delay: calc(`,`ms * 3);
  }
  @keyframes hollow-dots-spinner-animation {
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`]);return z=function(){return n},n}r.div(z(),function(n){return n.size},function(n){return 2*n.size*n.dotsNum},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.animationDelay},function(n){return n.animationDelay},function(n){return n.animationDelay});i.number,i.number,i.string,i.string,i.object;function y(){var n=e([`
  height: `,`px;
  width: `,`px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  * {
    box-sizing: border-box;
  }

  .spinnerBlock {
    animation: intersecting-circles-spinners-animation
      `,`ms linear infinite;
    transform-origin: center;
    display: block;
    height: `,`px;
    width: `,`px;
  }
  .circle {
    display: block;
    border: 2px solid `,`;
    border-radius: 50%;
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .circle:nth-child(1) {
    left: 0;
    top: 0;
  }
  .circle:nth-child(2) {
    left: `,`px;
    top: `,`px;
  }
  .circle:nth-child(3) {
    left: `,`px;
    top: `,`px;
  }
  .circle:nth-child(4) {
    left: 0;
    top: `,`px;
  }
  .circle:nth-child(5) {
    left: `,`px;
    top: `,`px;
  }
  .circle:nth-child(6) {
    left: `,`px;
    top: `,`px;
  }
  .circle:nth-child(7) {
    left: 0;
    top: `,`px;
  }
  @keyframes intersecting-circles-spinners-animation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`]);return y=function(){return n},n}r.div(y(),function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.circleSize},function(n){return n.circleSize},function(n){return n.color},function(n){return n.circleSize*-.36},function(n){return n.circleSize*.2},function(n){return n.circleSize*-.36},function(n){return n.circleSize*-.2},function(n){return n.circleSize*-.36},function(n){return n.circleSize*.36},function(n){return n.circleSize*-.2},function(n){return n.circleSize*.36},function(n){return n.circleSize*.2},function(n){return n.circleSize*.36});i.number,i.number,i.string,i.string,i.object;function w(){var n=e([`
  width: `,`px;
  height: `,`px;
  position: relative;

  * {
    box-sizing: border-box;
  }

  .rhombus {
    height: `,`px;
    width: `,`px;
    background-color: `,`;
    left: `,`px;
    position: absolute;
    margin: 0 auto;
    border-radius: 2px;
    transform: translateY(0) rotate(45deg) scale(0);
    animation: looping-rhombuses-spinner-animation
      `,`ms linear infinite;
  }
  .rhombus:nth-child(1) {
    animation-delay: calc(`,`ms * 1 / -1.5);
  }
  .rhombus:nth-child(2) {
    animation-delay: calc(`,`ms * 2 / -1.5);
  }
  .rhombus:nth-child(3) {
    animation-delay: calc(`,`ms * 3 / -1.5);
  }
  @keyframes looping-rhombuses-spinner-animation {
    0% {
      transform: translateX(0) rotate(45deg) scale(0);
    }
    50% {
      transform: translateX(-233%) rotate(45deg) scale(1);
    }
    100% {
      transform: translateX(-466%) rotate(45deg) scale(0);
    }
  }
`]);return w=function(){return n},n}r.div(w(),function(n){return n.size*4},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.size*4},function(n){return n.animationDuration},function(n){return n.animationDuration},function(n){return n.animationDuration},function(n){return n.animationDuration});i.number,i.number,i.string,i.string,i.object;function D(){var n=e([`
  height: `,`px;
  width: `,`px;
  border-radius: 50%;
  perspective: 800px;

  * {
    box-sizing: border-box;
  }

  .orbit {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .orbit:nth-child(1) {
    left: 0%;
    top: 0%;
    animation: orbit-spinner-orbit-one-animation
      `,`ms linear infinite;
    border-bottom: 3px solid `,`;
  }
  .orbit:nth-child(2) {
    right: 0%;
    top: 0%;
    animation: orbit-spinner-orbit-two-animation
      `,`ms linear infinite;
    border-right: 3px solid `,`;
  }
  .orbit:nth-child(3) {
    right: 0%;
    bottom: 0%;
    animation: orbit-spinner-orbit-three-animation
      `,`ms linear infinite;
    border-top: 3px solid `,`;
  }
  @keyframes orbit-spinner-orbit-one-animation {
    0% {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
    }
  }
  @keyframes orbit-spinner-orbit-two-animation {
    0% {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
    }
  }
  @keyframes orbit-spinner-orbit-three-animation {
    0% {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
    }
  }
`]);return D=function(){return n},n}r.div(D(),function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.color});i.number,i.number,i.string,i.string,i.object;function S(){var n=e([`
  height: `,`px;
  width: `,`px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  * {
    box-sizing: border-box;
  }

  .pixel-spinner-inner {
    width: `,`px;
    height: `,`px;
    background-color: `,`;
    color: `,`;

    box-shadow: `,`px
        `,`px 0 0,
      `,`px
        `,`px 0 0,
      `,`px
        `,`px 0 0,
      `,`px
        `,`px 0 0,
      0 `,`px 0 0,
      `,`px 0 0 0,
      `,`px 0 0 0,
      0 `,`px 0 0;
    animation: pixel-spinner-animation `,`ms
      linear infinite;
  }

  @keyframes pixel-spinner-animation {
    50% {
      box-shadow: `,`px
          `,`px 0 0,
        `,`px
          `,`px 0 0,
        `,"px ",`px
          0 0,
        `,"px ",`px
          0 0,
        0 `,`px 0 0,
        `,`px 0 0 0,
        `,`px 0 0 0,
        0 `,`px 0 0;
    }
    75% {
      box-shadow: `,`px
          `,`px 0 0,
        `,`px
          `,`px 0 0,
        `,"px ",`px
          0 0,
        `,"px ",`px
          0 0,
        0 `,`px 0 0,
        `,`px 0 0 0,
        `,`px 0 0 0,
        0 `,`px 0 0;
    }
    100% {
      transform: rotate(360deg);
    }
  }
`]);return S=function(){return n},n}r.div(S(),function(n){return n.size},function(n){return n.size},function(n){return n.pixelSize},function(n){return n.pixelSize},function(n){return n.color},function(n){return n.color},function(n){return n.pixelSize*1.5},function(n){return n.pixelSize*1.5},function(n){return n.pixelSize*-1.5},function(n){return n.pixelSize*-1.5},function(n){return n.pixelSize*1.5},function(n){return n.pixelSize*-1.5},function(n){return n.pixelSize*-1.5},function(n){return n.pixelSize*1.5},function(n){return n.pixelSize*1.5},function(n){return n.pixelSize*1.5},function(n){return n.pixelSize*-1.5},function(n){return n.pixelSize*-1.5},function(n){return n.animationDuration},function(n){return n.pixelSize*2},function(n){return n.pixelSize*2},function(n){return n.pixelSize*-2},function(n){return n.pixelSize*-2},function(n){return n.pixelSize*2},function(n){return n.pixelSize*-2},function(n){return n.pixelSize*-2},function(n){return n.pixelSize*2},function(n){return n.pixelSize},function(n){return n.pixelSize},function(n){return n.pixelSize*-1},function(n){return n.pixelSize*-1},function(n){return n.pixelSize*2},function(n){return n.pixelSize*2},function(n){return n.pixelSize*-2},function(n){return n.pixelSize*-2},function(n){return n.pixelSize*2},function(n){return n.pixelSize*-2},function(n){return n.pixelSize*-2},function(n){return n.pixelSize*2},function(n){return n.pixelSize},function(n){return n.pixelSize},function(n){return n.pixelSize*-1},function(n){return n.pixelSize*-1});i.number,i.number,i.string,i.string,i.object;function v(){var n=e([`
  height: `,`px;
  width: `,`px;
  position: relative;

  * {
    box-sizing: border-box;
  }

  .circle {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    animation: radar-spinner-animation `,`ms
      infinite;
  }
  .circle:nth-child(1) {
    padding: `,`px;
    animation-delay: `,`ms;
  }
  .circle:nth-child(2) {
    padding: `,`px;
    animation-delay: `,`ms;
  }
  .circle:nth-child(3) {
    padding: `,`px;
    animation-delay: `,`ms;
  }
  .circle:nth-child(4) {
    padding: `,`px;
    animation-delay: 0ms;
  }
  .circle-inner,
  .circle-inner-container {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: `,`px solid transparent;
  }
  .circle-inner {
    border-left-color: `,`;
    border-right-color: `,`;
  }
  @keyframes radar-spinner-animation {
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`]);return v=function(){return n},n}r.div(v(),function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.borderWidth*2*0},function(n){return n.animationDuration*.15},function(n){return n.borderWidth*2*1},function(n){return n.animationDuration*.15},function(n){return n.borderWidth*2*2},function(n){return n.animationDuration*.15},function(n){return n.borderWidth*2*3},function(n){return n.borderWidth},function(n){return n.color},function(n){return n.color});i.number,i.number,i.string,i.string,i.object;function j(){var n=e([`
  height: `,`px;
  width: `,`px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  animation: scaling-squares-animation `,`ms;
  animation-iteration-count: infinite;
  transform: rotate(0deg);

  * {
    box-sizing: border-box;
  }

  .square {
    height: calc(`,`px * 0.25 / 1.3);
    width: calc(`,`px * 0.25 / 1.3);
    margin-right: auto;
    margin-left: auto;
    border: calc(`,`px * 0.04 / 1.3) solid
      `,`;
    position: absolute;
    animation-duration: `,`ms;
    animation-iteration-count: infinite;
  }
  .square:nth-child(1) {
    animation-name: scaling-squares-spinner-animation-child-1;
  }
  .square:nth-child(2) {
    animation-name: scaling-squares-spinner-animation-child-2;
  }
  .square:nth-child(3) {
    animation-name: scaling-squares-spinner-animation-child-3;
  }
  .square:nth-child(4) {
    animation-name: scaling-squares-spinner-animation-child-4;
  }
  @keyframes scaling-squares-animation {
    50% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }
  @keyframes scaling-squares-spinner-animation-child-1 {
    50% {
      transform: translate(150%, 150%) scale(2, 2);
    }
  }
  @keyframes scaling-squares-spinner-animation-child-2 {
    50% {
      transform: translate(-150%, 150%) scale(2, 2);
    }
  }
  @keyframes scaling-squares-spinner-animation-child-3 {
    50% {
      transform: translate(-150%, -150%) scale(2, 2);
    }
  }
  @keyframes scaling-squares-spinner-animation-child-4 {
    50% {
      transform: translate(150%, -150%) scale(2, 2);
    }
  }
`]);return j=function(){return n},n}r.div(j(),function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration});i.number,i.number,i.string,i.string,i.object;function k(){var n=e([`
  height: `,`px;
  width: `,`px;
  top: `,`px;

  * {
    box-sizing: border-box;
  }

  .square {
    height: `,`px;
    width: `,`px;
    top: `,`px;
    margin-right: calc(`,`px / 3);
    margin-top: calc(`,`px / 3);
    background: `,`;
    float: left;
    position: relative;
    opacity: 0;
    animation: self-building-square-spinner
      `,`ms infinite;
  }
  .square:nth-child(1) {
    animation-delay: calc(`,`ms * 6);
  }
  .square:nth-child(2) {
    animation-delay: calc(`,`ms * 7);
  }
  .square:nth-child(3) {
    animation-delay: calc(`,`ms * 8);
  }
  .square:nth-child(4) {
    animation-delay: calc(`,`ms * 3);
  }
  .square:nth-child(5) {
    animation-delay: calc(`,`ms * 4);
  }
  .square:nth-child(6) {
    animation-delay: calc(`,`ms * 5);
  }
  .square:nth-child(7) {
    animation-delay: calc(`,`ms * 0);
  }
  .square:nth-child(8) {
    animation-delay: calc(`,`ms * 1);
  }
  .square:nth-child(9) {
    animation-delay: calc(`,`ms * 2);
  }
  .clear {
    clear: both;
  }
  @keyframes self-building-square-spinner {
    0% {
      opacity: 0;
    }
    5% {
      opacity: 1;
      top: 0;
    }
    50.9% {
      opacity: 1;
      top: 0;
    }
    55.9% {
      opacity: 0;
      top: inherit;
    }
  }
`]);return k=function(){return n},n}r.div(k(),function(n){return n.size},function(n){return n.size},function(n){return-1*n.initialTopPosition},function(n){return n.size/4},function(n){return n.size/4},function(n){return-1*n.initialTopPosition},function(n){return n.size/4},function(n){return n.size/4},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.animationDuration*.05},function(n){return n.animationDuration*.05},function(n){return n.animationDuration*.05},function(n){return n.animationDuration*.05},function(n){return n.animationDuration*.05},function(n){return n.animationDuration*.05},function(n){return n.animationDuration*.05},function(n){return n.animationDuration*.05},function(n){return n.animationDuration*.05});i.number,i.number,i.string,i.string,i.object;function q(){var n=e([`
  height: `,`px;
  width: `,`px;
  position: relative;

  * {
    box-sizing: border-box;
  }

  .ring {
    border-radius: 50%;
    position: absolute;
    border: calc(`,`px * 0.05) solid transparent;
    border-top-color: `,`;
    border-left-color: `,`;
    animation: semipolar-spinner-animation
      `,`ms infinite;
  }
  .ring:nth-child(1) {
    height: calc(
      `,"px - ",`px * 0.2 * 0
    );
    width: calc(
      `,"px - ",`px * 0.2 * 0
    );
    top: calc(`,`px * 0.1 * 0);
    left: calc(`,`px * 0.1 * 0);
    animation-delay: calc(`,`ms * 0.1 * 4);
    z-index: 5;
  }
  .ring:nth-child(2) {
    height: calc(
      `,"px - ",`px * 0.2 * 1
    );
    width: calc(
      `,"px - ",`px * 0.2 * 1
    );
    top: calc(`,`px * 0.1 * 1);
    left: calc(`,`px * 0.1 * 1);
    animation-delay: calc(`,`ms * 0.1 * 3);
    z-index: 4;
  }
  .ring:nth-child(3) {
    height: calc(
      `,"px - ",`px * 0.2 * 2
    );
    width: calc(
      `,"px - ",`px * 0.2 * 2
    );
    top: calc(`,`px * 0.1 * 2);
    left: calc(`,`px * 0.1 * 2);
    animation-delay: calc(`,`ms * 0.1 * 2);
    z-index: 3;
  }
  .ring:nth-child(4) {
    height: calc(
      `,"px - ",`px * 0.2 * 3
    );
    width: calc(
      `,"px - ",`px * 0.2 * 3
    );
    top: calc(`,`px * 0.1 * 3);
    left: calc(`,`px * 0.1 * 3);
    animation-delay: calc(`,`ms * 0.1 * 1);
    z-index: 2;
  }
  .ring:nth-child(5) {
    height: calc(
      `,"px - ",`px * 0.2 * 4
    );
    width: calc(
      `,"px - ",`px * 0.2 * 4
    );
    top: calc(`,`px * 0.1 * 4);
    left: calc(`,`px * 0.1 * 4);
    animation-delay: calc(`,`ms * 0.1 * 0);
    z-index: 1;
  }
  @keyframes semipolar-spinner-animation {
    50% {
      transform: rotate(360deg) scale(0.7);
    }
  }
`]);return q=function(){return n},n}r.div(q(),function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration});i.number,i.number,i.string,i.string,i.object;function _(){var n=e([`
  height: `,`px;
  width: `,`px;

  * {
    box-sizing: border-box;
  }

  .spring-spinner-part {
    overflow: hidden;
    height: calc(`,`px / 2);
    width: `,`px;
  }
  .spring-spinner-part.bottom {
    transform: rotate(180deg) scale(-1, 1);
  }
  .spring-spinner-rotator {
    width: `,`px;
    height: `,`px;
    border: calc(`,`px / 7) solid transparent;
    border-right-color: `,`;
    border-top-color: `,`;
    border-radius: 50%;
    box-sizing: border-box;
    animation: spring-spinner-animation `,`ms
      ease-in-out infinite;
    transform: rotate(-200deg);
  }
  @keyframes spring-spinner-animation {
    0% {
      border-width: calc(`,`px / 7);
    }
    25% {
      border-width: calc(`,`px / 23.33);
    }
    50% {
      transform: rotate(115deg);
      border-width: calc(`,`px / 7);
    }
    75% {
      border-width: calc(`,`px / 23.33);
    }
    100% {
      border-width: calc(`,`px / 7);
    }
  }
`]);return _=function(){return n},n}r.div(_(),function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.color},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size});i.number,i.number,i.string,i.string,i.object;function O(){var n=e([`
  height: `,`px;
  width: `,`px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  * {
    box-sizing: border-box;
  }

  .square {
    height: calc(`,`px * 0.25 / 1.3);
    width: calc(`,`px * 0.25 / 1.3);
    animation-duration: `,`ms;
    border: calc(`,`px * 0.04 / 1.3) solid
      `,`;
    margin-right: auto;
    margin-left: auto;
    position: absolute;
    animation-iteration-count: infinite;
  }
  .square:nth-child(1) {
    animation-name: swapping-squares-animation-child-1;
    animation-delay: `,`ms;
  }
  .square:nth-child(2) {
    animation-name: swapping-squares-animation-child-2;
    animation-delay: 0ms;
  }
  .square:nth-child(3) {
    animation-name: swapping-squares-animation-child-3;
    animation-delay: `,`ms;
  }
  .square:nth-child(4) {
    animation-name: swapping-squares-animation-child-4;
    animation-delay: 0ms;
  }
  @keyframes swapping-squares-animation-child-1 {
    50% {
      transform: translate(150%, 150%) scale(2, 2);
    }
  }
  @keyframes swapping-squares-animation-child-2 {
    50% {
      transform: translate(-150%, 150%) scale(2, 2);
    }
  }
  @keyframes swapping-squares-animation-child-3 {
    50% {
      transform: translate(-150%, -150%) scale(2, 2);
    }
  }
  @keyframes swapping-squares-animation-child-4 {
    50% {
      transform: translate(150%, -150%) scale(2, 2);
    }
  }
`]);return O=function(){return n},n}r.div(O(),function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.size},function(n){return n.animationDuration},function(n){return n.size},function(n){return n.color},function(n){return n.animationDuration*.5},function(n){return n.animationDuration*.5});i.number,i.number,i.string,i.string,i.object;function B(){var n=e([`
  height: `,`px;
  width: `,`px;
  padding: 3px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  overflow: hidden;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  .circle {
    position: absolute;
    display: block;
    border-radius: 50%;
    border: 3px solid `,`;
    opacity: 1;
  }
  .circle:nth-child(1) {
    height: `,`px;
    width: `,`px;
    animation: trinity-rings-spinner-circle1-animation
      `,`ms infinite linear;
    border-width: 3px;
  }
  .circle:nth-child(2) {
    height: calc(`,`px * 0.65);
    width: calc(`,`px * 0.65);
    animation: trinity-rings-spinner-circle2-animation
      `,`ms infinite linear;
    border-width: 2px;
  }
  .circle:nth-child(3) {
    height: calc(`,`px * 0.1);
    width: calc(`,`px * 0.1);
    animation: trinity-rings-spinner-circle3-animation
      `,`ms infinite linear;
    border-width: 1px;
  }
  @keyframes trinity-rings-spinner-circle1-animation {
    0% {
      transform: rotateZ(20deg) rotateY(0deg);
    }
    100% {
      transform: rotateZ(100deg) rotateY(360deg);
    }
  }
  @keyframes trinity-rings-spinner-circle2-animation {
    0% {
      transform: rotateZ(100deg) rotateX(0deg);
    }
    100% {
      transform: rotateZ(0deg) rotateX(360deg);
    }
  }
  @keyframes trinity-rings-spinner-circle3-animation {
    0% {
      transform: rotateZ(100deg) rotateX(-360deg);
    }
    100% {
      transform: rotateZ(-360deg) rotateX(360deg);
    }
  }
`]);return B=function(){return n},n}r.div(B(),function(n){return n.size},function(n){return n.size},function(n){return n.color},function(n){return n.outerWidth},function(n){return n.outerWidth},function(n){return n.animationDuration},function(n){return n.outerWidth},function(n){return n.outerWidth},function(n){return n.animationDuration},function(n){return n.outerWidth},function(n){return n.outerWidth},function(n){return n.animationDuration});i.number,i.number,i.string,i.string,i.object;export{L as H};
