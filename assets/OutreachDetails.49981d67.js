import{b8 as d,aG as h,r as b,aR as l,ba as m,cd as u,b9 as t,dh as p,di as f,dj as c,dk as s,dl as N}from"./vendor.8941a3ab.js";import{a as C}from"./vendor_axios.5abceb0c.js";import"./vendor_core_js_pure.ebf27e63.js";const g=d(()=>({root:{display:"flex",overflowX:"hide",marginRight:"auto",marginLeft:"auto",marginTop:"70px"},table:{minWidth:340},tableCell:{fontSize:"16px"}})),x="https://join.navgurukul.org/api/",y=()=>{const a=g(),[r,o]=h.useState({details:[],teamList:[]});return b.exports.useEffect(()=>{C.get(`${x}outreach/records`).then(e=>{o({outreachDetails:e.data,listOfOutreachTeam:Object.keys(e.data)})}).catch(e=>console.error(e))},[]),l(m,{children:l(u,{className:a.root,children:t(p,{className:a.table,children:[l(f,{children:t(c,{children:[t(s,{className:a.tableCell,children:[" ","Outreach coordinator email"]}),l(s,{className:a.tableCell,children:"Number of partners"}),t(s,{className:a.tableCell,children:[" ","Number of students"," "]})]})}),l(N,{children:r.teamList.map(e=>t(c,{children:[l(s,{className:a.tableCell,children:e}),l(s,{className:a.tableCell,children:r.details[e].partners.length}),l(s,{className:a.tableCell,children:r.details[e].partners.reduce((i,n)=>i+Object.values(n)[0],0)})]},e))})]})})})};export{y as default};