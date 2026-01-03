module.exports=[300985,256204,a=>{"use strict";var b=a.i(572131),c=a.i(686797),d=a.i(281213),e=a.i(225829);function f(){try{let a=(0,e.getGeneralSettingsSync)();return{companyName:a.storeName,companyAddress:a.storeAddress,phoneNumber:a.storePhone,storeName:a.storeName,storeAddress:a.storeAddress,storePhone:a.storePhone,logoUrl:a.logoUrl}}catch(a){}return null}function g(a){if(a)return a;try{return(0,e.getGeneralSettingsSync)().logoUrl||void 0}catch(a){}}function h(a){return null==a?"0":new Intl.NumberFormat("vi-VN").format(a)}function i(a){if(!a||0===a)return"Không đồng";let b=["","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"],c=["","nghìn","triệu","tỷ","nghìn tỷ","triệu tỷ"],d=a=>{let c=Math.floor(a/100),d=Math.floor(a%100/10),e=a%10,f="";return c>0&&(f+=b[c]+" trăm "),d>1?(f+=b[d]+" mươi ",1===e?f+="mốt ":5===e?f+="lăm ":e>0&&(f+=b[e]+" ")):1===d?(f+="mười ",5===e?f+="lăm ":e>0&&(f+=b[e]+" ")):0===d&&c>0&&e>0?f+="lẻ "+b[e]+" ":e>0&&(f+=b[e]+" "),f.trim()},e="",f=Math.abs(Math.round(a)),g=0;for(;f>0;){let a=f%1e3;a>0&&(e=d(a)+" "+c[g]+" "+e),f=Math.floor(f/1e3),g++}return e=(e=e.trim()).charAt(0).toUpperCase()+e.slice(1)+" đồng",a<0&&(e="Âm "+e),e}function j(a){if(!a)return"";if(a.length<6)return a;let b=a.slice(0,3),c=a.slice(-3);return`${b}****${c}`}function k(a){return(0,d.formatDateForDisplay)(a)}function l(a){return(0,d.formatTimeForDisplay)(a)}function m(a,b){let c=a;return Object.entries(b).forEach(([a,b])=>{if(!Array.isArray(b)){let d=a.startsWith("{")?a:`{${a}}`,e=b?.toString()||"";c=c.split(d).join(e)}}),c}function n(a){let b=new Date,c=g(a.logo);return{"{store_logo}":c?`<img src="${c}" alt="Logo" style="max-height:60px"/>`:"","{store_name}":a.name||"","{store_address}":a.address||"","{store_phone_number}":a.phone||"","{hotline}":a.hotline||a.phone||"","{store_hotline}":a.hotline||a.phone||"","{store_email}":a.email||"","{store_fax}":a.fax||"","{store_website}":a.website||"","{store_tax_code}":a.taxCode||"","{print_date}":k(b),"{print_time}":l(b)}}function o(a){if(null==a||""===a)return!0;let b=String(a).trim();return"0"===b||"0đ"===b||"0 đ"===b}function p(a,b){let c=a;return(c=c.replace(/\{\{#line_if_not_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/line_if_not_empty\}\}/gi,(a,c,d)=>o(b[`{${c}}`])?"":d)).replace(/\{\{#line_if_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/line_if_empty\}\}/gi,(a,c,d)=>o(b[`{${c}}`])?d:"")}function q(a){let d=(0,c.usePrintTemplateStore)(),[e]=b.useState(!1),f=b.useCallback((b,c,e)=>{let f=c||d.getDefaultSize(b),g=e||a,h=d.getTemplate(b,f,g);if(h?.content)return h.content;let i=d.getTemplate(b,f);return i?.content||null},[d,a]),g=b.useCallback((a,b,c)=>{let d,e,f,g,h=a;if(console.log("[processTemplate] Starting, lineItems count:",c?.length),c&&c.length>0){let a=/\{\{#line_items\}\}([\s\S]*?)\{\{\/line_items\}\}/gi,d=h.match(a);if(console.log("[processTemplate] Block match found:",!!d,d?.length),d&&d.length>0)h=h.replace(a,(a,d)=>c.map((a,c)=>{let e=d;return e=e.replace(/\{line_index\}/g,String(c+1)),Object.entries(a).forEach(([a,b])=>{let c=RegExp((a.startsWith("{")?a:`{${a}}`).replace(/[{}]/g,"\\$&"),"g");e=e.replace(c,b?.toString()||"")}),Object.entries(b).forEach(([a,b])=>{let c=RegExp((a.startsWith("{")?a:`{${a}}`).replace(/[{}]/g,"\\$&"),"g");e=e.replace(c,b?.toString()||"")}),e}).join("\n"));else{let a=h.match(/<table[^>]*>[\s\S]*?<\/table>/gi);if(a){let b=a.find(a=>a.includes("{line_stt}"));if(b){let a=b.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);if(a){let d=a[1].match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);if(d&&d.length>0){let e=d.find(a=>a.includes("{line_stt}"))||d[0],f=c.map(a=>{let b=e;return b=p(b,a),Object.entries(a).forEach(([a,c])=>{let d=RegExp((a.startsWith("{")?a:`{${a}}`).replace(/[{}]/g,"\\$&"),"g");b=b.replace(d,c?.toString()||"")}),b}).join("\n    "),g=`<tbody>
    ${f}
  </tbody>`,i=b.replace(a[0],g);h=h.replace(b,i)}}else{let a=b.match(/<thead[^>]*>[\s\S]*?<\/thead>/i),d=b;a&&(d=b.replace(a[0],""));let e=d.match(/<tr[^>]*>[\s\S]*?\{line_stt\}[\s\S]*?<\/tr>/i);if(e){let a=e[0],d=c.map(b=>{let c=a;return c=p(c,b),Object.entries(b).forEach(([a,b])=>{let d=RegExp((a.startsWith("{")?a:`{${a}}`).replace(/[{}]/g,"\\$&"),"g");c=c.replace(d,b?.toString()||"")}),c}).join("\n    "),f=b.replace(a,d);h=h.replace(b,f)}}}}}}return d=(d=(d=(d=h).replace(/\{\{#if_not_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/if_not_empty\}\}/gi,(a,c,d)=>o(b[`{${c}}`])?"":d)).replace(/\{\{#if_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/if_empty\}\}/gi,(a,c,d)=>o(b[`{${c}}`])?d:"")).replace(/\{\{#if_gt\s+\{([^}]+)\}\s+(\d+)\}\}([\s\S]*?)\{\{\/if_gt\}\}/gi,(a,c,d,e)=>parseFloat((b[`{${c}}`]||"0").toString().replace(/[^\d.-]/g,""))>parseFloat(d)?e:""),e=!o(b["{total_tax}"]),f=!o(b["{total_discount}"]),g={has_tax:e,has_discount:f,has_delivery_fee:!o(b["{delivery_fee}"]),has_note:!o(b["{order_note}"]),has_shipping_address:!o(b["{shipping_address}"]),has_customer_email:!o(b["{customer_email}"]),has_customer_phone:!o(b["{customer_phone_number}"])},h=m(h=d=(d=d.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi,(a,b,c)=>g[b]?c:"")).replace(/\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi,(a,b,c)=>g[b]?"":c),b)},[]),h=b.useCallback((a,b)=>{let c,{data:e,lineItems:h,paperSize:i,branchId:j}=b;console.log("[usePrint] Starting print for type:",a),console.log("[usePrint] Data keys:",Object.keys(e)),console.log("[usePrint] LineItems count:",h?.length||0);let k=i||d.getDefaultSize(a),l=f(a,k,j);if(!l)return void console.error(`[usePrint] No template found for type: ${a}`);console.log("[usePrint] Template found, length:",l.length);try{c=g(l,e,h),console.log("[usePrint] Template processed, html length:",c.length)}catch(a){console.error("[usePrint] Error processing template:",a);return}let m=document.createElement("iframe");m.style.position="absolute",m.style.top="-10000px",m.style.left="-10000px",document.body.appendChild(m);let n=m.contentDocument||m.contentWindow?.document;if(n){let b=`
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
      `;n.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${a}</title>
          <style>${b}</style>
        </head>
        <body>${c}</body>
        </html>
      `),n.close(),setTimeout(()=>{m.contentWindow?.print(),setTimeout(()=>{document.body.contains(m)&&document.body.removeChild(m)},1e3)},100)}},[d,f,g]),i=b.useCallback((a,b)=>{if(0===b.length)return;let c=b[0],e=c.paperSize||d.getDefaultSize(a),h=f(a,e,c.branchId);if(!h)return void console.error(`[usePrint] No template found for type: ${a}`);let i=b.map((a,c)=>{let d=g(h,a.data,a.lineItems);return c<b.length-1?`<div class="print-page" style="page-break-after: always; break-after: page;">${d}</div>`:`<div class="print-page-last">${d}</div>`}).join("\n"),j=document.createElement("iframe");j.style.position="absolute",j.style.top="-10000px",j.style.left="-10000px",document.body.appendChild(j);let k=j.contentDocument||j.contentWindow?.document;if(k){let c=`
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
        .print-page { 
          page-break-after: always !important; 
          break-after: page !important;
          page-break-inside: avoid;
        }
        .print-page-last { 
          page-break-after: auto; 
        }
        @media print {
          .print-page { 
            page-break-after: always !important; 
            break-after: page !important;
          }
          .print-page-last { 
            page-break-after: auto; 
          }
        }
      `;k.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${b.length} ${a}</title>
          <style>${c}</style>
        </head>
        <body>${i}</body>
        </html>
      `),k.close(),setTimeout(()=>{j.contentWindow?.print(),setTimeout(()=>{document.body.contains(j)&&document.body.removeChild(j)},1e3)},100)}},[d,f,g]),j=b.useCallback(a=>{if(0===a.length)return;let b=[];if(a.forEach((c,e)=>{let{type:h,options:i}=c,{data:j,lineItems:k,paperSize:l,branchId:m}=i,n=l||d.getDefaultSize(h),o=f(h,n,m);if(!o)return void console.warn(`[printMixedDocuments] No template found for type: ${h}, skipping`);let p=g(o,j,k);e<a.length-1?b.push(`<div class="print-page" style="page-break-after: always; break-after: page;">${p}</div>`):b.push(`<div class="print-page-last">${p}</div>`)}),0===b.length)return void console.error("[printMixedDocuments] No documents to print");let c=b.join("\n"),e=document.createElement("iframe");e.style.position="absolute",e.style.top="-10000px",e.style.left="-10000px",document.body.appendChild(e);let h=e.contentDocument||e.contentWindow?.document;if(h){let b=`
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
        .print-page { 
          page-break-after: always !important; 
          break-after: page !important;
          page-break-inside: avoid;
        }
        .print-page-last { 
          page-break-after: auto; 
        }
        @media print {
          .print-page { 
            page-break-after: always !important; 
            break-after: page !important;
          }
          .print-page-last { 
            page-break-after: auto; 
          }
        }
      `;h.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${a.length} t\xe0i liệu</title>
          <style>${b}</style>
        </head>
        <body>${c}</body>
        </html>
      `),h.close(),setTimeout(()=>{e.contentWindow?.print(),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},1e3)},100)}},[d,f,g]),k=b.useCallback((a,b)=>{let{data:c,lineItems:d,paperSize:e,branchId:h}=b,i=f(a,e,h);return i?g(i,c,d):'<p style="color: red;">Không tìm thấy mẫu in</p>'},[f,g]),l=b.useCallback((b,c)=>{let e=c||d.getDefaultSize(b),f=d.getTemplate(b,e,a);return!!f?.content},[d,a]);return{print:h,printMultiple:i,printMixedDocuments:j,getPreview:k,hasTemplate:l,getAvailableSizes:b.useCallback(b=>["K57","K80","A4","A5"].filter(c=>{let e=d.getTemplate(b,c,a);return!!e?.content}),[d,a]),getDefaultSize:b.useCallback(a=>d.getDefaultSize(a),[d]),isLoading:e}}a.s(["formatCurrency",()=>h,"formatDate",()=>k,"formatTime",()=>l,"getGeneralSettings",()=>f,"getStoreData",()=>n,"getStoreLogo",()=>g,"hidePhoneMiddle",()=>j,"numberToWords",()=>i,"replaceVariables",()=>m],256204),a.s(["usePrint",()=>q],300985)}];

//# sourceMappingURL=lib_use-print_ts_819102f3._.js.map