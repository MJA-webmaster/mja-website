(()=>{var e={};e.id=6140,e.ids=[6140],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},7057:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>l.a,__next_app__:()=>m,originalPathname:()=>h,pages:()=>c,routeModule:()=>p,tree:()=>d}),a(9369),a(7614),a(2039),a(5866);var s=a(3191),r=a(8716),i=a(7922),l=a.n(i),n=a(5231),o={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);a.d(t,o);let d=["",{children:["admin",{children:["settings",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,9369)),"/Users/hasanshazil/mja-website/app/admin/settings/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,7614)),"/Users/hasanshazil/mja-website/app/admin/layout.tsx"]}]},{layout:[()=>Promise.resolve().then(a.bind(a,2039)),"/Users/hasanshazil/mja-website/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}],c=["/Users/hasanshazil/mja-website/app/admin/settings/page.tsx"],h="/admin/settings/page",m={require:a,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/admin/settings/page",pathname:"/admin/settings",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},7843:(e,t,a)=>{Promise.resolve().then(a.bind(a,6353))},7646:(e,t,a)=>{Promise.resolve().then(a.bind(a,6427))},6353:(e,t,a)=>{"use strict";a.d(t,{default:()=>l});var s=a(326),r=a(7577),i=a(2945);function l({settings:e}){let[t,a]=(0,r.useState)(e),[l,n]=(0,r.useState)(!1),[o,d]=(0,r.useState)("");function c(e){a({...t,[e.target.name]:e.target.value})}async function h(){n(!0),d("");let e=(0,i.e)(),{error:a}=await e.from("settings").upsert({id:1,...t,updated_at:new Date().toISOString()});n(!1),d(a?"Error saving":"Settings saved!"),setTimeout(()=>d(""),3e3)}return(0,s.jsxs)("div",{className:"max-w-2xl",children:[(0,s.jsxs)("div",{className:"flex items-center justify-between mb-8",children:[(0,s.jsxs)("div",{children:[s.jsx("h1",{className:"font-headline text-3xl font-bold text-navy",children:"Settings"}),s.jsx("p",{className:"text-gray-400 text-sm mt-1",children:"Site-wide configuration for MJA website"})]}),(0,s.jsxs)("div",{className:"flex items-center gap-3",children:[o&&s.jsx("span",{className:`text-sm font-semibold ${o.includes("Error")?"text-red-500":"text-green-600"}`,children:o}),s.jsx("button",{onClick:h,disabled:l,className:"text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50",style:{backgroundColor:"#E8192C"},children:l?"Saving...":"Save Settings"})]})]}),s.jsx("div",{className:"space-y-6",children:[{title:"General",fields:[{name:"site_name",label:"Site Name",placeholder:"Maldives Journalists Association"},{name:"email",label:"Contact Email",placeholder:"info@mja.mv",type:"email"},{name:"phone",label:"Phone Number",placeholder:"+960 300 0000"},{name:"address",label:"Address",placeholder:"Mal\xe9, Republic of Maldives"}]},{title:"Social Media",fields:[{name:"facebook",label:"Facebook URL",placeholder:"https://facebook.com/MaldivesJournalists"},{name:"instagram",label:"Instagram URL",placeholder:"https://instagram.com/mja.mv"},{name:"twitter",label:"Twitter / X URL",placeholder:"https://twitter.com/MJAMaldives"},{name:"linkedin",label:"LinkedIn URL",placeholder:"https://linkedin.com/company/mja"}]}].map(e=>(0,s.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-6",children:[s.jsx("h2",{className:"font-semibold text-navy text-sm mb-5 pb-3 border-b border-gray-100",children:e.title}),s.jsx("div",{className:"space-y-4",children:e.fields.map(e=>(0,s.jsxs)("div",{children:[s.jsx("label",{className:"block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5",children:e.label}),s.jsx("input",{type:e.type||"text",name:e.name,value:t[e.name]??"",onChange:c,placeholder:e.placeholder,className:"w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-navy focus:outline-none",onFocus:e=>e.target.style.borderColor="#E8192C",onBlur:e=>e.target.style.borderColor="#E5E7EB"})]},e.name))})]},e.title))})]})}},6427:(e,t,a)=>{"use strict";a.d(t,{default:()=>j});var s=a(326),r=a(434),i=a(5047),l=a(2945),n=a(4319),o=a(6283),d=a(2679),c=a(6343),h=a(7358),m=a(8932),p=a(4061),u=a(210),x=a(6226),y=a(9819),g=a(7427),b=a(5508),f=a(5932),v=a(8378),k=a(1810);let w=[{label:"Dashboard",href:"/admin",icon:n.Z},{divider:"Content"},{label:"Articles",href:"/admin/articles",icon:o.Z},{label:"Campaigns",href:"/admin/campaigns",icon:d.Z},{label:"Pages",href:"/admin/pages",icon:c.Z},{label:"Activities",href:"/admin/activities",icon:h.Z},{label:"Resources",href:"/admin/resources",icon:m.Z},{divider:"People"},{label:"Members",href:"/admin/members",icon:p.Z},{label:"Applications",href:"/admin/applications",icon:u.Z},{label:"Board Members",href:"/admin/executive",icon:x.Z},{label:"Team",href:"/admin/team",icon:y.Z},{label:"Supporters",href:"/admin/supporters",icon:g.Z},{divider:"Data"},{label:"Member Stats",href:"/admin/member-stats",icon:b.Z},{label:"Newsletter",href:"/admin/newsletter",icon:f.Z},{label:"Settings",href:"/admin/settings",icon:v.Z}];function j(){let e=(0,i.usePathname)(),t=(0,i.useRouter)();async function a(){let e=(0,l.e)();await e.auth.signOut(),t.push("/login")}return(0,s.jsxs)("aside",{className:"w-60 bg-navy flex flex-col flex-shrink-0",style:{backgroundColor:"#0D1B2A"},children:[s.jsx("div",{className:"p-5 border-b border-white/10",children:s.jsx(r.default,{href:"/",target:"_blank",children:s.jsx("img",{src:"/mjalogo.png",alt:"MJA",className:"h-8 w-auto brightness-0 invert"})})}),s.jsx("nav",{className:"flex-1 px-3 py-4 overflow-y-auto",children:w.map((t,a)=>{if("divider"in t)return s.jsx("p",{className:"text-[10px] font-bold uppercase tracking-widest text-white/20 px-3 pt-5 pb-2",children:t.divider},a);let i=t.icon,l="/admin"===t.href?"/admin"===e:e?.startsWith(t.href);return(0,s.jsxs)(r.default,{href:t.href,className:`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${l?"text-white font-semibold":"text-white/50 hover:text-white hover:bg-white/5"}`,style:l?{backgroundColor:"#E8192C"}:{},children:[s.jsx(i,{size:16,strokeWidth:1.75}),t.label]},t.href)})}),s.jsx("div",{className:"p-4 border-t border-white/10",children:(0,s.jsxs)("button",{onClick:a,className:"w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5",children:[s.jsx(k.Z,{size:16,strokeWidth:1.75}),"Sign Out"]})})]})}},2945:(e,t,a)=>{"use strict";a.d(t,{e:()=>r});var s=a(4782);function r(){return(0,s.createBrowserClient)(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}},2881:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});var s=a(7577);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),i=(...e)=>e.filter((e,t,a)=>!!e&&a.indexOf(e)===t).join(" ");/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var l={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,s.forwardRef)(({color:e="currentColor",size:t=24,strokeWidth:a=2,absoluteStrokeWidth:r,className:n="",children:o,iconNode:d,...c},h)=>(0,s.createElement)("svg",{ref:h,...l,width:t,height:t,stroke:e,strokeWidth:r?24*Number(a)/Number(t):a,className:i("lucide",n),...c},[...d.map(([e,t])=>(0,s.createElement)(e,t)),...Array.isArray(o)?o:[o]])),o=(e,t)=>{let a=(0,s.forwardRef)(({className:a,...l},o)=>(0,s.createElement)(n,{ref:o,iconNode:t,className:i(`lucide-${r(e)}`,a),...l}));return a.displayName=`${e}`,a}},6226:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("Award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]])},5508:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("BarChart2",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]])},6343:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]])},7358:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]])},210:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]])},6283:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},8932:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]])},7427:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]])},4319:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]])},1810:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]])},5932:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]])},2679:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("Megaphone",[["path",{d:"m3 11 18-5v12L3 14v-3z",key:"n962bs"}],["path",{d:"M11.6 16.8a3 3 0 1 1-5.8-1.6",key:"1yl0tm"}]])},8378:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},9819:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]])},4061:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(2881).Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},7614:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>d});var s=a(9510),r=a(8570);let i=(0,r.createProxy)(String.raw`/Users/hasanshazil/mja-website/components/AdminSidebar.tsx`),{__esModule:l,$$typeof:n}=i;i.default;let o=(0,r.createProxy)(String.raw`/Users/hasanshazil/mja-website/components/AdminSidebar.tsx#default`);function d({children:e}){return(0,s.jsxs)("div",{className:"flex h-screen bg-gray-50 overflow-hidden",children:[s.jsx(o,{}),s.jsx("main",{className:"flex-1 overflow-y-auto",children:s.jsx("div",{className:"p-8",children:e})})]})}},9369:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>h,dynamic:()=>c});var s=a(9510),r=a(9692),i=a(8570);let l=(0,i.createProxy)(String.raw`/Users/hasanshazil/mja-website/app/admin/settings/SettingsClient.tsx`),{__esModule:n,$$typeof:o}=l;l.default;let d=(0,i.createProxy)(String.raw`/Users/hasanshazil/mja-website/app/admin/settings/SettingsClient.tsx#default`),c="force-dynamic";async function h(){let e=(0,r.e)(),{data:t}=await e.from("settings").select("*").single();return s.jsx(d,{settings:t??{}})}},9692:(e,t,a)=>{"use strict";a.d(t,{e:()=>i});var s=a(7721),r=a(1615);function i(){let e=(0,r.cookies)();return(0,s.createServerClient)(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:a,options:s})=>e.set(t,a,s))}catch{}}}})}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[8948,2295,4782,2921,9702,598],()=>a(7057));module.exports=s})();