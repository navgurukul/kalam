import{bg as x,bh as g,aG as D,r as w,aR as i,ba as y,b$ as L}from"./vendor.8941a3ab.js";import{a as R}from"./vendor_axios.5abceb0c.js";import{M as S,c as N}from"./index.4acf0da1.js";import"./vendor_core_js_pure.ebf27e63.js";import"./vendor_react_epic_spinners.9b16e28b.js";import"./vendor_mui_datatables.4ea24f59.js";import"./vendor_lodash.f8b1f886.js";import"./vendor_react_player.860e5be2.js";import"./vendor_react_slick.6c11bd22.js";import"./vendor_react_easy_edit.16366bed.js";const $="https://join.navgurukul.org/api/",j=[{name:"id",label:"S.No",options:{filter:!0,sort:!0,customBodyRender:(s,a)=>a.rowIndex+1}},{name:"donor",label:"Name",options:{filter:!0,sort:!0,customBodyRender:(s,a)=>{const e=`/donor/${a.rowData[0]}/students`;return i(L,{to:e,style:{color:"#f05f40"},children:s})}}}],G=()=>{const{roles:s}=x(o=>o.auth),a=g(),n=()=>a(N(!1)),[e,l]=D.useState({data:[],showLoader:!0}),u=async o=>{var c;try{const r=s.find(t=>t.role==="Donor"),f=((c=r==null?void 0:r.access)==null?void 0:c.map(t=>t.access))||[],h=`${$}donors`,d=await R.get(h,{signal:o}),b=s.findIndex(t=>t.role==="Admin");l({...e,data:b!==-1?d.data:d.data.filter(t=>f.includes(t.id)),showLoader:!1})}catch{}};w.exports.useEffect(()=>{const o=new AbortController;return(async()=>u(o.signal))(),n(),()=>o.abort()},[]);const{data:m,showLoader:p}=e;return i(y,{maxWidth:"sm",children:i(S,{title:"Donors Name",columns:j,data:m,showLoader:p})})};export{G as default};