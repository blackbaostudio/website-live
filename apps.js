function g(e,t,o=new Float32Array(16)){let i=new Float32Array(16);for(let r=0;r<4;r++)for(let a=0;a<4;a++)i[r*4+a]=e[a]*t[r*4]+e[4+a]*t[r*4+1]+e[8+a]*t[r*4+2]+e[12+a]*t[r*4+3];return o.set(i),o}function v(e,t=[0,0,0],o=1){let[i,r,a]=typeof o==="number"?[o,o,o]:o,n=Math.cos(t[0]),l=Math.sin(t[0]),s=Math.cos(t[1]),c=Math.sin(t[1]),u=Math.cos(t[2]),h=Math.sin(t[2]),f=n*u,m=n*h,y=l*u,b=l*h,p=new Float32Array(16);return p[0]=s*u*i,p[4]=-s*h*r,p[8]=c*a,p[1]=(m+y*c)*i,p[5]=(f-b*c)*r,p[9]=-l*s*a,p[2]=(b-f*c)*i,p[6]=(y+m*c)*r,p[10]=n*s*a,p[12]=e[0],p[13]=e[1],p[14]=e[2],p[15]=1,p}function H(e){let[t,o,i,r,a,n,l,s,c,u,h,f,m,y,b,p]=e,x=t*n-o*a,w=t*l-i*a,S=t*s-r*a,A=o*l-i*n,P=o*s-r*n,k=i*s-r*l,M=c*y-u*m,U=c*b-h*m,N=c*p-f*m,B=u*b-h*y,G=u*p-f*y,V=h*p-f*b,T=1/(x*V-w*G+S*B+A*N-P*U+k*M);return new Float32Array([(n*V-l*G+s*B)*T,(i*G-o*V-r*B)*T,(y*k-b*P+p*A)*T,(h*P-u*k-f*A)*T,(l*N-a*V-s*U)*T,(t*V-i*N+r*U)*T,(b*S-m*k-p*w)*T,(c*k-h*S+f*w)*T,(a*G-n*N+s*M)*T,(o*N-t*G-r*M)*T,(m*P-y*S+p*x)*T,(u*S-c*P-f*x)*T,(n*U-a*B-l*M)*T,(t*B-o*U+i*M)*T,(y*w-m*A-b*x)*T,(c*A-u*w+h*x)*T])}var R=(e,t)=>{let o=e[3]*t[0]+e[7]*t[1]+e[11]*t[2]+e[15]||1;return[(e[0]*t[0]+e[4]*t[1]+e[8]*t[2]+e[12])/o,(e[1]*t[0]+e[5]*t[1]+e[9]*t[2]+e[13])/o,(e[2]*t[0]+e[6]*t[1]+e[10]*t[2]+e[14])/o]},ee=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],ce=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],J=(e)=>{let t=Math.hypot(...e)||1;return[e[0]/t,e[1]/t,e[2]/t]};class te{position=[0,0,10];target=[0,0,0];fov=50;zoom=1;near=0.1;far=100;aspect=1;ortho=0;world(){let e=J(ee(this.position,this.target)),t=ce([0,1,0],e);if(Math.hypot(...t)<0.000001)t=ce([0,0,1],e);t=J(t);let o=ce(e,t);return new Float32Array([...t,0,...o,0,...e,0,...this.position,1])}view(){return H(this.world())}direction(){return J(ee(this.target,this.position))}projection(){let e=new Float32Array(16),{near:t,far:o}=this;if(this.ortho){let r=this.ortho;return e[0]=1/r,e[5]=1/r,e[10]=-2/(o-t),e[14]=-(o+t)/(o-t),e[15]=1,e}let i=t*Math.tan(this.fov*Math.PI/360)/this.zoom;return e[0]=t/(i*this.aspect),e[5]=t/i,e[10]=-(o+t)/(o-t),e[11]=-1,e[14]=-2*o*t/(o-t),e}viewProjection(){return g(this.projection(),this.view())}ray(e,t){let o=H(this.viewProjection()),i=R(o,[e,t,-1]),r=R(o,[e,t,1]);return{origin:i,dir:J(ee(r,i))}}}function z(e,t,o,i){let r=H(e),a=R(r,i.origin),n=R(r,[i.origin[0]+i.dir[0],i.origin[1]+i.dir[1],i.origin[2]+i.dir[2]]),l=ee(n,a);if(Math.abs(l[2])<0.000000001)return null;let s=-a[2]/l[2];if(s<0)return null;let c=a[0]+l[0]*s,u=a[1]+l[1]*s;if(Math.abs(c)>t/2||Math.abs(u)>o/2)return null;return{uv:[c/t+0.5,u/o+0.5],t:s}}function C(e,t,o){let i=(l,s)=>{let c=e.createShader(l);if(e.shaderSource(c,`#version 300 es
precision highp float;
precision highp int;
${s}`),e.compileShader(c),!e.getShaderParameter(c,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(c)??"shader");return c},r=e.createProgram();if(e.attachShader(r,i(e.VERTEX_SHADER,t)),e.attachShader(r,i(e.FRAGMENT_SHADER,o)),e.bindAttribLocation(r,0,"position"),e.bindAttribLocation(r,1,"normal"),e.bindAttribLocation(r,2,"uv"),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw Error(e.getProgramInfoLog(r)??"link");let a={},n=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let l=0;l<n;l++){let s=e.getActiveUniform(r,l).name;a[s]=e.getUniformLocation(r,s)}return{program:r,u:a}}function oe(e,t){let o=e.createVertexArray();e.bindVertexArray(o);let i=(l,s,c)=>{if(!s)return;let u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,s,e.STATIC_DRAW),e.enableVertexAttribArray(l),e.vertexAttribPointer(l,c,e.FLOAT,!1,0,0)};i(0,t.position,3),i(1,t.normal,3),i(2,t.uv,2);let r=null;if(t.index){let l=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,l),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.index,e.STATIC_DRAW),r=t.index instanceof Uint32Array?e.UNSIGNED_INT:e.UNSIGNED_SHORT}e.bindVertexArray(null);let a=[1/0,1/0,1/0],n=[-1/0,-1/0,-1/0];for(let l=0;l<t.position.length;l+=3)for(let s=0;s<3;s++)a[s]=Math.min(a[s],t.position[l+s]),n[s]=Math.max(n[s],t.position[l+s]);return{vao:o,count:t.index?t.index.length:t.position.length/3,indexType:r,box:{min:a,max:n}}}function W(e,t){if(e.bindVertexArray(t.vao),t.indexType!==null)e.drawElements(e.TRIANGLES,t.count,t.indexType,0);else e.drawArrays(e.TRIANGLES,0,t.count)}var L=(e,t,o)=>oe(e,{position:new Float32Array([-t/2,o/2,0,t/2,o/2,0,-t/2,-o/2,0,t/2,-o/2,0]),normal:new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1]),uv:new Float32Array([0,1,1,1,0,0,1,0]),index:new Uint16Array([0,2,1,2,3,1])});function ue(e,t,o={}){let i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i);let r=o.repeat?e.REPEAT:e.CLAMP_TO_EDGE;if(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,o.mipmap?e.LINEAR_MIPMAP_LINEAR:e.LINEAR),t)pe(e,i,t,o);else e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));return i}function pe(e,t,o,i={}){if(e.bindTexture(e.TEXTURE_2D,t),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,i.flipY??!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,o),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),i.mipmap)e.generateMipmap(e.TEXTURE_2D)}function ie(e,t,o,i=!1){let r=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,r);let a=null,n;if(i){n=e.createTexture(),e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,t,o,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null);for(let[l,s]of[[e.TEXTURE_MIN_FILTER,e.NEAREST],[e.TEXTURE_MAG_FILTER,e.NEAREST],[e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE],[e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE]])e.texParameteri(e.TEXTURE_2D,l,s);e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,n,0)}else a=ue(e),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,o,0,e.RGBA,e.UNSIGNED_BYTE,null),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0),n=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,n),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT24,t,o),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,n);return e.bindFramebuffer(e.FRAMEBUFFER,null),{fb:r,color:a,depth:n,w:t,h:o}}function ke(e,t,o,i){if(t.w===o&&t.h===i)return;t.w=o,t.h=i,e.bindTexture(e.TEXTURE_2D,t.color),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,o,i,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindRenderbuffer(e.RENDERBUFFER,t.depth),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT24,o,i)}function Y(e){let t=parseInt(e.slice(1),16);return[t>>16&255,t>>8&255,t&255].map((o)=>o/255)}var rt={SCALAR:1,VEC2:2,VEC3:3,VEC4:4};function he(e){let t=new DataView(e);if(t.getUint32(0,!0)!==1179937895)throw Error("not a glb");let o=t.getUint32(12,!0),i=JSON.parse(new TextDecoder().decode(new Uint8Array(e,20,o))),r=20+o+8,a=(c)=>{let u=i.accessors[c],h=i.bufferViews[u.bufferView],f=r+(h.byteOffset??0)+(u.byteOffset??0),m=rt[u.type],y=u.componentType===5126||u.componentType===5125?4:u.componentType===5123?2:0;if(!y)throw Error(`component type ${u.componentType}`);let b=u.componentType===5126?new Float32Array(u.count*m):u.componentType===5125?new Uint32Array(u.count*m):new Uint16Array(u.count*m),p=h.byteStride??m*y;for(let x=0;x<u.count;x++)for(let w=0;w<m;w++){let S=f+x*p+w*y;b[x*m+w]=u.componentType===5126?t.getFloat32(S,!0):u.componentType===5125?t.getUint32(S,!0):t.getUint16(S,!0)}return b},n={};for(let c of i.meshes){let u=c.primitives[0];n[c.name]={position:a(u.attributes.POSITION),normal:u.attributes.NORMAL!==void 0?a(u.attributes.NORMAL):void 0,uv:u.attributes.TEXCOORD_0!==void 0?a(u.attributes.TEXCOORD_0):void 0,index:u.indices!==void 0?a(u.indices):void 0}}let l=i.images?.[0],s;if(l){let c=i.bufferViews[l.bufferView];s=new Blob([new Uint8Array(e,r+(c.byteOffset??0),c.byteLength)],{type:l.mimeType})}return{meshes:n,image:s}}var de=(e)=>{let t=document.createElement("canvas");return t.width=t.height=e,[t,t.getContext("2d")]},Ce=(e)=>{let t=parseInt(e.slice(1),16),[o,i,r]=[t>>16&255,t>>8&255,t&255].map((a)=>{let n=a/255;return n<=0.03928?n/12.92:((n+0.055)/1.055)**2.4});return 0.2126*o+0.7152*i+0.0722*r>0.35};function Pe(e){let[o,i]=de(512),r=14,a=236,n=214;i.beginPath();for(let h=0;h<=360;h++){let f=h/360*Math.PI*2,m=214+22*(0.5+0.5*Math.cos(f*14)),y=256+Math.cos(f)*m,b=256+Math.sin(f)*m;if(h)i.lineTo(y,b);else i.moveTo(y,b)}i.closePath(),i.fillStyle="#f4f4f6",i.fill();let[l,s]=de(512);s.fillStyle="#111",s.textAlign="center",s.textBaseline="middle";let c=(h)=>`800 ${h}px Inter, ui-sans-serif, system-ui, sans-serif`,u=104;s.font=c(u);while(u>40&&s.measureText(e).width>310.3)s.font=c(u-=4);return s.save(),s.translate(256,256),s.rotate(-0.08),s.fillText(e,0,8),s.restore(),{badge:o,text:l}}function Le(e){let[o,i]=de(1024),r=Ce(e.cover.bg)?"#111111":"#f4f4f4",a=Ce(e.cover.bg)?"rgba(17,17,17,0.6)":"rgba(244,244,244,0.62)";i.fillStyle=e.cover.bg,i.fillRect(0,0,1024,1024);let n=84,l=(s,c)=>`${s} ${c}px Inter, ui-sans-serif, system-ui, sans-serif`;return i.textBaseline="alphabetic",i.fillStyle=a,i.font=l(500,26),i.fillText("BLACK BAO STUDIO",n,n+20),i.textAlign="right",i.fillText(e.kind.toUpperCase(),1024-n,n+20),i.textAlign="left",i.fillStyle=r,i.font=l(700,112),i.fillText(e.name,n-6,300),i.fillStyle=a,i.font=l(500,36),i.fillText(e.platform,n,360),i.strokeStyle=a,i.lineWidth=2,i.beginPath(),i.moveTo(n,420),i.lineTo(1024-n,420),i.stroke(),i.font=l(500,32),e.features.forEach((s,c)=>{let u=486+c*62;i.fillStyle=a,i.fillText(String(c+1).padStart(2,"0"),n,u),i.fillStyle=r,i.fillText(s,n+72,u,1024-n*2-72)}),i.fillStyle=a,i.font=l(500,26),i.fillText(e.urlLabel.toUpperCase(),n,1024-n),i.textAlign="right",i.fillText("BLACKBAO.STUDIO/APPS",1024-n,1024-n),o}function Ie(e,t){e.clearRect(0,0,32,32),e.save(),e.translate(16,16),e.rotate(t);let r=e.createLinearGradient(-16,-16,16,16);r.addColorStop(0,"#000"),r.addColorStop(1,"#333");let a=(l,s)=>{e.beginPath(),e.arc(0,0,l,0,Math.PI*2),e.fillStyle=s,e.fill()};a(16,r),a(6,"#fff"),a(5,r),a(3,"#fff");let n=Math.PI/4;e.fillStyle="#ffffffaa";for(let l of[0,Math.PI])e.beginPath(),e.arc(0,0,14,l-n/2,l+n/2,!1),e.lineTo(6*Math.cos(l+n/2),6*Math.sin(l+n/2)),e.arc(0,0,6,l+n/2,l-n/2,!0),e.closePath(),e.fill();a(2,"#000"),e.restore()}var me=async(e)=>{let t=await fetch(e);if(!t.ok)throw Error(`${e}: ${t.status}`);return createImageBitmap(await t.blob(),{imageOrientation:"flipY"})};class Fe{gl;tex;app;el=null;ready=!1;want=!1;live=!1;constructor(e,t,o){this.gl=e;this.tex=t;this.app=o}create(){let e=document.createElement("video");e.muted=!0,e.loop=!0,e.playsInline=!0,e.preload="auto";for(let t of[this.app.cover.video.hevc,this.app.cover.video.av1]){let o=document.createElement("source");o.src=t,o.type="video/mp4",e.appendChild(o)}return e.addEventListener("canplay",()=>{if(this.ready=!0,this.want)e.play().catch(()=>{})}),e.load(),e}play(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(this.want=!0,this.el??=this.create(),this.ready)this.el.play().catch(()=>{})}pause(){this.want=!1,this.el?.pause()}frame(){let e=this.el;if(!e||e.paused||e.readyState<2)return;if(pe(this.gl,this.tex,e),!this.live)this.live=!0,this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR)}}async function _e(e,t){let o=e.gl,[i,r,a,n,...l]=await Promise.all([fetch("/apps/placeholder/record.glb").then((b)=>b.arrayBuffer()),fetch("/apps/placeholder/shelf.glb").then((b)=>b.arrayBuffer()),me("/apps/placeholder/roughness.webp"),me("/apps/placeholder/plastic-normal.webp"),...t.map((b)=>me(b.cover.image)),document.fonts.load("800 64px Inter").catch(()=>[])]),s=he(i),c=he(r),u=c.image?await createImageBitmap(c.image):void 0,h=(b)=>{let p=c.meshes[b];if(!p)throw Error(`shelf.glb has no mesh ${b}`);return oe(o,p)},f=()=>new Promise((b)=>setTimeout(b,0)),m=async(b)=>{let p=b();return await f(),p},y=new Map;for(let[b,p]of t.entries()){let x=await m(()=>e.texture(l[b])),w=await m(()=>e.texture(Le(p))),S=Pe(p.sticker),A=await m(()=>e.texture(S.badge)),P=await m(()=>e.texture(S.text));y.set(p.id,{cover:x,back:w,badge:A,label:P,video:new Fe(o,x,p)})}return{record:oe(o,s.meshes.Record1),wall:h("10.Records_ShelfWall"),catcher:h("ShadowCatcher.NEW"),wallTexture:await m(()=>e.texture(u,!1)),roughness:await m(()=>e.texture(a)),plastic:await m(()=>e.texture(n)),albums:y}}var q=(e,t,o=!1,i=!1)=>({image:`/apps/${e}/cover.webp`,video:{av1:`/apps/${e}/cover.av1.mp4`,hevc:`/apps/${e}/cover.hevc.mp4`},autoplay:o,plastic:i,bg:t}),X=[{id:"zooclips",name:"ZooClips",platform:"macOS 15+",kind:"Menu bar app",sticker:"macOS",tagline:"Remembers what you copy, so you can paste it again later.",runsOn:"Runs on Macs with macOS 15 or later, from the menu bar. Free on the Mac App Store.",url:"https://apps.apple.com/app/zooclips/id6809502834",urlLabel:"Mac App Store",features:["Shift-Command-V opens your clips","Text, images, PDFs, files, colours","Searchable history, 10 to 1000 items","Command-1 to 9 for recent clips","Excluded apps and content patterns","No network access at all"],cover:q("zooclips","#e6e3cc",!0,!0),shelf:"top",x:-0.66},{id:"zoostats",name:"ZooStats",platform:"macOS 14+",kind:"Menu bar app",sticker:"macOS",tagline:"CPU, GPU, memory and network in the menu bar, as a number or a running animal.",runsOn:"Runs on Macs with macOS 14 or later, from the menu bar. Free on the Mac App Store.",url:"https://apps.apple.com/app/zoostats/id6788886397",urlLabel:"Mac App Store",features:["CPU load and GPU usage","Memory pressure","Network up and down","A fox, hare, bird or piglet per stat","Idles under 1% CPU","Nothing leaves your Mac"],cover:q("zoostats","#121726"),shelf:"top",x:0.66},{id:"sweepic",name:"Sweepic",platform:"iOS 18+",kind:"iPhone and iPad",sticker:"iOS",tagline:"One photo, one decision. Swipe right to keep it, left to bin it.",runsOn:"Runs on iPhone and iPad with iOS or iPadOS 18 or later. Free on the App Store.",url:"https://apps.apple.com/app/id6808285003",urlLabel:"App Store",features:["Swipe to keep, bin or skip","Nothing deleted until you empty the bin","Browse by year or by month","Videos and Live Photos play","Four looks: Aurora, Calm, Journal, Vital","No network requests at all"],cover:q("sweepic","#b47ae6"),shelf:"bottom",x:-1.33},{id:"lazyaws",name:"lazyaws",platform:"macOS · Linux · Windows",kind:"Terminal app",sticker:"Terminal",tagline:"A keyboard-driven terminal UI for AWS, read-only unless you ask for writes.",runsOn:"Runs in the terminal on macOS and Linux through Homebrew, and on Windows from the release archives. Open source on GitHub.",url:"https://github.com/noelruault/lazyaws",urlLabel:"GitHub",features:["ECS, EC2, S3, EKS, ECR","Secrets Manager, VPC, PrivateLink","Read-only unless --allow-writes","Chat on your account's Bedrock models","Keymaps: vim, emacs, lazydocker","brew install noelruault/tap/lazyaws"],cover:q("lazyaws","#0b0d0c"),shelf:"bottom",x:0},{id:"typstmd",name:"typstmd",platform:"Browser · CLI",kind:"Web app",sticker:"Browser",tagline:"Markdown in, a typeset PDF out, compiled in your own browser tab. Nothing is uploaded.",runsOn:"Runs in any modern browser at noelruault.github.io/typstmd, with the Typst compiler as WebAssembly, and from the shell with Pandoc and Typst. Open source on GitHub.",url:"https://noelruault.github.io/typstmd/",urlLabel:"the web",features:["Typst compiler as WebAssembly, in the tab","Nothing uploaded, no account, works offline","Six built-in themes, Typst Universe starters","Drop any .typ file in as a template","Tables, footnotes, emoji, Mermaid diagrams","The same PDF from the shell with Pandoc and Typst"],cover:q("typstmd","#f4f1e8"),shelf:"bottom",x:1.33,notes:{lead:"A good-looking PDF out of Markdown usually costs one of three chores.",chores:["Upload the file to somebody's server.","Wrestle a LaTeX toolchain.","Accept whatever a generic exporter gives you."],answer:"typstmd removes all three. The Typst compiler runs as WebAssembly inside your tab, so a confidential report never leaves it, there is no account to create, and it keeps working offline after the first load. The output is real Typst, so the styling stays yours.",chapters:[{title:"Write",copy:"Paste or type Markdown, or drop a .md file on the page, and the page below re-typesets as you go. GitHub-flavoured Markdown comes through: tables, footnotes, emoji, and Mermaid diagrams drawn as native Typst rather than a flat image.",clip:{name:"write",alt:"Markdown typed into the editor while the page under it re-typesets line by line"}},{title:"Pages",copy:"Five front-matter keys mean something: title, author, date, lang and toc. The showcase report runs to eight pages from plain Markdown: a cover band, a contents page, severity pills, metadata cards, code evidence and a diagram.",clip:{name:"pages",alt:"The showcase report maximised and scrolled through its first pages"}},{title:"Themes",copy:"One picker holds six built-in themes, three Typst Universe starters and the files you bring. Switch, and the same document re-renders in the new look.",clip:{name:"themes",alt:"The same report switching between the Academic, Report and Typstmd themes"}},{title:"Your template",copy:"Drop any .typ file on the page and it becomes a template, saved in your browser and listed with the built-ins. Or click Onboard your agent: it copies a prompt that has Claude, Codex, Cursor or OpenCode write a typstmd template for the layout you describe.",clip:{name:"template",alt:"A letterhead .typ file dropped on the page, after which the document is restyled and the picker names the file"}},{title:"Download",copy:"Every document is standalone Typst: read it in the source pane, edit it, compile it anywhere. Then Download PDF, with nothing having left the tab.",clip:{name:"download",alt:"The generated Typst source shown behind the page, then the Download PDF button pressed"}}],cli:{copy:"The same conversion from the shell, for scripts and batch work: Pandoc with Lua filters, Typst as the PDF engine. Both front-ends produce the same document, checked byte for byte by the test suite.",command:"./cmd/converter.sh report.md --mermaid",output:["output/report.pdf"]},source:{url:"https://github.com/noelruault/typstmd",label:"Source on GitHub, MIT"}}}];var De={top:0.835,bottom:-0.65},Oe={top:0.125,bottom:0.1},d={albumSize:1.168,albumGeometryScale:3.5,albumDepth:0.013,activeAnimationDuration:700,hoverDropDuration:400,hoverLiftDuration:1000,introAnimationStaggerDelay:75,mobileIntroAnimationStaggerDelay:161,introWallFadeInDuration:1000,introAlbumFadeInDuration:400},Ue=(e)=>0.75-e*0.15;var re=(e)=>1-(1-e)**4,Ne=(e)=>e**4,I=(e)=>e<0.3?0.3*(e/0.3)**3:0.3+0.7*(1-(1-(e-0.3)/0.7)**3);class E{value;target;from=[];velocity;config={};elapsed=0;wait=0;done=!0;onRest;constructor(e){this.value=[...e],this.target=[...e],this.velocity=e.map(()=>0)}get idle(){return this.done}set(e){this.value=[...e],this.target=[...e],this.velocity=e.map(()=>0),this.done=!0,this.onRest=void 0}start(e,t={},o){if(this.from=[...this.value],this.target=[...e],this.config=t,this.elapsed=0,this.wait=t.delay??0,this.onRest=o,this.done=!1,t.duration!==void 0)this.velocity=e.map(()=>0)}step(e){if(this.done)return;if(this.wait>0){if(this.wait-=e,this.wait>0)return;e=-this.wait}let t=this.config,o=!0;if(t.duration!==void 0){this.elapsed+=e;let i=t.duration<=0?1:Math.min(1,this.elapsed/t.duration),r=(t.easing??((a)=>a))(i);for(let a=0;a<this.value.length;a++)this.value[a]=this.from[a]+(this.target[a]-this.from[a])*r;o=i>=1}else{let i=t.tension??170,r=t.friction??26,a=t.mass??1,n=Math.ceil(e);for(let l=0;l<this.value.length;l++){let s=this.target[l],c=t.precision??(Math.min(1,Math.abs(s-this.from[l])*0.001)||0.0001),u=c/10,h=this.value[l],f=this.velocity[l],m=!1;for(let y=0;y<n;y++){if(Math.abs(f)<=u&&Math.abs(s-h)<=c){m=!0;break}if(f+=(-i*0.000001*(h-s)-r*0.001*f)/a*1,h+=f,t.clamp&&(s-this.from[l])*(h-s)>0){h=s,f=0,m=!0;break}}if(m||Math.abs(f)<=u&&Math.abs(s-h)<=c)h=s,f=0;else o=!1;this.value[l]=h,this.velocity[l]=f}}if(o){this.value=[...this.target],this.done=!0;let i=this.onRest;this.onRest=void 0,i?.()}}}class fe{queue=[];now=0;seq=0;after(e,t){let o=++this.seq;return this.queue.push({at:this.now+e,fn:t,id:o}),o}clear(){this.queue=[]}cancel(e){if(e)this.queue=this.queue.filter((t)=>t.id!==e)}tick(e){this.now+=e;let t=this.queue.filter((o)=>o.at<=this.now).sort((o,i)=>o.at-i.at);if(!t.length)return;this.queue=this.queue.filter((o)=>o.at>this.now);for(let o of t)o.fn()}}function Be(e){let t=e,o=new Set;return{get:()=>t,set(i){let r=t;if(t={...t,...i},Object.keys(i).some((a)=>r[a]!==t[a]))for(let a of[...o])a(t,r)},subscribe(i){return o.add(i),()=>o.delete(i)}}}var j=(e)=>e==="intro"||e==="animatingForward"||e==="animatingBackward";var D=v([0,0.1,0.5]),Ge=g(D,v([0,-0.52,-1.43],[0,0,0],3.5)),at=g(Ge,v([0,-0.582,0.119])),nt=g(Ge,v([0,-0.0023,0.015])),be=[-0.26,0,0],ae=[0,0,0.01];function ge(e,t,o,i,r,a){let n=[t.max[0]-t.min[0],t.max[1]-t.min[1],t.max[2]-t.min[2]],l=[(t.max[0]+t.min[0])/2,(t.max[1]+t.min[1])/2],s=e.fov*Math.PI/180,c=2*Math.atan(Math.tan(s/2)*e.aspect),u=i*Math.max(n[1]/(2*Math.tan(s/2)),n[0]/(2*Math.tan(c/2)));if(r&&o*(n[0]/(2*u*Math.tan(c/2)))>r)u=o*n[0]/(2*r*Math.tan(c/2));let h=e.direction(),f=[l[0],l[1],0];if(e.position=[f[0]-h[0]*u,f[1]-h[1]*u,f[2]-h[2]*u],e.target=f,a){let m=Math.max(n[0],n[1]);e.near=Math.max(u-m*2,0.1),e.far=u+m*2}}class Ve{app;index;clock;group;lift;activePosition;activeRotation=new E([0,0,0]);hover=new E([...ae]);tilt=new E([...be]);wobble=new E([0,0,0]);scale=new E([0]);reflection=new E([0.45]);hoverGuard=null;up=!1;dropTimer=null;inner=v([0,0,0]);constructor(e,t,o){this.app=e;this.index=t;this.clock=o;this.group=[e.x,De[e.shelf],-1.19],this.lift=Oe[e.shelf],this.activePosition=new E([...this.group])}springs(){return[this.activePosition,this.activeRotation,this.hover,this.tilt,this.wobble,this.scale,this.reflection]}hoverIn(e=d.hoverLiftDuration){this.up=!0,this.clock.cancel(this.hoverGuard),this.clock.cancel(this.dropTimer),this.dropTimer=null;let t={duration:e,easing:re};this.hover.start([0,this.lift,ae[2]+0.06],t),this.tilt.start([0,0,0],t),this.wobble.start([0,0,0],{mass:1,tension:80,friction:6}),this.reflection.start([0],{duration:e*0.45,easing:re}),this.hoverGuard=this.clock.after(e/2,()=>this.hoverGuard=null)}hoverOut(){this.up=!1,this.clock.cancel(this.hoverGuard),this.hoverGuard=null,this.clock.cancel(this.dropTimer);let e={duration:d.hoverDropDuration,easing:Ne};this.hover.start([...ae],e),this.dropTimer=this.clock.after(d.hoverDropDuration*0.6,()=>{this.tilt.start([...be],e),this.dropTimer=null}),this.reflection.start([0.45],e),this.wobbleReset()}wobbleReset(){this.wobble.start([0,0,0],{duration:d.hoverDropDuration*2,easing:re})}matrices(){let e=this.scale.value[0],t=g(D,v(this.activePosition.value,[0,0,0],e));return t=g(t,v([0,0,0],this.wobble.value)),t=g(t,v(this.hover.value)),t=g(t,v([0,-d.albumSize*0.5,d.albumDepth+0.04],this.tilt.value)),t=g(t,v([0,d.albumSize*0.5,0],this.activeRotation.value)),this.inner=t,t}}class O{r;store;clock;assets;onCursor;albums;cover;stickerPlane;reflectionPlane;hovered=null;time=0;off=()=>{};constructor(e,t,o,i,r,a){this.r=e;this.store=t;this.clock=o;this.assets=i;this.onCursor=a;let n=e.gl;this.albums=r.map((l,s)=>new Ve(l,s,o)),this.cover=L(n,d.albumSize,d.albumSize),this.stickerPlane=L(n,0.5,0.5),this.reflectionPlane=L(n,d.albumSize,0.88),e.camera.fov=20,e.camera.zoom=1,e.camera.near=0.2,e.camera.far=100,e.camera.position=[0,0.03,12],e.camera.target=[0,0,0],e.blurSamples=24,e.setLight({position:[7.5,5,19],target:[1.48,2.18,0]}),this.wire()}frame(e){let t=2.66+d.albumSize/2,o=R(D,[-t,-1.75,-1.19]),i=R(D,[t,1.65,-0.01]);ge(this.r.camera,{min:o,max:i},e,1.25,1550,!0)}intro(){let{introAnimationStaggerDelay:e,introAlbumFadeInDuration:t,introWallFadeInDuration:o}=d;for(let i of this.albums)i.scale.set([0]),i.hoverIn(0),this.clock.after(i.index*e+t,()=>{i.scale.set([1]),this.clock.after(i.index*e,()=>i.hoverOut())});this.clock.after(o+this.albums.length*e,()=>this.store.set({phase:"inactive"}))}destroy(){this.off();for(let e of this.albums)this.assets.albums.get(e.app.id).video.pause()}wire(){let{store:e}=this;this.off=e.subscribe((t,o)=>{for(let r of this.albums){let a=r.app.id;if(t.active!==o.active){if(t.active===a)this.open(r);else if(o.active===a)this.close(r)}if(t.active===a&&o.active===a&&t.flipped!==o.flipped)r.activeRotation.start([0,t.flipped===a?Math.PI:0,0],{duration:d.activeAnimationDuration,easing:I})}if(e.get().phase!=="inactive")return;let i=e.get();for(let r of this.albums){let a=i.active===null&&i.lifted===r.app.id;if(a&&!r.up)r.hoverIn();else if(!a&&r.up)r.hoverOut()}})}open(e){this.store.set({phase:"animatingForward",lifted:null}),e.hoverIn(),e.activePosition.start([0,-(e.lift-0.01),6.6],{duration:d.activeAnimationDuration,easing:I},()=>this.store.set({phase:"active"})),e.activeRotation.start([0,0,0],{duration:d.activeAnimationDuration,easing:I})}close(e){this.store.set({phase:"animatingBackward",flipped:null}),e.hover.start([0,e.lift*0.75,ae[2]],{mass:1,tension:80,friction:14}),this.clock.after(d.activeAnimationDuration,()=>e.hoverOut()),e.activeRotation.start([0,0,0],{duration:d.activeAnimationDuration,easing:I}),e.activePosition.start([...e.group],{duration:d.activeAnimationDuration,easing:I},()=>{if(this.store.get().lifted===e.app.id)this.store.set({lifted:null});this.store.set({phase:"inactive"})})}step(e){this.time+=e/1000;for(let o of this.albums)for(let i of o.springs())i.step(e);let t=this.store.get();for(let o of this.albums){let i=this.assets.albums.get(o.app.id);if(o.app.cover.autoplay||t.active===o.app.id||t.phase==="inactive"&&t.lifted===o.app.id)i.video.play();else i.video.pause();i.video.frame()}}items(){let e=this.store.get(),t=[{geo:this.assets.wall,kind:"basic",model:at,layer:0,uniforms:{uMap:this.assets.wallTexture,uUseMap:!0,uOpacity:1}},{geo:this.assets.catcher,kind:"shadow",model:nt,layer:0,transparent:!0,uniforms:{uOpacity:0.5}}];for(let o of this.albums){let i=this.assets.albums.get(o.app.id),r=o.matrices(),a=e.active===o.app.id&&e.phase!=="inactive"?1:0,n={uRoughnessMap:this.assets.roughness,uFresnelPower:0.775,uHighlightIntensity:3.8},l=o.app.cover.plastic;if(o.scale.value[0]>0){t.push({geo:this.assets.record,kind:"basic",model:g(r,v([0,0,0],[0,0,0],d.albumGeometryScale)),layer:a,uniforms:{uColor:Y(o.app.cover.bg),uUseMap:!1,uOpacity:1}},{geo:this.assets.record,kind:"basic",model:g(r,v([0,0,0],[0,0,0],d.albumGeometryScale)),layer:a,hidden:!0,castShadow:!0,uniforms:{}},{geo:this.cover,kind:l?"plastic":"cover",model:g(r,v([0,0,d.albumDepth*0.51])),layer:a,uniforms:{uTexture:i.cover,...n,uPlasticNormalMap:this.assets.plastic,uRotationSensitivity:0.4,uPlasticWrapIntensity:0.3,uPreventYRotation:!l}},{geo:this.cover,kind:l?"plastic":"back",model:g(r,v([0,0,d.albumDepth*-0.5],[0,Math.PI,0])),layer:a,uniforms:{uTexture:i.back,...n,uPlasticNormalMap:this.assets.plastic,uRotationSensitivity:0.4,uPlasticWrapIntensity:0.3,uPreventYRotation:!1}});let s=g(r,v(ve.position,[0,0,ve.rotationZ],ve.scale));t.push({geo:this.stickerPlane,kind:"basic",model:s,layer:a,transparent:!0,uniforms:{uMap:i.badge,uUseMap:!0,uOpacity:1}},{geo:this.stickerPlane,kind:"sticker",model:g(s,v([0,0,0.01])),layer:a,transparent:!0,uniforms:{stickerMask:i.badge,stickerText:i.label,backgroundTexture:i.badge,baseOpacity:0.6,time:this.time,parentRotation:o.activeRotation.value}})}if(o.app.shelf==="bottom"){let s=g(D,v([o.group[0],-d.albumSize-0.0404,o.hover.value[1]*2]));s=g(s,v([0,0,0],[0,o.wobble.value[1],0])),s=g(s,v([0,-0.01,o.group[2]+0.61],[-Math.PI/2,0,0])),t.push({geo:this.reflectionPlane,kind:"reflection",model:s,layer:0,transparent:!0,uniforms:{uTexture:i.cover,uOpacity:o.reflection.value[0],uRoughness:0.2}})}}return t}hit(e){let t=this.r.camera.ray(e[0],e[1]),o=null;for(let i of this.albums){if(i.scale.value[0]===0)continue;let r=z(i.inner,d.albumSize,d.albumSize,t);if(r&&(!o||r.t<o.t))o={album:i,t:r.t,uv:r.uv,record:!0};let a=g(D,v([i.group[0],i.group[1],i.group[2]-0.1],[be[0]*2,0,0])),n=z(a,1.15,1.15,t);if(n&&(!o||n.t<o.t))o={album:i,t:n.t,uv:n.uv,record:!1}}return o}pointerMove(e){if(this.store.get().phase==="intro")return;let o=this.hit(e),i=o?.album??null;if(i!==this.hovered){if(this.hovered)this.pointerOut(this.hovered);if(this.hovered=i,i)this.pointerOver(i)}if(o)this.wobbleTo(o)}pointerLeave(){if(this.hovered)this.pointerOut(this.hovered);this.hovered=null}pointerOver(e){if(this.store.get().active!==null)return;this.onCursor(!0),this.store.set({lifted:e.app.id})}pointerOut(e){let t=this.store.get();if(t.active===e.app.id&&t.phase==="active"){this.onCursor(!1),e.wobbleReset();return}if(t.phase==="inactive"){if(this.onCursor(!1),t.lifted===e.app.id)this.store.set({lifted:null})}}wobbleTo(e){let t=this.store.get(),o=e.album,i=t.flipped===o.app.id,r=i?1-e.uv[0]:e.uv[0],a=e.uv[1];if(t.active===o.app.id&&t.phase==="active"){this.onCursor(!0),o.wobble.start([Math.PI/27*(a-0.5)*2*(i?-1:1),Math.PI/21*(r-0.5)*2,0],{mass:0.2,tension:80,friction:6});return}if(t.phase!=="inactive"||o.hoverGuard)return;if(t.active!==null)return;if(t.lifted!==o.app.id)this.store.set({lifted:o.app.id});o.wobble.start([Math.PI/45*(a-0.5)*2*(i?-1:1),Math.PI/35*(r-0.5)*2,0],{mass:1,tension:80,friction:6})}pointerDown(e){let t=this.store.get();if(j(t.phase))return;let o=this.hit(e);if(!o){this.onCursor(!1),this.store.set({active:null});return}let i=o.album.app.id;if(t.active===null)this.store.set({lifted:i,active:i});else if(t.active===i&&o.record)this.store.set({flipped:t.flipped===i?null:i});else this.store.set({active:null})}anchor(e,t,o){let i=R(this.r.camera.viewProjection(),R(e.inner,t));return[(i[0]+1)/2*o.width,(1-i[1])/2*o.height]}bottomOf(e,t){return this.anchor(e,[0,-d.albumSize/2,0],t)[1]}}var ve={position:[-0.38,0.38,0.01],scale:[0.58,0.58,0.58],rotationZ:0.2};var K=-Math.PI/6,ye=-0.1,xe=0.585,we=v([0,-0.01,0.2]),st=v([0,-0.001,0],[-Math.PI/2,0,0]),lt=v([0,0,0],[-Math.PI/2,0,0]),ct=9;function ut(e,t){let o=[e[0]*0.5,e[1]+2.5,e[2]-0.8],i=[0,e[1]+3,-0.3],r=[0,3.1,0],a=1-t,n=(s)=>e[s]*a*a*a+3*o[s]*a*a*t+3*i[s]*a*t*t+r[s]*t*t*t,l=t<0.5?2*t*t:-1+(4-2*t)*t;return{position:[n(0),n(1),n(2)],pitch:-0.855*l}}function pt(e,t){let o=Math.abs(e.velocity),i=Math.sign(e.velocity),r=e.scrolled<e.per*1.5&&i>0?Math.min(1,o*4):Math.min(0.7,(o*3)**1.1);return Math.max(0,Math.min(t-1,Math.round((e.scrolled-i*r*e.per)/e.per)))*e.per}class He{app;index;slot;position;pitch=0;scale=new E([0]);lean=new E([K]);turn=new E([0]);fly=new E([0]);flipped=!1;inner=v([0,0,0]);layer=0;constructor(e,t){this.app=e;this.index=t;this.slot=[0,xe,Ue(t)],this.position=[...this.slot]}springs(){return[this.scale,this.lean,this.turn,this.fly]}matrix(){let e=g(we,v(this.position,[this.pitch,0,0],this.scale.value[0]));return e=g(e,v([0,-xe,0],[this.lean.value[0],0,0])),e=g(e,v([0,xe,0],[0,this.turn.value[0],0])),this.inner=e,e}}class ne{r;store;clock;assets;apps;records;crate={scrolled:0,per:1,max:1,index:0,target:null,touching:!1,velocity:0};front;clicked=null;seekFast=!1;settleTimer=null;wheelTimer=null;lastY=0;down=null;cover;stickerPlane;floor;time=0;offs=[];rows=new Map([...document.querySelectorAll("[data-mobile-row]")].map((e)=>[e.dataset.mobileRow,e]));progress=document.querySelector("[data-progress]");thumb=document.querySelector("[data-progress-thumb]");title=document.querySelector("[data-title]");list=document.querySelector("[data-list]");constructor(e,t,o,i,r){this.r=e;this.store=t;this.clock=o;this.assets=i;this.apps=r;let a=e.gl;this.records=r.map((l,s)=>new He(l,s)),this.front=r[0].id,this.cover=L(a,d.albumSize,d.albumSize),this.stickerPlane=L(a,0.5,0.5),this.floor=L(a,16,8);let n=e.camera;n.fov=25,n.zoom=1.3,n.near=0.2,n.far=100,n.position=[0,9,1.5],n.target=[0,0,0],e.setLight({position:[2,2.3,-0.6],target:[-3.2,-2.5,1.1]}),this.wire()}destroy(){for(let e of this.offs)e();for(let e of this.rows.values())e.classList.add("hidden")}frame(e){let t=R(we,[-0.575,0.65,1.4000000000000001]),o=R(we,[0.575,0.65,2.8]),i=this.r.camera.aspect>1?1:0;ge(this.r.camera,{min:[t[0],t[1]-i,t[2]],max:[o[0],o[1]+i,o[2]]},0,2,null,!1);let r=Math.floor(innerHeight/ct);this.crate.per=r,this.crate.max=r*this.apps.length}intro(){let e=this.records.length;for(let t of this.records)t.scale.set([0]),this.clock.after((e-1-t.index)*d.mobileIntroAnimationStaggerDelay,()=>{t.lean.set([ye]),t.scale.set([1]),this.clock.after(10,()=>t.lean.start([K],{tension:190,friction:16,mass:1}))});this.clock.after(d.introWallFadeInDuration+e*d.introAnimationStaggerDelay,()=>this.store.set({phase:"inactive"})),this.syncRows()}on(e,t,o,i){e.addEventListener(t,o,i),this.offs.push(()=>e.removeEventListener(t,o,i))}wire(){let{store:e}=this;this.offs.push(e.subscribe((t,o)=>{if(o.phase==="intro"&&t.phase!=="intro")this.title.style.opacity="1",this.list.style.opacity="1",this.list.style.visibility="visible",this.progress.style.opacity="1",this.progress.style.visibility="visible";if(t.active!==o.active){let i=t.active!==null;for(let r of[this.title,this.progress])r.style.opacity=i?"0":"1",r.style.visibility=i?"hidden":"visible",r.style.transitionDelay=i?"0s":"0.5s";if(t.active)this.flyUp(this.byId(t.active));if(o.active)this.flyDown(this.byId(o.active));this.syncRows()}})),this.on(window,"touchstart",(t)=>this.touchStart(t),{passive:!1}),this.on(window,"touchmove",(t)=>this.touchMove(t),{passive:!1}),this.on(window,"touchend",()=>this.touchEnd()),this.on(window,"wheel",(t)=>this.wheel(t));for(let[t,o]of this.rows){let i=o.querySelector("[data-mobile-details]"),r=o.querySelector("[data-mobile-back]"),a=()=>e.get().phase!=="intro"&&e.get().active!==t&&this.click(t),n=()=>e.get().phase!=="intro"&&e.get().active===t&&this.click(null);i.addEventListener("click",a),r.addEventListener("click",n),this.offs.push(()=>i.removeEventListener("click",a),()=>r.removeEventListener("click",n))}}byId(e){return this.records.find((t)=>t.app.id===e)}get scrollable(){return this.clicked===null&&this.store.get().phase!=="intro"}setScrolled(e){let t=this.crate;t.scrolled=Math.max(0,Math.min(t.max,e));let o=t.scrolled<t.per*0.15?0:Math.floor(t.scrolled/t.per);if(o>=0&&o<this.records.length)this.setFront(o);this.onScroll()}setFront(e){let t=this.records[e].app.id;if(this.crate.index=e,t!==this.front)this.front=t,this.syncRows();this.syncProgress()}onScroll(){let e=this.crate,t=this.byId(this.front),o=t.index,i=Math.max(0,Math.min(1,(e.scrolled-e.per*o)/e.per));if(t.lean.start([K+(ye-K)*i],{tension:200,friction:24,mass:1,precision:0.001,clamp:!0}),this.clock.cancel(this.settleTimer),e.touching)return;this.settleTimer=this.clock.after(150,()=>{if(this.front!==t.app.id)return;let r=o===this.records.length-1,a=t.lean.value[0]>-0.31&&!r,n=(a?e.per:0)+e.per*o;if(o===1&&!a&&e.scrolled<e.per*0.8){e.scrolled=0,this.setFront(0);return}if(e.scrolled===n&&!a)return;if(t.lean.start([a?ye:K],{tension:170,friction:40,clamp:!0}),e.scrolled=n,a&&o+1<this.records.length)this.setFront(o+1);else this.syncProgress()})}touchStart(e){if(!this.scrollable)return;let t=this.crate;t.target=null,this.lastY=e.touches[0].clientY,t.touching=!0,t.velocity=0}touchMove(e){if(!this.scrollable||!this.crate.touching)return;let t=this.crate,o=e.touches[0].clientY,i=o-this.lastY;this.lastY=o;let r=i*0.08,a=Math.abs(r)>Math.abs(t.velocity)?0.6:0.4;t.velocity=t.velocity*(1-a)+r*a,this.setScrolled(t.scrolled+i*(1/(1+Math.abs(t.velocity)**1.2*0.05)))}touchEnd(){let e=this.crate;if(!e.touching)return;if(e.touching=!1,e.scrolled<e.per*0.15){e.target=null,this.setScrolled(0);return}e.target=pt(e,this.records.length),this.seekFast=!1}wheel(e){if(!this.scrollable)return;let t=this.crate;t.target=null;let o=Math.sign(e.deltaY)*Math.min(Math.abs(e.deltaY),20)*0.75;this.setScrolled(t.scrolled-o),this.clock.cancel(this.wheelTimer),this.wheelTimer=this.clock.after(150,()=>{let i=t.scrolled<t.per*1.2&&o<0?0:Math.round(t.scrolled/t.per);t.target=Math.max(0,Math.min(this.records.length-1,i))*t.per,this.seekFast=!1})}seek(){let e=this.crate;if(e.target===null||e.touching)return;let t=e.target-e.scrolled;if(Math.abs(t)<0.5){let a=e.target;e.target=null,this.setScrolled(a);return}let o=Math.abs(t),i=this.seekFast?o>50?0.45:o>10?0.35:0.5:o>50?0.25:o>10?0.18:0.3,r=this.seekFast?30:5;this.setScrolled(e.scrolled+Math.sign(t)*Math.min(Math.abs(t*i),r))}click(e){let t=this.clicked;if(this.clicked=e,e){this.byId(e).layer=1,this.clock.after(150,()=>this.store.set({phase:"animatingForward"})),this.store.set({active:e});return}if(!t)return;let o=this.byId(t),i=500,r=()=>this.store.set({active:null,phase:"animatingBackward"});if(o.flipped)i+=150,this.flip(o),this.clock.after(150,r);else r();this.clock.after(i,()=>o.layer=0)}flip(e){e.flipped=!e.flipped,e.turn.start([e.flipped?Math.PI:0],{duration:700,easing:I})}flyUp(e){e.fly.start([1],{duration:900,easing:I},()=>this.store.set({phase:"active"})),this.clock.after(d.activeAnimationDuration,()=>this.store.get().active===e.app.id&&this.assets.albums.get(e.app.id).video.play())}flyDown(e){this.assets.albums.get(e.app.id).video.pause(),e.fly.start([0],{duration:900,easing:I},()=>this.store.set({phase:"inactive"}))}pointerDown(e,t){this.down={x:t.clientX,y:t.clientY,at:performance.now()}}pointerUp(e,t){let o=this.down;if(this.down=null,!o||this.store.get().phase==="intro")return;if(Math.hypot(t.clientX-o.x,t.clientY-o.y)>10||performance.now()-o.at>300)return;let i=this.store.get(),r=this.hit(e);if(i.active!==null){if(r&&r.app.id===i.active)this.flip(r);else if(i.phase==="active")this.click(null);return}if(!r)return;if(r.index!==this.crate.index){this.crate.target=r.index*this.crate.per,this.seekFast=!0;return}this.click(r.app.id)}hit(e){let t=this.r.camera.ray(e[0],e[1]),o=null;for(let i of this.records){let r=z(i.inner,d.albumSize,d.albumSize,t);if(r&&(!o||r.t<o.t))o={rec:i,t:r.t}}return o?.rec??null}syncRows(){let e=this.store.get();for(let[t,o]of this.rows){let i=t===this.front||t===e.active;o.classList.toggle("hidden",!i),o.classList.toggle("flex",i);let r=e.active===t,a=o.querySelector("[data-mobile-caption]"),n=o.querySelector("[data-mobile-back]"),l=o.querySelector("[data-mobile-details]"),s=o.querySelector("[data-mobile-notes]");a.style.opacity=r?"0":"1",a.style.visibility=r?"hidden":"visible",a.style.transitionDelay=r?"0s":"0.5s";let c=[[n,r],[l,!r]];if(s)c.push([s,r]);for(let[u,h]of c)u.classList.toggle("opacity-0",!h),u.classList.toggle("invisible",!h),u.style.transitionDelay=h?"0.5s":"0s"}}syncProgress(){let e=this.crate,t=this.records.length,o=this.progress.clientHeight-this.thumb.clientHeight,i=(t-1)/t*e.max,r=e.index===t-1?1:i>0?Math.min(1,e.scrolled/i):0;this.thumb.style.transform=`translateY(${-r*o}px)`,this.progress.setAttribute("aria-valuenow",String(e.index))}step(e){this.time+=e/1000,this.seek();for(let t of this.records){for(let i of t.springs())i.step(e);let o=ut(t.slot,t.fly.value[0]);t.position=o.position,t.pitch=o.pitch,this.assets.albums.get(t.app.id).video.frame()}}items(){let e=[{geo:this.floor,kind:"basic",model:st,layer:0,uniforms:{uColor:Y("#CBCBCB"),uUseMap:!1,uOpacity:1}},{geo:this.floor,kind:"shadow",model:lt,layer:0,transparent:!0,uniforms:{uOpacity:0.12}}];for(let t of this.records){if(t.scale.value[0]===0)continue;let o=this.assets.albums.get(t.app.id),i=t.matrix(),r=t.layer,a=t.app.cover.plastic,n={uRoughnessMap:this.assets.roughness,uFresnelPower:0.775,uHighlightIntensity:3.8,uPlasticNormalMap:this.assets.plastic,uPlasticWrapIntensity:0.3},l=g(i,v([0,0,0],[0,0,0],d.albumGeometryScale));e.push({geo:this.assets.record,kind:"basic",model:l,layer:r,castShadow:!0,uniforms:{uColor:Y(t.app.cover.bg),uUseMap:!1,uOpacity:1}},{geo:this.cover,kind:a?"plastic":"cover",model:g(i,v([0,0,0.0065])),layer:r,uniforms:{uTexture:o.cover,...n,uRotationSensitivity:0.2,uPreventYRotation:!0}},{geo:this.cover,kind:a?"plastic":"back",model:g(i,v([0,0,-0.0065],[0,Math.PI,0])),layer:r,uniforms:{uTexture:o.back,...n,uRotationSensitivity:0.4,uPreventYRotation:!1}});let s=g(i,v([-0.38,0.38,0.01],[0,0,0.2],0.58));e.push({geo:this.stickerPlane,kind:"basic",model:s,layer:r,transparent:!0,uniforms:{uMap:o.badge,uUseMap:!0,uOpacity:1}},{geo:this.stickerPlane,kind:"sticker",model:g(s,v([0,0,0.01])),layer:r,transparent:!0,uniforms:{stickerMask:o.badge,stickerText:o.label,backgroundTexture:o.badge,baseOpacity:0.8,time:this.time,parentRotation:[t.pitch+t.lean.value[0],t.turn.value[0],0]}})}return e}}class Te{sheets=new Map([...document.querySelectorAll("[data-notes-sheet]")].map((e)=>[e.dataset.notesSheet,e]));open=null;opener=null;observer=null;constructor(e){for(let t of document.querySelectorAll("[data-notes]"))t.addEventListener("click",()=>this.show(t.dataset.notes,t));for(let[,t]of this.sheets)t.querySelector("[data-notes-close]").addEventListener("click",()=>this.hide());window.addEventListener("keydown",(t)=>{if(t.key!=="Escape"||this.open===null)return;t.stopPropagation(),this.hide()},{capture:!0}),e.subscribe((t)=>t.active!==this.open&&this.open!==null&&this.hide())}show(e,t){let o=this.sheets.get(e);if(!o||this.open===e)return;if(this.open)this.hide();this.open=e,this.opener=t,o.inert=!1,o.dataset.open="",this.clips(o),o.querySelector("[data-notes-close]").focus({preventScroll:!0})}hide(){let e=this.open?this.sheets.get(this.open):null;if(this.open=null,!e)return;delete e.dataset.open,e.inert=!0,this.observer?.disconnect(),this.observer=null;for(let t of e.querySelectorAll("video"))t.pause();this.opener?.focus({preventScroll:!0})}clips(e){let t=matchMedia("(prefers-reduced-motion: reduce)").matches;for(let o of e.querySelectorAll("[data-clip]:empty")){let i=o.dataset.clip,r=o.dataset.clipAlt??"";if(t){let n=document.createElement("img");Object.assign(n,{src:`${i}.webp`,alt:r,width:860,height:1280,loading:"lazy",decoding:"async",className:"block size-full"}),o.appendChild(n);continue}let a=document.createElement("video");Object.assign(a,{muted:!0,loop:!0,playsInline:!0,preload:"none",poster:`${i}.webp`,width:860,height:1280,className:"block size-full"}),a.setAttribute("aria-label",r);for(let n of["hevc","av1"]){let l=document.createElement("source");l.src=`${i}.${n}.mp4`,l.type="video/mp4",a.appendChild(l)}o.appendChild(a)}if(t)return;this.observer?.disconnect(),this.observer=new IntersectionObserver((o)=>{for(let i of o){let r=i.target;if(i.isIntersecting)r.play().catch(()=>{});else r.pause()}},{root:e.querySelector("[data-notes-scroll]"),threshold:0.4});for(let o of e.querySelectorAll("video"))this.observer.observe(o)}}var Z=(e)=>`
#define varying out
#define attribute in
in vec3 position;
in vec3 normal;
in vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
`+e,F=(e)=>`
#define varying in
#define texture2D texture
#define gl_FragColor fragColor
out vec4 fragColor;
vec4 linearToOutputTexel(vec4 value) {
  return vec4(mix(pow(value.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), value.rgb * 12.92, vec3(lessThanEqual(value.rgb, vec3(0.0031308)))), value.a);
}
`+e.replace("#include <colorspace_fragment>","gl_FragColor = linearToOutputTexel(gl_FragColor);"),se=Z(`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}`),ze=F(`
uniform sampler2D uTexture;
uniform sampler2D uRoughnessMap;
uniform float uFresnelPower;
uniform float uHighlightIntensity;
uniform float uRotationSensitivity;
uniform bool uPreventYRotation;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  vec4 roughness = texture2D(uRoughnessMap, vUv);
  float enhancedRoughness = clamp(pow(roughness.r, 0.5) * 2.0, 0.0, 1.0);
  vec3 viewDir = normalize(vViewPosition);
  float normalClampX = clamp(vNormal.x * uRotationSensitivity, -0.08, 1.0);
  float normalClampY = uPreventYRotation ? 0.0 : vNormal.y * 0.15;
  vec3 flattenedNormal = normalize(vec3(normalClampX, normalClampY, 1.0));
  float viewAngle = dot(viewDir, flattenedNormal);
  float fresnel = pow(1.0 - abs(viewAngle), uFresnelPower);
  float highlightFactor = min(max(fresnel, fresnel * 0.3), 0.05);
  vec3 highlightColor = vec3(1.0) * uHighlightIntensity;
  vec3 finalColor = mix(textureColor.rgb, mix(textureColor.rgb, highlightColor, highlightFactor), enhancedRoughness);
  float brightness = max(max(finalColor.r, finalColor.g), finalColor.b);
  if (brightness > 1.0) finalColor = finalColor / brightness;
  finalColor = pow(finalColor, vec3(2.2));
  gl_FragColor = vec4(finalColor, textureColor.a);
  #include <colorspace_fragment>
}`),We=F(`
uniform sampler2D uTexture;
uniform sampler2D uRoughnessMap;
uniform sampler2D uPlasticNormalMap;
uniform float uFresnelPower;
uniform float uHighlightIntensity;
uniform float uRotationSensitivity;
uniform float uPlasticWrapIntensity;
uniform bool uPreventYRotation;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  float edgeBuffer = 0.0001;
  vec2 adjustedUv = clamp(vUv, vec2(edgeBuffer), vec2(1.0 - edgeBuffer));
  vec4 textureColor = texture2D(uTexture, adjustedUv);
  vec3 normalFromMap = texture2D(uPlasticNormalMap, adjustedUv).rgb * 2.0 - 1.0;
  normalFromMap = normalize(vec3(normalFromMap.xy * uPlasticWrapIntensity, normalFromMap.z));
  float enhancedRoughness = clamp(mix(texture2D(uRoughnessMap, adjustedUv).r, 0.5, 0.7), 0.0, 1.0);
  vec3 viewDir = normalize(vViewPosition);
  float normalClampX = clamp(vNormal.x * uRotationSensitivity, -0.08, 1.0);
  float normalClampY = uPreventYRotation ? 0.0 : vNormal.y * 0.15;
  vec3 perturbedNormal = normalize(vec3(normalClampX + normalFromMap.x, normalClampY + normalFromMap.y, 1.0));
  float viewAngle = dot(viewDir, perturbedNormal);
  float fresnel = pow(1.0 - abs(viewAngle), uFresnelPower);
  float distortedFresnel = fresnel * (1.0 + normalFromMap.x * normalFromMap.y * 0.2);
  float highlightFactor = min(max(distortedFresnel, distortedFresnel * 0.3), 0.05 + uPlasticWrapIntensity * 0.03);
  float specular = pow(max(0.0, 1.0 - abs(viewAngle)), 24.0) * 0.2 * uPlasticWrapIntensity;
  vec3 highlightColor = vec3(1.0) * uHighlightIntensity;
  vec2 refractionOffset = normalFromMap.xy * uPlasticWrapIntensity * 0.01;
  float edgeDistance = clamp(min(min(adjustedUv.x, 1.0 - adjustedUv.x), min(adjustedUv.y, 1.0 - adjustedUv.y)) / edgeBuffer, 0.0, 1.0);
  refractionOffset *= edgeDistance;
  vec4 refractedColor = texture2D(uTexture, adjustedUv + refractionOffset);
  vec3 distortedBaseColor = mix(textureColor.rgb, refractedColor.rgb, uPlasticWrapIntensity * 0.1);
  vec3 finalColor = mix(distortedBaseColor, mix(distortedBaseColor, highlightColor, highlightFactor), enhancedRoughness) + specular;
  float brightness = max(max(finalColor.r, finalColor.g), finalColor.b);
  if (brightness > 1.0) finalColor = finalColor / brightness;
  finalColor = pow(finalColor, vec3(2.2));
  gl_FragColor = vec4(finalColor, textureColor.a);
  #include <colorspace_fragment>
}`),Ye=F(`
uniform sampler2D uTexture;
uniform sampler2D uRoughnessMap;
uniform float uFresnelPower;
uniform float uHighlightIntensity;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  float enhancedRoughness = clamp(pow(texture2D(uRoughnessMap, vUv).r, 0.5) * 2.0, 0.0, 1.0);
  vec3 viewDir = normalize(vViewPosition);
  float normalClampX = clamp(vNormal.x, -0.08, 0.15);
  vec3 backNormal = normalize(vec3(-normalClampX, vNormal.y * 0.15, -1.0));
  float fresnel = pow(1.0 - abs(dot(viewDir, backNormal)), uFresnelPower);
  float highlightFactor = max(fresnel * 0.7, fresnel * 0.2);
  vec3 highlightColor = vec3(1.0) * uHighlightIntensity;
  vec3 finalColor = mix(textureColor.rgb, mix(textureColor.rgb, highlightColor, highlightFactor), enhancedRoughness);
  finalColor = pow(finalColor, vec3(2.2));
  gl_FragColor = vec4(finalColor, textureColor.a);
  #include <colorspace_fragment>
}`),Ee=Z(`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`),$e=F(`
uniform sampler2D uMap;
uniform bool uUseMap;
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec4 c = uUseMap ? texture2D(uMap, vUv) : vec4(uColor, 1.0);
  gl_FragColor = vec4(c.rgb, c.a * uOpacity);
}`),qe=F(`
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uRoughness;
varying vec2 vUv;
float random(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main() {
  float mappedY = mix(0.0, 0.3, 1.0 - vUv.y);
  float edgeWidth = 0.07;
  float edgeFalloff = min(
    min(smoothstep(0.0, edgeWidth, vUv.y), smoothstep(0.0, edgeWidth * 1.5, 1.0 - vUv.y)),
    min(smoothstep(0.0, edgeWidth, vUv.x), smoothstep(0.0, edgeWidth, 1.0 - vUv.x))
  );
  float blurAmount = 0.005 + 0.02 * (1.0 - edgeFalloff);
  vec4 texColor = (
    texture2D(uTexture, vec2(vUv.x + blurAmount, mappedY)) +
    texture2D(uTexture, vec2(vUv.x - blurAmount, mappedY)) +
    texture2D(uTexture, vec2(vUv.x, mappedY + blurAmount * 0.5)) +
    texture2D(uTexture, vec2(vUv.x, mappedY - blurAmount * 0.5))
  ) * 0.25;
  float fadeGradient = vUv.y * vUv.y * 1.8;
  float speckle = random(vUv * 200.0);
  float speckleIntensity = uRoughness * (0.2 + vUv.y * 0.8);
  gl_FragColor = vec4(texColor.rgb, uOpacity * fadeGradient * (1.0 - speckle * speckleIntensity) * edgeFalloff);
}`),Xe=Z(`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vViewPosition = cameraPosition - worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`),je=F(`
uniform vec3 parentRotation;
uniform sampler2D stickerMask;
uniform sampler2D stickerText;
uniform sampler2D backgroundTexture;
uniform float baseOpacity;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
const float TILT_SENSITIVITY = 15.0;
const float COLOR_FREQUENCY = 1.0;
const float ROTATION_SENSITIVITY = 30.0;
const float NOISE_SCALE = 8.0;
const float NOISE_INTENSITY = 4.0;
const float PATTERN_ROTATION_SPEED = 3.0;
const float REFRACTION_STRENGTH = 1.8;
const float FRESNEL_POWER = 1.2;
const float HIGHLIGHT_INTENSITY = 1.8;
const float ANIMATION_SPEED = 1.2;
const float COLOR_SHIFT_INTENSITY = 0.3;
const float FRESNEL_PULSE_INTENSITY = 0.4;
const float PATTERN_MOVE_INTENSITY = 1.2;
const vec3 COLOR_1 = vec3(0.0, 0.5, 1.0);
const vec3 COLOR_2 = vec3(1.0, 0.3, 0.0);
const vec3 COLOR_3 = vec3(1.0, 0.0, 0.7);
const vec3 COLOR_4 = vec3(0.5, 0.0, 1.0);
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453123;
  float b = sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453123;
  float c = sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453123;
  float d = sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453123;
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(fract(a), fract(b), f.x), mix(fract(c), fract(d), f.x), f.y);
}
vec3 holoColor(float t) {
  t = fract(t * COLOR_FREQUENCY);
  if (t < 0.25) return mix(COLOR_1, COLOR_2, smoothstep(0.0, 0.25, t));
  if (t < 0.5) return mix(COLOR_2, COLOR_3, smoothstep(0.25, 0.5, t));
  if (t < 0.75) return mix(COLOR_3, COLOR_4, smoothstep(0.5, 0.75, t));
  return mix(COLOR_4, COLOR_1, smoothstep(0.75, 1.0, t));
}
void main() {
  vec3 viewDir = normalize(vViewPosition);
  float viewAngle = dot(viewDir, vNormal);
  float baseAngle = acos(viewAngle) * TILT_SENSITIVITY;
  vec2 st = vUv * NOISE_SCALE;
  vec2 animatedSt = st + vec2(sin(time * ANIMATION_SPEED), cos(time * ANIMATION_SPEED * 0.7)) * PATTERN_MOVE_INTENSITY;
  float noisePattern = noise(animatedSt) * NOISE_INTENSITY;
  float waveEffect = sin(vUv.x * 10.0 + time * ANIMATION_SPEED) * sin(vUv.y * 10.0 + time * ANIMATION_SPEED * 0.7) * 0.1;
  vec2 rotUV = vUv - 0.5;
  float rotationAngle = length(parentRotation.xy) * ROTATION_SENSITIVITY;
  float timeOffset = sin(time * ANIMATION_SPEED) * 4.0;
  float rotationPattern = sin(atan(rotUV.y, rotUV.x) * PATTERN_ROTATION_SPEED + rotationAngle + timeOffset) * 0.5 + 0.5;
  float finalAngle = baseAngle + noisePattern * 0.3 + rotationPattern * 0.8 + waveEffect;
  vec3 baseColor = holoColor(finalAngle + time * COLOR_SHIFT_INTENSITY);
  vec3 pulseColor = vec3(sin(time * ANIMATION_SPEED) * 0.5 + 0.5, sin(time * ANIMATION_SPEED + 2.0) * 0.5 + 0.5, sin(time * ANIMATION_SPEED + 4.0) * 0.5 + 0.5);
  baseColor = mix(baseColor, pulseColor, 0.2);
  float refraction = noise(animatedSt * 2.0 + vec2(sin(time), cos(time)) * 0.5) * REFRACTION_STRENGTH;
  baseColor *= (1.0 + refraction);
  float fresnelPulse = 1.0 + sin(time * ANIMATION_SPEED * 2.0) * FRESNEL_PULSE_INTENSITY;
  float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), FRESNEL_POWER * fresnelPulse);
  float sweepHighlight = pow(sin(vUv.x * 3.14 + time * ANIMATION_SPEED) * 0.5 + 0.5, 8.0);
  fresnel = mix(fresnel, 1.0, sweepHighlight * 0.7);
  vec3 finalColor = mix(baseColor, baseColor * HIGHLIGHT_INTENSITY, fresnel);
  finalColor += pow(noise(vUv * 20.0 + time * 5.0), 3.0) * 0.5;
  vec4 maskColor = texture2D(stickerMask, vUv);
  float holoOpacity = mix(0.7, 1.0, fresnel) * maskColor.a - baseOpacity;
  vec4 bgColor = texture2D(backgroundTexture, vUv);
  vec4 stickerTextColor = texture2D(stickerText, vUv);
  vec3 compositeColor = mix(bgColor.rgb, finalColor, holoOpacity);
  compositeColor = mix(compositeColor, stickerTextColor.rgb, stickerTextColor.a);
  gl_FragColor = vec4(compositeColor, max(bgColor.a, stickerTextColor.a));
  #include <colorspace_fragment>
}`),Ke=Z(`
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`),Ze=F("void main() { gl_FragColor = vec4(1.0); }"),Qe=Z(`
uniform mat4 shadowMatrix;
varying vec4 vShadowCoord;
void main() {
  vShadowCoord = shadowMatrix * modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`),Je=(e=6,t=0.25,o=11)=>F(`
uniform sampler2D shadowMap;
uniform float uOpacity;
varying vec4 vShadowCoord;
#define PI2 6.283185307179586
#define PENUMBRA_FILTER_SIZE float(${o})
vec3 randRGB(vec2 uv) {
  return vec3(
    fract(sin(dot(uv, vec2(12.75613, 38.12123))) * 13234.76575),
    fract(sin(dot(uv, vec2(19.45531, 58.46547))) * 43678.23431),
    fract(sin(dot(uv, vec2(23.67817, 78.23121))) * 93567.23423)
  );
}
vec3 lowPassRandRGB(vec2 uv) {
  vec3 result = vec3(0);
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) result += randRGB(uv + vec2(float(x), float(y)));
  return result * 0.111111111;
}
vec3 highPassRandRGB(vec2 uv) { return randRGB(uv) - lowPassRandRGB(uv) + 0.5; }
vec2 vogelDiskSample(int sampleIndex, int sampleCount, float angle) {
  const float goldenAngle = 2.399963;
  float r = sqrt(float(sampleIndex) + 0.5) / sqrt(float(sampleCount));
  float theta = float(sampleIndex) * goldenAngle + angle;
  return vec2(cos(theta), sin(theta)) * r;
}
float findBlocker(vec2 uv, float compare, float angle) {
  float texelSize = 1.0 / float(textureSize(shadowMap, 0).x);
  float blockerDepthSum = float(${t});
  float blockers = 0.0;
  for (int i = 0; i < ${e}; i++) {
    vec2 offset = (vogelDiskSample(i, ${e}, angle) * texelSize) * 2.0 * PENUMBRA_FILTER_SIZE;
    float depth = texture(shadowMap, uv + offset).r;
    if (depth < compare) { blockerDepthSum += depth; blockers++; }
  }
  return blockers > 0.0 ? blockerDepthSum / blockers : -1.0;
}
float vogelFilter(vec2 uv, float zReceiver, float filterRadius, float angle) {
  float texelSize = 1.0 / float(textureSize(shadowMap, 0).x);
  float shadow = 0.0;
  for (int i = 0; i < ${e}; i++) {
    vec2 offset = vogelDiskSample(i, ${e}, angle) * texelSize * (1.0 + filterRadius * float(${o}));
    shadow += step(zReceiver, texture(shadowMap, uv + offset).r);
  }
  return shadow / float(${e});
}
float PCSS(vec4 coords) {
  float angle = highPassRandRGB(gl_FragCoord.xy).r * PI2;
  float avgBlockerDepth = findBlocker(coords.xy, coords.z, angle);
  if (avgBlockerDepth == -1.0) return 1.0;
  float penumbraRatio = (coords.z - avgBlockerDepth) / avgBlockerDepth;
  return vogelFilter(coords.xy, coords.z, 1.25 * penumbraRatio, angle);
}
void main() {
  vec3 c = vShadowCoord.xyz / vShadowCoord.w;
  float lit = 1.0;
  if (all(greaterThanEqual(c, vec3(0.0))) && all(lessThanEqual(c, vec3(1.0)))) lit = PCSS(vec4(c, 1.0));
  gl_FragColor = vec4(vec3(0.0), uOpacity * (1.0 - lit));
}`),Se=`
in vec3 position;
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,et=F(`
in vec2 vUv;
float psrdnoise(vec2 x, vec2 period) {
  vec2 uv = vec2(x.x + x.y * 0.5, x.y);
  vec2 i0 = floor(uv), f0 = fract(uv);
  float cmp = step(f0.y, f0.x);
  vec2 o1 = vec2(cmp, 1.0 - cmp);
  vec2 i1 = i0 + o1, i2 = i0 + 1.0;
  vec2 v0 = vec2(i0.x - i0.y * 0.5, i0.y);
  vec2 v1 = vec2(v0.x + o1.x - o1.y * 0.5, v0.y + o1.y);
  vec2 v2 = vec2(v0.x + 0.5, v0.y + 1.0);
  vec2 x0 = x - v0, x1 = x - v1, x2 = x - v2;
  vec3 iu = vec3(i0.x, i1.x, i2.x);
  vec3 iv = vec3(i0.y, i1.y, i2.y);
  vec3 hash = mod(iu, 289.0);
  hash = mod((hash * 51.0 + 2.0) * hash + iv, 289.0);
  hash = mod((hash * 34.0 + 10.0) * hash, 289.0);
  vec3 psi = hash * 0.07482;
  vec3 gx = cos(psi);
  vec3 gy = sin(psi);
  vec3 w = max(0.8 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
  vec3 w4 = w * w * w * w;
  vec3 gdotx = vec3(dot(vec2(gx.x, gy.x), x0), dot(vec2(gx.y, gy.y), x1), dot(vec2(gx.z, gy.z), x2));
  return dot(w4, gdotx) * 0.5 + 0.5;
}
void main() {
  gl_FragColor = vec4(psrdnoise(vUv * 8.0, vec2(8.0)), 0.0, 0.0, 1.0);
}`).replace("#define varying in",""),tt=F(`
in vec2 vUv;
uniform sampler2D backgroundTexture;
uniform sampler2D noiseTexture;
uniform float noiseScale;
uniform float intensity;
uniform bool ignoreBlur;
uniform float samples;
uniform vec2 resolution;
const float pi = 3.14159265359;
const float goldenAngle = pi * (3.0 - sqrt(5.0));
vec4 goldenBlur(vec2 uv) {
  float noise = texture2D(noiseTexture, uv * noiseScale).r;
  float angle = pi + (noise - 0.5) * 2.0 * pi * 2.0;
  vec2 polar = vec2(cos(angle), sin(angle));
  vec4 sum = vec4(0.0);
  vec2 a = vec2(1024.0) * vec2(1.0, resolution.x / resolution.y);
  for (int i = 1; i <= 32; i++) {
    if (float(i) > samples) break;
    float r = intensity * sqrt(float(i) / samples);
    float theta = float(i) * goldenAngle;
    vec2 offset = vec2(polar.x * cos(theta) - polar.y * sin(theta), polar.y * cos(theta) + polar.x * sin(theta));
    sum += texture2D(backgroundTexture, uv + (offset * r / a));
  }
  return sum / samples;
}
void main() {
  gl_FragColor = ignoreBlur ? texture2D(backgroundTexture, vUv) : goldenBlur(vUv);
}`).replace("#define varying in","");var le=2048;class Me{canvas;gl;camera=new te;quad;programs;depth;blur;shadowTarget;scene;noise;light=new te;shadowMatrix=new Float32Array(16);blurSamples=24;constructor(e){this.canvas=e;let t=e.getContext("webgl2",{antialias:!0,alpha:!0,premultipliedAlpha:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"});if(!t)throw Error("webgl2 unavailable");this.gl=t,this.programs={basic:C(t,Ee,$e),cover:C(t,se,ze),plastic:C(t,se,We),back:C(t,se,Ye),reflection:C(t,Ee,qe),sticker:C(t,Xe,je),shadow:C(t,Qe,Je())},this.depth=C(t,Ke,Ze),this.blur=C(t,Se,tt),this.quad=L(t,2,2),this.shadowTarget=ie(t,le,le,!0),this.scene=ie(t,1,1),this.noise=ie(t,256,256),t.bindTexture(t.TEXTURE_2D,this.noise.color),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),this.bakeNoise(),this.light.ortho=5,this.light.near=0.5,this.light.far=500}bakeNoise(){let{gl:e}=this,t=C(e,Se,et);e.bindFramebuffer(e.FRAMEBUFFER,this.noise.fb),e.viewport(0,0,256,256),e.useProgram(t.program),W(e,this.quad),e.bindFramebuffer(e.FRAMEBUFFER,null)}resize(){let e=Math.min(devicePixelRatio||1,2),t=this.canvas.clientWidth,o=this.canvas.clientHeight,i=Math.max(1,Math.round(t*e)),r=Math.max(1,Math.round(o*e));if(this.canvas.width!==i||this.canvas.height!==r)this.canvas.width=i,this.canvas.height=r;return ke(this.gl,this.scene,i,r),this.camera.aspect=t/o,{width:t,height:o}}setLight(e){this.light.position=e.position,this.light.target=e.target;let t=new Float32Array([0.5,0,0,0,0,0.5,0,0,0,0,0.5,0,0.5,0.5,0.5,1]);this.shadowMatrix=g(t,this.light.viewProjection())}render(e,t){let{gl:o}=this,i=e.filter((c)=>c.castShadow);o.enable(o.DEPTH_TEST),o.enable(o.CULL_FACE),o.bindFramebuffer(o.FRAMEBUFFER,this.shadowTarget.fb),o.viewport(0,0,le,le),o.clear(o.DEPTH_BUFFER_BIT),o.useProgram(this.depth.program);let r=this.light.view(),a=this.light.projection();for(let c of i)o.uniformMatrix4fv(this.depth.u.modelViewMatrix,!1,g(r,c.model)),o.uniformMatrix4fv(this.depth.u.projectionMatrix,!1,a),W(o,c.geo);let n=this.canvas.width,l=this.canvas.height,s=e.filter((c)=>!c.hidden);if(t.on)o.bindFramebuffer(o.FRAMEBUFFER,this.scene.fb),o.viewport(0,0,n,l),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this.pass(s.filter((c)=>c.layer===0)),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,n,l),o.disable(o.DEPTH_TEST),o.disable(o.BLEND),o.useProgram(this.blur.program),this.bind(this.blur,{backgroundTexture:this.scene.color,noiseTexture:this.noise.color,noiseScale:t.noiseScale,intensity:t.intensity,ignoreBlur:!1,samples:this.blurSamples,resolution:[n,l]}),W(o,this.quad),o.enable(o.DEPTH_TEST),o.clear(o.DEPTH_BUFFER_BIT),this.pass(s.filter((c)=>c.layer===1));else o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,n,l),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this.pass(s)}pass(e){let{gl:t}=this,o=this.camera.view(),i=this.camera.projection(),r=(l)=>o[2]*l.model[12]+o[6]*l.model[13]+o[10]*l.model[14]+o[14],a=e.filter((l)=>!l.transparent),n=e.filter((l)=>l.transparent).sort((l,s)=>r(l)-r(s));t.disable(t.BLEND);for(let l of a)this.drawItem(l,o,i);t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);for(let l of n)this.drawItem(l,o,i);t.disable(t.BLEND)}drawItem(e,t,o){let{gl:i}=this,r=this.programs[e.kind];i.useProgram(r.program);let a=g(t,e.model),n=H(a);if(i.uniformMatrix4fv(r.u.modelMatrix,!1,e.model),i.uniformMatrix4fv(r.u.modelViewMatrix,!1,a),i.uniformMatrix4fv(r.u.projectionMatrix,!1,o),i.uniformMatrix3fv(r.u.normalMatrix,!1,[n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]]),i.uniform3fv(r.u.cameraPosition,this.camera.position),e.kind==="shadow")i.uniformMatrix4fv(r.u.shadowMatrix,!1,this.shadowMatrix),this.bind(r,{...e.uniforms,shadowMap:this.shadowTarget.depth});else this.bind(r,e.uniforms);W(i,e.geo)}bind(e,t){let{gl:o}=this,i=0;for(let[r,a]of Object.entries(t)){let n=e.u[r];if(n===void 0||n===null)continue;if(a instanceof WebGLTexture)o.activeTexture(o.TEXTURE0+i),o.bindTexture(o.TEXTURE_2D,a),o.uniform1i(n,i++);else if(typeof a==="boolean")o.uniform1i(n,a?1:0);else if(typeof a==="number")o.uniform1f(n,a);else if(a.length===2)o.uniform2fv(n,a);else if(a.length===3)o.uniform3fv(n,a)}}texture(e,t=!0){return ue(this.gl,e,{flipY:t,mipmap:!!e&&!(e instanceof HTMLVideoElement)})}}var _=(e,t=document)=>t.querySelector(e),Q=(e,t=document)=>[...t.querySelectorAll(e)],ot=(e,t)=>{e.classList.toggle("opacity-100",t),e.classList.toggle("visible",t),e.classList.toggle("opacity-0",!t),e.classList.toggle("invisible",!t)};function dt(e){let t=e.dataset.text??e.textContent??"";e.dataset.text=t,e.textContent="";let o=t.split(/\s+/).filter(Boolean).map((a)=>{let n=document.createElement("span");return n.textContent=a+" ",e.appendChild(n),n}),i=[],r=-1/0;for(let a of o){if(a.offsetTop>r+1)i.push([]),r=a.offsetTop;i[i.length-1].push(a)}e.textContent="",i.forEach((a,n)=>{let l=document.createElement("span");l.className="line",l.style.setProperty("--line-index",String(n)),l.textContent=a.map((s)=>s.textContent).join("").trimEnd(),e.appendChild(l),e.appendChild(document.createTextNode(" "))})}class Re{store;apps;title=_("[data-title]");list=_("[data-list]");glow=_("[data-glow]");announcer=_("[data-announcer]");hoverButtons=new Map(Q("[data-hover-buttons]").map((e)=>[e.dataset.albumId,e]));activeOpen=new Map(Q("[data-active-open]").map((e)=>[e.dataset.activeOpen,e]));details=new Map(Q("[data-detail]").map((e)=>[e.dataset.detail,e]));overButtons=null;openShown=null;spin=null;icon=_('link[rel="icon"]');iconHref=this.icon.href;offs=[];constructor(e,t){this.store=e;this.apps=t;let o=(i,r,a,n)=>{i.addEventListener(r,a,n),this.offs.push(()=>i.removeEventListener(r,a,n))};this.offs.push(e.subscribe((i,r)=>this.sync(i,r)));for(let[i,r]of this.hoverButtons)o(r,"pointerenter",()=>{if(this.overButtons=i,e.get().phase==="inactive"&&e.get().active===null)e.set({lifted:i})}),o(r,"pointerleave",()=>this.overButtons=null),o(r,"focusin",()=>e.get().active===null&&e.set({lifted:i})),o(r,"focusout",(a)=>{if(!r.contains(a.relatedTarget)&&e.get().active===null&&e.get().lifted===i)e.set({lifted:null})});for(let i of Q("[data-details]"))o(i,"click",()=>this.toggle(i.dataset.details));for(let i of Q("[data-list-item]")){let r=i.dataset.listItem;o(i,"click",(a)=>{a.stopPropagation(),this.toggle(r,!0)}),o(i,"pointerover",()=>e.get().phase==="inactive"&&e.get().active===null&&e.set({lifted:r})),o(i,"pointerout",()=>e.get().phase==="inactive"&&e.get().lifted===r&&e.set({lifted:null})),o(i,"focus",()=>e.get().phase==="inactive"&&e.get().active===null&&e.set({lifted:r})),o(i,"blur",()=>e.get().phase==="inactive"&&e.get().active===null&&e.get().lifted===r&&e.set({lifted:null}))}o(window,"keydown",(i)=>{let r=e.get();if(i.metaKey||i.ctrlKey||i.altKey)return;if(r.active===null){if(r.phase!=="inactive")return;let a=this.apps.map((n)=>n.id);if(i.key==="ArrowRight"||i.key==="ArrowLeft"||i.key==="ArrowDown"||i.key==="ArrowUp"){i.preventDefault();let n=i.key==="ArrowRight"||i.key==="ArrowDown"?1:-1,l=r.lifted?a.indexOf(r.lifted):n>0?-1:0;e.set({lifted:a[(l+n+a.length)%a.length]})}else if(i.key==="Enter"&&r.lifted&&!i.target.closest?.("a, button"))i.preventDefault(),e.set({active:r.lifted});return}if(i.key==="Escape")e.set({active:null});else if(i.key===" "&&r.phase==="active")i.preventDefault(),e.set({flipped:r.flipped===r.active?null:r.active})}),o(document,"click",(i)=>{let r=e.get();if(r.active===null||j(r.phase))return;let a=i.target;if(a.closest("canvas, [data-active-open] a, [data-notes], [data-notes-sheet]"))return;if(a.closest("[data-flip]")){if(r.phase==="active")e.set({flipped:r.flipped===r.active?null:r.active});return}i.preventDefault(),i.stopPropagation(),e.set({active:null})},{capture:!0})}destroy(){for(let e of this.offs)e();this.stopSpin()}isOverButtons(){return this.overButtons!==null}toggle(e,t=!1){let o=this.store.get();if(j(o.phase))return;if(o.active===e||t&&o.active!==null)this.store.set({active:null});else if(o.active===null)this.store.set({active:e});document.activeElement?.blur()}sync(e,t){if(t.phase==="intro"&&e.phase!=="intro")this.title.style.opacity="1",this.list.style.opacity="1",this.list.style.visibility="visible";if(e.phase==="animatingForward")this.list.style.pointerEvents="none";if(e.phase==="animatingBackward")this.list.style.pointerEvents="auto";if(e.phase!=="intro"&&e.active!==t.active){let o=e.active!==null;this.title.style.opacity=o?"0":"1",this.title.style.visibility=o?"hidden":"visible",this.title.style.transitionDelay=o?"0s":"0.5s"}this.glow.classList.toggle("opacity-100",e.phase==="animatingForward"||e.phase==="active"),this.glow.classList.toggle("opacity-0",!(e.phase==="animatingForward"||e.phase==="active"));for(let[o,i]of this.hoverButtons){let r=e.lifted===o&&e.active===null&&e.phase!=="animatingBackward"&&e.phase!=="intro";i.classList.toggle("opacity-100",r),i.classList.toggle("opacity-0",!r),i.classList.toggle("is-on",r),i.style.visibility=e.active!==null?"hidden":""}for(let[o,i]of this.details)this.detail(o,i,e);if(this.openButton(e),e.active!==t.active)if(e.active!==null){let o=this.apps.find((i)=>i.id===e.active);this.announcer.textContent=`${o.name} opened. Press Space to flip it, Escape to put it back.`,this.startSpin()}else this.announcer.textContent="Record put back.",this.stopSpin()}detail(e,t,o){let i=_("[data-detail-body]",t),r=!t.classList.contains("hidden");if(o.active===e&&!r)t.classList.remove("hidden","opacity-0"),t.classList.add("opacity-100"),t.setAttribute("aria-hidden","false"),dt(_("[data-detail-text]",t));if(o.active!==e&&!r)return;let a=o.active===e&&(o.phase==="animatingForward"||o.phase==="active");if(t.classList.toggle("is-open",a||r&&o.phase==="animatingBackward"),i.classList.toggle("opacity-100",a),i.classList.toggle("opacity-0",!a),!a&&r)setTimeout(()=>{if(this.store.get().active===e)return;t.classList.add("hidden","opacity-0"),t.classList.remove("opacity-100","is-open"),t.setAttribute("aria-hidden","true")},400)}openButton(e){let t=e.active!==null&&e.phase==="active"?e.active:null;if(t===this.openShown)return;if(this.openShown){let o=this.activeOpen.get(this.openShown);ot(o,!1),o.classList.add("pointer-events-none"),setTimeout(()=>this.openShown!==o.dataset.activeOpen&&o.classList.add("translate-y-10"),700)}if(this.openShown=t,t){let o=this.activeOpen.get(t);setTimeout(()=>{if(this.openShown!==t)return;o.classList.remove("translate-y-10","pointer-events-none"),ot(o,!0)},50)}}frame(e,t){let o=this.store.get();if(o.lifted&&o.active===null){let i=e(o.lifted),r=this.hoverButtons.get(o.lifted);if(i&&r)r.style.transform=`translate(${i[0]}px, ${i[1]}px) translate(-50%, 0)`}if(this.openShown){let i=t(this.openShown);if(i!==null)this.activeOpen.get(this.openShown).style.top=`${i+16}px`}}startSpin(){if(innerWidth<599||this.spin!==null)return;let e=document.createElement("canvas");e.width=e.height=32;let t=e.getContext("2d"),o=0,i=()=>{Ie(t,o),this.icon.href=e.toDataURL("image/png"),o+=Math.PI/4};i(),this.spin=window.setInterval(()=>!document.hidden&&i(),500)}stopSpin(){if(this.spin!==null)clearInterval(this.spin);this.spin=null,this.icon.href=this.iconHref}}var Ae="(max-width: 767px), (max-height: 500px) and (pointer: coarse)",it={lifted:null,active:null,phase:"intro",flipped:null};function mt(){document.querySelector("[data-fallback]").style.display="block",document.querySelector("[data-canvas]").style.display="none",document.querySelector("[data-list]").style.display="none",document.querySelector('[data-section-name="heading"] [data-title]').style.opacity="1"}async function ft(){let e=document.querySelector("[data-gl]"),t,o;await new Promise((p)=>requestAnimationFrame(()=>setTimeout(p,0)));try{t=new Me(e),o=await _e(t,X)}catch(p){console.error(p),mt();return}let i=Be({...it}),r=new fe,a=new E([0,6]),n=(p)=>document.body.style.cursor=p?"pointer":"default",l=matchMedia(Ae).matches,s,c=null,u=()=>{if(c?.destroy(),s?.destroy(),r.clear(),i.set({...it}),l=matchMedia(Ae).matches,t.blurSamples=l?8:24,l)s=new ne(t,i,r,o,X),c=null;else s=new O(t,i,r,o,X,n),c=new Re(i,X);let{width:p}=t.resize();s.frame(p),h=!1};i.subscribe((p,x)=>{if(p.phase===x.phase)return;let w=p.phase==="animatingForward"||p.phase==="active";a.start([w?5:0,w?l?10:6:1],{duration:400,delay:100})});let h=!1;if(u(),new Te(i),new URLSearchParams(location.search).has("debug"))Object.assign(window,{__apps:{store:i,renderer:t,scene:()=>s,blur:a}});let f=()=>({width:e.clientWidth,height:e.clientHeight}),m=(p)=>{let x=e.getBoundingClientRect();return[(p.clientX-x.left)/x.width*2-1,-((p.clientY-x.top)/x.height*2-1)]};e.addEventListener("pointermove",(p)=>s instanceof O&&s.pointerMove(m(p))),e.addEventListener("pointerdown",(p)=>s.pointerDown(m(p),p)),e.addEventListener("pointerup",(p)=>s instanceof ne&&s.pointerUp(m(p),p)),e.addEventListener("pointerleave",()=>{if(!(s instanceof O))return;setTimeout(()=>!c?.isOverButtons()&&s.pointerLeave(),0)}),new ResizeObserver(()=>{if(matchMedia(Ae).matches!==l){u();return}let{width:p}=t.resize();s.frame(p)}).observe(e);let y=performance.now(),b=(p)=>{let x=Math.min(p-y,50);y=p,r.tick(x),a.step(x),s.step(x);let w=i.get(),S=w.phase==="animatingForward"||w.phase==="active"||w.phase==="animatingBackward";if(t.render(s.items(),{on:S,intensity:a.value[0],noiseScale:a.value[1]}),!h)h=!0,e.classList.replace("opacity-0","opacity-100"),s.intro();if(c&&s instanceof O){let A=s,P=(k)=>A.albums.find((M)=>M.app.id===k)??null;c.frame((k)=>{let M=P(k);return M?A.anchor(M,[0,-d.albumSize/2,0],f()):null},(k)=>{let M=P(k);return M?A.bottomOf(M,f()):null})}requestAnimationFrame(b)};requestAnimationFrame(b)}ft();
