"use strict";(()=>{var e={};e.id=6041,e.ids=[6041],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6687:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>f,patchFetch:()=>h,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>x,staticGenerationAsyncStorage:()=>m});var r={};o.r(r),o.d(r,{POST:()=>d});var i=o(9303),n=o(8716),a=o(670),s=o(7495),p=o(7070);let l=["Professional","Student","Corporate"];async function d(e){try{let{membership_type:t,full_name:o,common_name:r,id_card_no:i,email:n,mobile_no:a,employment_type:d,nature_of_work:u,workplace_name:c,designation:m,atoll_island:x,message:f,declaration:h,photo_url:y,id_card_url:g,portfolio_url:v}=await e.json();if(!l.includes(t))return p.NextResponse.json({error:"Invalid membership type."},{status:400});if(!o||!n||!a||!i)return p.NextResponse.json({error:"Please fill in all required fields."},{status:400});if(!h)return p.NextResponse.json({error:"The declaration must be accepted."},{status:400});let b="Corporate"===t,A=(0,s.eI)(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY),{error:w}=await A.from("membership_applications").insert({membership_type:t,full_name:o,common_name:r||null,id_card_no:i,email:n,mobile_no:a,employment_type:b?null:d,nature_of_work:b?null:u,workplace_name:c||null,designation:m||null,atoll_island:x||null,message:f||null,declaration:!0,photo_url:y||null,id_card_url:g||null,portfolio_url:v||null,status:"pending"});if(w)return console.error("Application insert failed:",w),p.NextResponse.json({error:"Could not save your application."},{status:500});let _=process.env.RESEND_API_KEY,C=process.env.MJA_EMAIL,E=process.env.MJA_FROM_EMAIL||"MJA Website <onboarding@resend.dev>";if(_&&C){let e=[[b?"Organisation":"Full Name",o],[b?"Contact Person":"Common Name",r],[b?"Registration No.":"ID Card No.",i],["Email",n],["Mobile",a],["Membership Type",t],["Employment Type",b?null:d],["Nature of Work",b?null:u],["Workplace",c],["Designation",m],["Atoll / Island",x]].filter(([,e])=>!!e).map(([e,t])=>`
            <div style="display:flex;padding:8px 0;border-bottom:1px solid #f3f4f6;">
              <span style="color:#9CA3AF;font-size:13px;width:150px;flex-shrink:0;">${e}</span>
              <span style="color:#0D1B2A;font-size:13px;font-weight:500;">${t}</span>
            </div>`).join(""),s=e=>fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${_}`,"Content-Type":"application/json"},body:JSON.stringify(e)}).catch(e=>console.error("Resend failed:",e));await s({from:E,to:[n],subject:"We received your MJA membership application",html:`
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0D1B2A;padding:28px;border-radius:8px 8px 0 0;">
              <h1 style="color:white;margin:0;font-size:20px;">Application Received</h1>
            </div>
            <div style="background:#f9fafb;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
              <p style="color:#0D1B2A;font-size:14px;line-height:1.6;margin-top:0;">
                Thank you for applying for ${t} membership with the Maldives
                Journalists Association. Our team will review your application and respond
                within 3 business days.
              </p>
              <div style="margin-top:20px;">${e}</div>
              <p style="color:#9CA3AF;font-size:12px;margin-top:24px;line-height:1.6;">
                Questions? Contact us at
                <a href="mailto:${C}" style="color:#E8192C;">${C}</a>
              </p>
            </div>
            <p style="text-align:center;color:#9CA3AF;font-size:11px;margin-top:20px;">
              \xa9 ${new Date().getFullYear()} Maldives Journalists Association \xb7 mja.mv
            </p>
          </div>`}),await s({from:E,to:[C],subject:`New ${t} Application — ${o}`,html:`
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#E8192C;padding:24px;border-radius:8px 8px 0 0;">
              <h1 style="color:white;margin:0;font-size:20px;">New Membership Application</h1>
            </div>
            <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
              ${e}
              ${f?`<p style="color:#6B7280;font-size:13px;margin-top:16px;">${f}</p>`:""}
              <p style="margin-top:24px;">
                <a href="https://mja.mv/admin/applications"
                   style="background:#E8192C;color:white;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;">
                  Review in Admin
                </a>
              </p>
            </div>
          </div>`})}return p.NextResponse.json({ok:!0})}catch(e){return console.error("Apply route error:",e),p.NextResponse.json({error:"Something went wrong."},{status:500})}}let u=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/apply/route",pathname:"/api/apply",filename:"route",bundlePath:"app/api/apply/route"},resolvedPagePath:"/Users/hasanshazil/mja-website/app/api/apply/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:c,staticGenerationAsyncStorage:m,serverHooks:x}=u,f="/api/apply/route";function h(){return(0,a.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:m})}}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[8948,2921,5972],()=>o(6687));module.exports=r})();