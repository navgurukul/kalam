import{b8 as H,ca as J,bf as K,bh as M,aG as P,r as Q,aR as t,ba as X,cd as ee,b9 as h,bt as n,br as f,aT as N,d8 as q,bq as x,d9 as D,da as F}from"./vendor.8941a3ab.js";import{a as S}from"./vendor_axios.5abceb0c.js";import{u as te,a as T,C as g}from"./vendor_react_hook_form.df306860.js";import{c as W}from"./index.4acf0da1.js";import"./vendor_core_js_pure.ebf27e63.js";import"./vendor_react_epic_spinners.9b16e28b.js";import"./vendor_mui_datatables.4ea24f59.js";import"./vendor_lodash.f8b1f886.js";import"./vendor_react_player.860e5be2.js";import"./vendor_react_slick.6c11bd22.js";import"./vendor_react_easy_edit.16366bed.js";const $="https://join.navgurukul.org/api/",re=H(i=>({container:{display:"flex",flexWrap:"wrap",flexDirection:"column",maxWidth:400},root:{maxWidth:450,margin:"auto",marginTop:"20px"},addIcon:{position:"absolute",marginLeft:"60%",top:"9px"},text:{marginBottom:i.spacing(1)},btn:{marginTop:i.spacing(4)}})),he=({partnerId:i,closeDialog:w})=>{const m=re(),C=J(),{enqueueSnackbar:p}=K(),E=M(),z=()=>E(W(!0)),k=()=>E(W(!1)),[c,A]=P.useState({name:"",email:"",slug:"",notes:"",state:"",partnerEmail:"",partnerUsers:[{email:""}],districts:[""]}),{handleSubmit:j,formState:{errors:s},control:d,reset:R}=te(),{fields:L,append:V,remove:B}=T({control:d,name:"partnerUsers"}),{fields:Z,append:G,remove:I}=T({control:d,name:"districts"});Q.exports.useEffect(()=>{if(i){const a=`${$}partners/${i}`;S.get(a).then(e=>{const{data:r}=e.data;A(l=>({...l,name:r.name||"",email:r.email||"",slug:r.slug||"",notes:r.notes||"",state:r.state||"",partnerUsers:r.partnerUser||[{email:""}],districts:r.districts||[""]})),R({name:r.name||"",email:r.email||"",slug:r.slug||"",notes:r.notes||"",state:r.state||"",partnerUsers:r.partnerUser||[{email:""}],districts:r.districts||[""]})})}else R({...c,partnerUsers:[""],districts:[""]})},[]);const Y=async a=>{const{name:e,email:r,notes:l,slug:y,partnerUsers:v,districts:b}=a,U=b.filter(u=>u.length>0);try{z();const u=` ${$}partners`,o=await S.post(u,{name:e,email:r,notes:l,slug:y,partner_user:v,districts:U},{headers:{Authorization:`Bearer ${localStorage.getItem("jwt")}`}});o.data.error?p(o.data.message,{variant:"error"}):(p("Partner details added Successfull!",{variant:"success"}),k(),C("/partners"))}catch{p("All fields are mandatory Or Slug should be unique",{variant:"error"}),k()}},_=a=>{const{name:e,email:r,notes:l,partnerUsers:y,districts:v,state:b,slug:U}=a,u=v.filter(o=>o.length>0);S.put(`${$}partners/${i}`,{name:e,email:r||null,notes:l,slug:U,state:b||null,partner_user:y||null,districts:u.length>0?u:null}).then(o=>{o.data.error?p(`Something went wrong, ${o.data.message}`,{variant:"error"}):(p("Partner details Successfull edit",{variant:"success"}),k(),C("/partners"))}).catch(o=>{p(`Something went wrong, ${o}`,{variant:"error"})})},O=a=>{A(e=>({...e,...a})),i?_(a):Y(a)};return t(X,{component:ee,maxWidth:"sm",className:m.root,children:h(n,{container:!0,spacing:2,sx:{p:".4rem"},children:[h(n,{item:!0,xs:12,children:[t(g,{control:d,defaultValue:c.name||"",name:"name",rules:{required:!0,maxLength:40},render:({field:{ref:a,...e}})=>t(f,{variant:"outlined",fullWidth:!0,id:"name",inputRef:a,className:m.spacing,label:"Partner Name",placeholder:"Partner Name",autoComplete:"off",type:"text",error:!!s.name,helperText:s.name&&s.name.type==="maxLength"?"Length should be under 40 characters":"Partner ka Name Enter karein.",...e})}),t(g,{control:d,defaultValue:c.email||"",name:"email",rules:{required:!0,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},render:({field:{ref:a,...e}})=>t(f,{variant:"outlined",fullWidth:!0,id:"email",inputRef:a,className:m.spacing,label:"Email",placeholder:"Email",autoComplete:"off",type:"email",style:{marginTop:"1rem"},error:!!s.email,helperText:s.email?s.email.type==="pattern"?"Please enter a valid email address":"Email ka Address Enter karein.":"Partner ka Email Enter karein.",...e})}),t(g,{control:d,defaultValue:c.notes||"",name:"notes",rules:{required:!0},render:({field:{ref:a,...e}})=>t(f,{variant:"outlined",fullWidth:!0,id:"notes",inputRef:a,className:m.spacing,label:"Notes",placeholder:"Notes",autoComplete:"off",type:"text",style:{marginTop:"1rem"},error:!!s.notes,helperText:s.notes&&s.notes.type==="required"?"Please enter notes":"Partner ki thodi details add karein.",...e})}),t(g,{control:d,defaultValue:c.slug||"",name:"slug",rules:{required:!0},render:({field:{ref:a,...e}})=>t(f,{variant:"outlined",fullWidth:!0,id:"slug",inputRef:a,className:m.spacing,label:"Slug",placeholder:"Slug",autoComplete:"off",type:"text",style:{marginTop:"1rem"},error:!!s.slug,helperText:s.slug&&s.slug.type==="required"?"Please enter slug":"Partner ke student ko online test dene ke liye Slug add karo.",...e})})]}),L.map((a,e)=>{var r;return h(P.Fragment,{children:[t(n,{item:!0,xs:9,children:t(g,{control:d,defaultValue:((r=c.partnerUsers[e])==null?void 0:r.email)||"",name:`partnerUsers[${e}].email`,rules:{required:!0,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},render:({field:{ref:l,...y}})=>t(f,{variant:"outlined",fullWidth:!0,id:`partnerUsers[${e}]`,name:`partnerUsers[${e}]`,inputRef:l,label:`User Email ${e+1}`,placeholder:`User Email ${e+1}`,autoComplete:"off",type:"email",error:!!s.partnerUsers&&!!s.partnerUsers[e],helperText:s.name?"Required Field":`Enter Partner Email ${e+1}`,...y})})}),t(n,{item:!0,xs:2,sx:{display:"flex",alignItems:"center",justifyContent:"left"},children:t(N,{color:"primary",size:"large",onClick:()=>B(e),style:{borderSpacing:"-1"},children:t(q,{})})})]},a.id)}),t(n,{item:!0,xs:12,sx:{mY:"0.2rem"},children:h(x,{variant:"outlined",color:"primary",onClick:()=>V(),children:[t(D,{style:{display:"flex",alignItems:"center",marginRight:"1vh"},children:t(F,{})}),"Add Another Email"]})}),Z.map((a,e)=>h(P.Fragment,{children:[t(n,{item:!0,xs:9,children:t(g,{control:d,defaultValue:c.districts[e]||"",name:`districts[${e}]`,rules:{required:!0},render:({field:{ref:r,...l}})=>t(f,{variant:"outlined",fullWidth:!0,id:`districts[${e}]`,inputRef:r,label:`District ${e+1}`,placeholder:`District ${e+1}`,autoComplete:"off",type:"email",error:!!s.partnerUsers&&!!s.partnerUsers[e],helperText:s.name?"Required Field":`Enter District ${e+1}`,...l})})}),t(n,{item:!0,xs:2,sx:{display:"flex",alignItems:"center",justifyContent:"left"},children:t(N,{color:"primary",size:"large",onClick:()=>I(e),style:{borderSpacing:"-1"},children:t(q,{})})})]},a.id)),t(n,{item:!0,xs:12,sx:{mY:"0.2rem"},children:h(x,{variant:"outlined",color:"primary",onClick:()=>G(),children:[t(D,{style:{display:"flex",alignItems:"center",marginRight:"1vh"},children:t(F,{})}),"Add Another District"]})}),t(n,{item:!0,xs:i?6:12,children:t(x,{fullWidth:!0,variant:"contained",color:"primary",onClick:j(O),className:m.btn,children:i?"Update Partner":"Add Partner"})}),i?t(n,{item:!0,xs:6,children:t(x,{fullWidth:!0,variant:"outlined",color:"primary",onClick:w,className:m.btn,children:"Cancel"})}):null]})})};export{he as default};