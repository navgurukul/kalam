import{b8 as I,r as T,aR as u,ba as W,cd as L,b9 as d,bt as h,bu as f,bx as F,by as b,bz as n,bb as v,br as x,bi as R}from"./vendor.8941a3ab.js";import{a as V}from"./vendor_axios.5abceb0c.js";import{C as E}from"./vendor_react_hook_form.df306860.js";import{J as g,s as M}from"./index.4acf0da1.js";import"./vendor_core_js_pure.ebf27e63.js";import"./vendor_react_epic_spinners.9b16e28b.js";import"./vendor_mui_datatables.4ea24f59.js";import"./vendor_lodash.f8b1f886.js";import"./vendor_react_player.860e5be2.js";import"./vendor_react_slick.6c11bd22.js";import"./vendor_react_easy_edit.16366bed.js";const w=I(m=>({root:{maxWidth:400,paddingTop:m.spacing(3),paddingBottom:m.spacing(3)},container:{maxWidth:500,marginTop:m.spacing(2),marginBottom:m.spacing(4),backgroundColor:m.palette.background.default},spacing:{paddingBottom:m.spacing(2),backgroundColor:m.palette.background.default},text:{paddingBottom:m.spacing(3),backgroundColor:m.palette.background.default},menuPaper:{maxHeight:300}}));function K(m){const A=w(),r={state:{en:"Select State",hi:"\u0930\u093E\u091C\u094D\u092F \u091A\u0941\u0928\u0947\u0902",ma:"\u0930\u093E\u091C\u094D\u092F \u0928\u093F\u0935\u0921\u093E",error:{en:"Select your State",hi:"\u0905\u092A\u0928\u093E \u0930\u093E\u091C\u094D\u092F \u091A\u0941\u0928\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u0947 \u0930\u093E\u091C\u094D\u092F \u0928\u093F\u0935\u0921\u093E"}},district:{en:"Select District",hi:"\u091C\u093F\u0932\u093E \u091A\u0941\u0928\u0947\u0902",ma:"\u091C\u093F\u0932\u094D\u0939\u093E \u0928\u093F\u0935\u0921\u093E",error:{en:"Select your District",hi:"\u0905\u092A\u0928\u093E \u091C\u093F\u0932\u093E \u091A\u0941\u0928\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u093E \u091C\u093F\u0932\u094D\u0939\u093E \u0928\u093F\u0935\u0921\u093E"}},city:{en:"City",hi:"\u0936\u0939\u0930",ma:"\u0936\u0939\u0930",error:{en:"Select your City",hi:"\u0905\u092A\u0928\u093E \u0936\u0939\u0930 \u091A\u0941\u0928\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u0947 \u0936\u0939\u0930 \u0928\u093F\u0935\u0921\u093E"}},pin_code:{en:"Pin Code",hi:"\u092A\u093F\u0928 \u0915\u094B\u0921",ma:"\u092A\u093F\u0928 \u0915\u094B\u0921",error:{en:"Enter your Pin Code",hi:"\u0905\u092A\u0928\u093E \u092A\u093F\u0928 \u0915\u094B\u0921 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u093E \u092A\u093F\u0928 \u0915\u094B\u0921 \u091F\u093E\u0915\u093E",minLength:{en:"Enter a valid Pin Code",hi:"\u0905\u092A\u0928\u093E \u0936\u0939\u0930 \u091A\u0941\u0928\u0947\u0902",ma:"\u0935\u0948\u0927 \u092A\u093F\u0928 \u0915\u094B\u0921 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E"}}},current_status:{en:"Current Status",hi:"\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0938\u094D\u0925\u093F\u0924\u093F",ma:"\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0938\u094D\u0925\u093F\u0924\u0940",error:{en:"Select your Current Status",hi:"\u0905\u092A\u0928\u0940 \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0938\u094D\u0925\u093F\u0924\u093F \u091A\u0941\u0928\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u0940 \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0938\u094D\u0925\u093F\u0924\u0940 \u0928\u093F\u0935\u0921\u093E"}},qualification:{en:"Maximum Qualification",hi:"\u0905\u0927\u093F\u0915\u0924\u092E \u092F\u094B\u0917\u094D\u092F\u0924\u093E",ma:"\u0915\u092E\u093E\u0932 \u092A\u093E\u0924\u094D\u0930\u0924\u093E",error:{en:"Select your Current Qualification",hi:"\u0905\u092A\u0928\u0940 \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092F\u094B\u0917\u094D\u092F\u0924\u093E \u091A\u0941\u0928\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u0940 \u0938\u0927\u094D\u092F\u093E\u091A\u0940 \u092A\u093E\u0924\u094D\u0930\u0924\u093E \u0928\u093F\u0935\u0921\u093E"}},class10th:{en:"Percentage in 10th class",hi:"10\u0935\u0940\u0902 \u0915\u0915\u094D\u0937\u093E \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0902\u0915",ma:"\u0926\u0939\u093E\u0935\u0940\u0924 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940",error:{en:"Enter 10th Class Percentage",hi:"10\u0935\u0940\u0902 \u0915\u0915\u094D\u0937\u093E \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0902\u0915 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"10\u0935\u0940 \u0935\u0930\u094D\u0917 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E",max:{en:"Enter valid Percentage",hi:"\u092E\u093E\u0928\u094D\u092F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"\u0935\u0948\u0927 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E"}}},class12th:{en:"Percentage in 12th class",hi:"12\u0935\u0940\u0902 \u0915\u0915\u094D\u0937\u093E \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0902\u0915",ma:"\u092C\u093E\u0930\u093E\u0935\u0940\u0924 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940",error:{en:"Enter 12th Class Percentage",hi:"12\u0935\u0940\u0902 \u0915\u0915\u094D\u0937\u093E \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0902\u0915 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"12\u0935\u0940 \u0935\u0930\u094D\u0917 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E",max:{en:"Enter valid Percentage",hi:"\u092E\u093E\u0928\u094D\u092F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"\u0935\u0948\u0927 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E"}}},graduate:{en:"Percentage in 12th class",hi:"12\u0935\u0940\u0902 \u0915\u0915\u094D\u0937\u093E \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0902\u0915",ma:"\u092C\u093E\u0930\u093E\u0935\u0940\u0924 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940",error:{en:"Enter 12th Class Percentage",hi:"12\u0935\u0940\u0902 \u0915\u0915\u094D\u0937\u093E \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0902\u0915 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"12\u0935\u0940 \u0935\u0930\u094D\u0917 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E",max:{en:"Enter valid Percentage",hi:"\u092E\u093E\u0928\u094D\u092F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"\u0935\u0948\u0927 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E"}}},iti:{en:"Percentage in ITI",hi:"ITI \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0902\u0915",ma:"ITI\u092E\u0927\u094D\u092F\u0947 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940",error:{en:"Enter ITI Percentage",hi:"ITI \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0902\u0915 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"ITI\u092E\u0927\u094D\u092F\u0947 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E",max:{en:"Enter valid Percentage",hi:"\u092E\u093E\u0928\u094D\u092F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",ma:"\u0935\u0948\u0927 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E"}}},school_medium:{en:"School Medium",hi:"\u0938\u094D\u0915\u0942\u0932 \u092E\u093E\u0927\u094D\u092F\u092E",ma:"\u0936\u093E\u0933\u093E \u092E\u093E\u0927\u094D\u092F\u092E",error:{en:"Select your School Medium",hi:"\u0905\u092A\u0928\u093E \u0938\u094D\u0915\u0942\u0932 \u092E\u093E\u0927\u094D\u092F\u092E \u091A\u0941\u0928\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u0947 \u0936\u093E\u0933\u0947\u091A\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0928\u093F\u0935\u0921\u093E"}},caste:{en:"Caste/Tribe",hi:"\u091C\u093E\u0924\u093F/\u091C\u0928\u091C\u093E\u0924\u093F",ma:"\u091C\u093E\u0924/\u091C\u092E\u093E\u0924\u0940",error:{en:"Select your Caste/Tribe",hi:"\u0905\u092A\u0928\u0940 \u091C\u093E\u0924\u093F/\u091C\u0928\u091C\u093E\u0924\u093F \u091A\u0941\u0928\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u0940 \u091C\u093E\u0924/\u091C\u092E\u093E\u0924\u0940 \u0928\u093F\u0935\u0921\u093E"}},religion:{en:"Religion",hi:"\u0927\u0930\u094D\u092E",ma:"\u0927\u0930\u094D\u092E",error:{en:"Select your Religion",hi:"\u0905\u092A\u0928\u093E \u0927\u0930\u094D\u092E \u091A\u0941\u0928\u0947\u0902",ma:"\u0924\u0941\u092E\u091A\u093E \u0927\u0930\u094D\u092E \u0928\u093F\u0935\u0921\u093E"}}},{inputDisabled:c,formData:l,reactForm:{errors:i,control:p,watch:y,setValue:B},partnerSlug:o}=m,{lang:e}=m,[P,q]=T.exports.useState([]);async function O(t){if(o&&g.includes(o)){q([{name:"Amravati"},{name:"Akola"},{name:"Bhandara"},{name:"Buldhana"},{name:"Chandrapur"},{name:"Gadchiroli"},{name:"Gondia"},{name:"Nagpur"},{name:"Wardha"},{name:"Washim"},{name:"Yavatmal"}]);return}V.get(`https://api.countrystatecity.in/v1/countries/IN/states/${t}/cities`,{headers:{"X-CSCAPI-KEY":"TzZrb2p0emtqa29BOW0zTnpLZHdzOVdjNmlubnRDMmtqOEgxRXpFdw=="}}).then(({data:a})=>{if(t==="CT"){const s={id:0,name:"Dantewada"};a.push(s),a.sort(function(C,S){return C.name<S.name?-1:C.name>S.name?1:0})}q(a)})}const _=y("state"),D=y("qualification");return T.exports.useEffect(()=>{_!==""&&_!=null&&(c||B("district",""),O(_))},[_]),u(W,{maxWidth:"lg",align:"center",className:A.container,children:u(L,{square:!0,elevation:0,className:A.textField,align:"left",children:d(h,{style:{paddingTop:"1.2rem"},container:!0,spacing:2,children:[d(h,{item:!0,xs:12,sm:6,children:[u(E,{control:p,defaultValue:l.state||"",name:"state",rules:{required:!0,validate:t=>t!==""},render:({field:{ref:t,...a}})=>d(f,{disabled:c&&l.state!==null,fullWidth:!0,variant:"outlined",required:!0,children:[u(F,{id:"state-label",children:r.state[e]}),d(b,{"data-cy":"state-input",error:!!i.state,required:!0,inputRef:t,label:r.state[e],placeholder:r.state[e],MenuProps:{classes:{paper:A.menuPaper}},...a,children:[u(n,{value:"",disabled:!0,children:r.state[e]}),Object.entries(o&&g.includes(o)?{MH:"Maharashtra"}:M).map(([s,C])=>u(n,{value:s,children:C},s))]})]})}),i.state?u(v,{style:{paddingLeft:"0.8rem",paddingTop:"0.4rem",paddingBottom:"0.4rem"},variant:"caption",color:"error",children:r.state.error[e]}):""]}),d(h,{item:!0,xs:12,sm:6,children:[u(E,{control:p,defaultValue:l.district||"",name:"district",className:A.spacing,rules:{required:!0,validate:t=>t!==""},render:({field:{ref:t,...a}})=>d(f,{disabled:c&&l.district!==null,fullWidth:!0,variant:"outlined",required:!0,children:[u(F,{id:"district-label",children:r.district[e]}),d(b,{"data-cy":"district-input",error:!!i.district,required:!0,inputRef:t,...a,label:r.district[e],placeholder:r.district[e],MenuProps:{classes:{paper:A.menuPaper}},children:[u(n,{value:"",disabled:!0,children:r.district[e]}),P.map(s=>u(n,{value:s.name,children:s.name},s.name))]})]})}),i.district?u(v,{style:{paddingLeft:"0.8rem",paddingTop:"0.4rem",paddingBottom:"0.4rem"},variant:"caption",color:"error",children:r.district.error[e]}):""]}),u(h,{item:!0,xs:12,sm:6,children:u(E,{control:p,defaultValue:l.city,name:"city",rules:{required:"true"},render:({field:{ref:t,...a}})=>u(x,{"data-cy":"city",disabled:c&&l.city!==null,variant:"outlined",required:!0,inputRef:t,...a,fullWidth:!0,id:"city",label:r.city[e],placeholder:r.city[e],autoComplete:"off",error:!!i.city,helperText:i.city?r.city.error[e]:"Ex. Bangalore"})})}),u(h,{item:!0,xs:12,sm:6,children:u(E,{control:p,rules:{required:!0,minLength:6,maxLength:6},defaultValue:l.pin_code,name:"pin_code",render:({field:{ref:t,...a}})=>u(x,{"data-cy":"pin-Input",disabled:c&&l.pin_code!==null,variant:"outlined",required:!0,fullWidth:!0,id:"pin_code",inputRef:t,label:r.pin_code[e],placeholder:r.pin_code[e],autoComplete:"off",error:!!i.pin_code,helperText:i.pin_code?i.pin_code.type==="minLength"||i.pin_code.type==="maxLength"?r.pin_code.error.minLength[e]:r.pin_code.error[e]:"Ex. 4402xx",...a})})}),d(h,{item:!0,xs:12,sm:6,children:[u(E,{control:p,rules:{required:"true",validate:t=>t!=="Select Option"},defaultValue:l.current_status||"Select Option",name:"current_status",render:({field:{ref:t,...a}})=>d(f,{disabled:c&&l.current_status!==void 0,fullWidth:!0,variant:"outlined",required:!0,children:[u(F,{id:"current-status-label",children:r.current_status[e]}),d(b,{"data-cy":"currentStatus",disabled:c&&l.current_status!==void 0,error:!!i.current_status,label:r.current_status[e],placeholder:r.current_status[e],required:!0,inputRef:t,...a,children:[u(n,{value:"Select Option",disabled:!0,children:"Select Option"}),["Nothing","Job","Study","Other"].map(s=>u(n,{value:s.toLowerCase(),children:s},s))]})]})}),i.current_status?u(v,{style:{paddingLeft:"0.8rem",paddingTop:"0.4rem",paddingBottom:"0.4rem"},variant:"caption",color:"error",children:r.current_status.error[e]}):""]}),d(h,{item:!0,xs:12,sm:6,children:[u(E,{control:p,rules:{required:"true",validate:t=>t!==""},defaultValue:l.qualification||"",name:"qualification",render:({field:{ref:t,...a}})=>d(f,{disabled:c&&l.qualification!==void 0,variant:"outlined",fullWidth:!0,required:!0,children:[u(F,{id:"qualification-label",children:r.qualification[e]}),d(b,{"data-cy":"maxQualification",label:r.qualification[e],placeholder:r.qualification[e],error:!!i.qualification,required:!0,inputRef:t,...a,children:[u(n,{value:"",disabled:!0,children:"Select Option"}),o&&g.includes(o)?null:u(n,{value:"lessThan10th",children:"Less than 10th pass"}),o&&g.includes(o)?null:u(n,{value:"class10th",children:"10th pass"}),u(n,{value:"class12th",children:"12th pass"}),u(n,{value:"graduate",children:"Graduated"}),o&&g.includes(o)?u(n,{value:"iti",children:"ITI"}):null]})]})}),i.qualification?u(v,{style:{paddingLeft:"0.8rem",paddingTop:"0.4rem",paddingBottom:"0.4rem"},variant:"caption",color:"error",children:r.qualification.error[e]}):""]}),D==="class10th"?u(h,{item:!0,xs:12,sm:12,children:u(E,{control:p,defaultValue:l.percentage_in10th,rules:{required:!0,max:100,min:33},name:"percentage_in10th",render:({field:{ref:t,...a}})=>u(x,{disabled:c&&l.percentage_in10th!==null,variant:"outlined",required:!0,inputRef:t,...a,fullWidth:!0,label:r.class10th[e],placeholder:r.class10th[e],type:"number",autoComplete:"off",error:!!i.percentage_in10th,helperText:i.percentage_in10th?i.percentage_in10th.type==="max"||i.percentage_in10th.type==="min"?r.class10th.error.max[e]:r.class10th.error[e]:"Ex. 86.40"})})}):null,D==="class12th"||D==="graduate"||D==="iti"?d(R,{children:[u(h,{item:!0,xs:12,sm:6,children:u(E,{control:p,defaultValue:l.percentage_in10th,rules:{required:!g.includes(o),min:33,max:100},name:"percentage_in10th",render:({field:{ref:t,...a}})=>u(x,{disabled:c&&l.percentage_in10th!==null,variant:"outlined",required:!g.includes(o),inputRef:t,...a,fullWidth:!0,label:r.class10th[e],placeholder:r.class10th[e],type:"number",autoComplete:"off",error:!!i.percentage_in10th,helperText:i.percentage_in10th?i.percentage_in10th.type==="max"||i.percentage_in10th.type==="min"?r.class10th.error.max[e]:r.class10th.error[e]:"Ex. 86.40"})})}),u(h,{item:!0,xs:12,sm:6,children:u(E,{control:p,name:"percentage_in12th",rules:{required:!g.includes(o),min:33,max:100},defaultValue:l.percentage_in12th,render:({field:{ref:t,...a}})=>u(x,{disabled:c&&l.percentage_in12th!==null,variant:"outlined",required:!g.includes(o),inputRef:t,...a,fullWidth:!0,label:r[D][e],placeholder:r[D][e],type:"number",autoComplete:"off",error:!!i.percentage_in12th,helperText:i.percentage_in12th?i.percentage_in12th.type==="min"||i.percentage_in12th.type==="max"?r[D].error.max[e]:r[D].error[e]:"Ex. 76.40"})})})]}):null,d(h,{item:!0,xs:12,children:[u(E,{control:p,name:"school_medium",defaultValue:l.school_medium||"",rules:{required:!0,validate:t=>t!==""},render:({field:{ref:t,...a}})=>d(f,{disabled:c&&l.school_medium!==void 0,fullWidth:!0,variant:"outlined",required:!0,children:[u(F,{id:"school-medium-label",children:r.school_medium[e]}),d(b,{"data-cy":"schoolMedium",label:r.school_medium[e],placeholder:r.school_medium[e],error:!!i.school_medium,required:!0,inputRef:t,...a,disabled:c&&l.school_medium!==void 0,children:[u(n,{value:"",disabled:!0,children:r.school_medium[e]}),Object.entries({hi:["Hindi","\u0939\u093F\u0928\u094D\u0926\u0940"],en:["English","\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940"],ma:["Marathi","\u092E\u0930\u093E\u0920\u0940"],ur:["Urdu","\u0909\u0930\u094D\u0926\u0942"]}).map(([s,C])=>u(n,{value:s,children:C[e==="en"?0:1]},s))]})]})}),i.school_medium?u(v,{style:{paddingLeft:"0.8rem",paddingTop:"0.4rem",paddingBottom:"0.4rem"},variant:"caption",color:"error",children:r.school_medium.error[e]}):""]}),g.includes(o)?null:d(h,{item:!0,xs:12,children:[u(E,{control:p,name:"caste",defaultValue:l.caste||"Select Option",rules:{required:!0,validate:t=>t!=="Select Option"},render:({field:{ref:t,...a}})=>d(f,{disabled:c&&l.caste!==void 0,fullWidth:!0,variant:"outlined",required:!0,children:[u(F,{id:"demo-simple-select-outlined-label",children:r.caste[e]}),d(b,{label:r.caste[e],placeholder:r.caste[e],error:!!i.caste,required:!0,inputRef:t,...a,children:[u(n,{value:"Select Option",disabled:!0,children:"Select Option"}),u(n,{value:"scSt",children:"(SC) Scheduled Caste / (ST) Scheduled Tribe"}),u(n,{value:"obc",children:"(OBC) Other Backward Classes"}),u(n,{value:"general",children:"General"}),u(n,{value:"others",children:"Other"})]})]})}),i.caste?u(v,{style:{paddingLeft:"0.8rem",paddingTop:"0.4rem",paddingBottom:"0.4rem"},variant:"caption",color:"error",children:r.caste.error[e]}):""]}),d(h,{item:!0,xs:12,children:[u(E,{control:p,name:"religion",defaultValue:l.religion||"",rules:{required:!0},render:({field:{ref:t,...a}})=>d(f,{disabled:c&&l.religion!==void 0,required:!0,fullWidth:!0,variant:"outlined",children:[u(F,{id:"religion-label",children:r.religion[e]}),d(b,{"data-cy":"religion-input",label:r.religion[e],placeholder:r.religion[e],required:!0,inputRef:t,error:!!i.religion,...a,children:[u(n,{value:"",disabled:!0,children:"Select Option"}),u(n,{value:"hindu",children:"Hindu"}),u(n,{value:"islam",children:"Islam"}),u(n,{value:"sikh",children:"Sikh"}),u(n,{value:"christian",children:"Christian"}),u(n,{value:"jain",children:"Jain"}),u(n,{value:"buddhism",children:"Buddhism"}),u(n,{value:"others",children:"Others"})]})]})}),i.religion?u(v,{style:{paddingLeft:"0.8rem",paddingTop:"0.4rem",paddingBottom:"0.4rem"},variant:"caption",color:"error",children:r.religion.error[e]}):""]})]})})})}export{K as default};