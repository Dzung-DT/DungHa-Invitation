(() => {
  "use strict";
  const KEY = "weddingInvitationDataV1";
  const RSVP_KEY = "weddingInvitationRsvpV1";
  const defaults = {
    bride:"Trọng Dũng", groom:"Thu Hà", eyebrow:"Ngày chung đôi",
    heroMessage:"Một hành trình mới bắt đầu từ hôm nay.",
    introTitle:"Chúng mình sắp về chung một nhà!",
    introText:"Sau những ngày tháng cùng nhau viết nên câu chuyện nhỏ, chúng mình mong được chia sẻ khoảnh khắc đặc biệt này với những người thân yêu nhất.",
    signature:"Thân mời, Trọng Dũng & Thu Hà",
    detailsMessage:"Sự hiện diện của bạn là niềm vui lớn với gia đình chúng mình.",
    date:"2026-11-16", time:"14:00", receptionDate:"2026-11-15", receptionTime:"16:00",
    venue:"Tư gia nhà trai", address:"Xóm 1, Tổ dân phố Thượng Mão, Phường Mão Điền, Thành phố Bắc Ninh",
    mapUrl:"https://maps.app.goo.gl/nwSwh5NCdH24ihhd8",
    ceremonyTitle:"Lễ thành hôn", receptionTitle:"Tiệc mừng hạnh phúc",
    rsvpDeadline:"16/11/2026",
    closingText:"Hẹn gặp bạn ở ngày hạnh phúc nhất của chúng mình.",
    heroImage:"Phóng_WAGO1064.JPG",
    heroImage2:"Phóng_WAGO0967.JPG",
    galleryVersion:"imagelist-v1",
    photos:[
      {url:"ImageList/WAGO0685.JPG",alt:"Wedding photo 1"},
      {url:"ImageList/WAGO0842.JPG",alt:"Wedding photo 2"},
      {url:"ImageList/WAGO1008.JPG",alt:"Wedding photo 3"},
      {url:"ImageList/WAGO1019.JPG",alt:"Wedding photo 4"},
      {url:"ImageList/WAGO1162.JPG",alt:"Wedding photo 5"},
      {url:"ImageList/WAGO1255.JPG",alt:"Wedding photo 6"},
      {url:"ImageList/WAGO1475.JPG",alt:"Wedding photo 7"},
      {url:"ImageList/WAGO1485.JPG",alt:"Wedding photo 8"},
      {url:"ImageList/WAGO1536.JPG",alt:"Wedding photo 9"},
      {url:"ImageList/WAGO1561.JPG",alt:"Wedding photo 10"},
      {url:"ImageList/Để bàn_WAGO1301.JPG",alt:"Wedding photo 11"},
      {url:"ImageList/Để bàn_WAGO1416.JPG",alt:"Wedding photo 12"},
      {url:"ImageList/Để bàn_WAGO1514.JPG",alt:"Wedding photo 13"}
    ]
  };
  function loadData(){
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (!saved) return {...defaults};
      const data = {...defaults,...saved};
      if (saved.galleryVersion !== defaults.galleryVersion) {
        data.photos = defaults.photos;
        data.galleryVersion = defaults.galleryVersion;
        localStorage.setItem(KEY,JSON.stringify(data));
      }
      if (!Object.prototype.hasOwnProperty.call(saved,"receptionDate")) {
        data.receptionDate = defaults.receptionDate;
        data.receptionTime = defaults.receptionTime;
        localStorage.setItem(KEY,JSON.stringify(data));
      }
      return data;
    }
    catch { return {...defaults}; }
  }
  function saveRSVP(record){
    const list = JSON.parse(localStorage.getItem(RSVP_KEY) || "[]");
    list.unshift({...record,createdAt:new Date().toISOString()});
    localStorage.setItem(RSVP_KEY,JSON.stringify(list));
  }
  function formatDate(dateString){
    if(!dateString) return "";
    const d = new Date(dateString+"T12:00:00");
    if(Number.isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("vi-VN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d);
  }
  function formatTime(t){
    if(!t) return "";
    const [h,m] = t.split(":").map(Number);
    return `${String(h).padStart(2,"0")}:${String(m||0).padStart(2,"0")}`;
  }
  function applyData(data){
    document.title = `Thiệp cưới | ${data.bride} & ${data.groom}`;
    document.querySelectorAll('[data-bind]').forEach(el=>{
      const key=el.dataset.bind;
      if(key==="dateText") el.textContent=formatDate(data.date);
      else if(key==="receptionDateText") el.textContent=formatDate(data.receptionDate||data.date);
      else if(key==="timeText") el.textContent=formatTime(data.time);
      else if(key==="receptionTime") {
        const time = formatTime(data.receptionTime);
        const hour = Number(String(data.receptionTime||"").split(":")[0]);
        el.textContent = time ? `${time} ${hour < 12 ? "AM" : "PM"}` : "";
      }
      else if(data[key]!==undefined) el.textContent=data[key];
    });
    startHeroSlideshow(data);
    const map=document.getElementById("mapLink");
    if(map) map.href=data.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(data.address||"")}`;
    renderGallery(data.photos);
    startCountdown(data.date,data.time);
  }
  function galleryThumbnailUrl(url){
    const path=String(url||"").split("?")[0];
    if(!path.startsWith("ImageList/")||!/.jpe?g$/i.test(path))return url;
    return path.replace(/^ImageList\//,"ImageList/thumbs/").replace(/\.jpe?g$/i,".webp");
  }
  function renderGallery(photos){
    const host=document.getElementById("galleryGrid");
    if(!host)return;
    const items=(photos||[]).filter(photo=>photo&&photo.url);
    host.replaceChildren();host.className="gallery-grid";
    items.forEach((photo,index)=>{
      const button=document.createElement("button");button.type="button";button.className="gallery-item";
      button.setAttribute("aria-label",`Open wedding photo ${index+1} of ${items.length}`);
      const img=document.createElement("img");img.src=galleryThumbnailUrl(photo.url);img.alt=photo.alt||`Wedding photo ${index+1}`;img.loading=index<4?"eager":"lazy";img.decoding="async";
      button.append(img);button.addEventListener("click",()=>openGallery(items,index));host.append(button);
    });
  }
  function openGallery(items,startIndex){
    let current=startIndex,pointer=null,animating=false;
    const overlay=document.createElement("div");overlay.className="gallery-lightbox";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label","Wedding photo album");
    const viewer=document.createElement("div");viewer.className="gallery-viewer";
    const imageArea=document.createElement("div");imageArea.className="gallery-viewer-image-area";
    const track=document.createElement("div");track.className="gallery-viewer-track";
    const frames=[0,1,2].map(()=>{const img=document.createElement("img");img.className="gallery-viewer-slide";img.alt="";img.draggable=false;track.append(img);return img;});
    const counter=document.createElement("span");counter.className="gallery-viewer-count";counter.setAttribute("aria-live","polite");
    const previous=document.createElement("button");previous.type="button";previous.className="gallery-viewer-arrow gallery-viewer-previous";previous.setAttribute("aria-label","Previous photo");previous.textContent="\u2039";
    const next=document.createElement("button");next.type="button";next.className="gallery-viewer-arrow gallery-viewer-next";next.setAttribute("aria-label","Next photo");next.textContent="\u203a";
    const close=document.createElement("button");close.type="button";close.className="gallery-viewer-close";close.setAttribute("aria-label","Close album");close.textContent="\u00d7";
    const thumbs=document.createElement("div");thumbs.className="gallery-thumbnails";thumbs.setAttribute("role","group");thumbs.setAttribute("aria-label","Choose a photo");
    const thumbButtons=items.map((photo,index)=>{
      const button=document.createElement("button");button.type="button";button.className="gallery-thumbnail";button.setAttribute("aria-label",`Show photo ${index+1}`);
      const img=document.createElement("img");img.src=galleryThumbnailUrl(photo.url);img.alt="";img.loading="lazy";img.decoding="async";button.append(img);button.addEventListener("click",()=>jumpTo(index));thumbs.append(button);return button;
    });
    imageArea.append(track,previous,next,counter);viewer.append(close,imageArea,thumbs);overlay.append(viewer);document.body.append(overlay);
    const wrapped=index=>(index+items.length)%items.length;
    const setSlots=()=>frames.forEach((img,slot)=>{const index=wrapped(current+slot-1);img.src=items[index].url;img.alt=items[index].alt||`Wedding photo ${index+1}`;});
    const updateSelection=()=>{
      counter.textContent=`${current+1} / ${items.length}`;
      thumbButtons.forEach((button,index)=>{button.classList.toggle("active",index===current);if(index===current){button.setAttribute("aria-current","true");button.scrollIntoView({block:"nearest",inline:"nearest",behavior:"smooth"});}else button.removeAttribute("aria-current");});
    };
    const centerTrack=animate=>{track.style.transition=animate?"":"none";track.style.transform=`translate3d(${-imageArea.clientWidth}px,0,0)`;};
    const finishMove=event=>{
      if(event.target!==track||!animating)return;
      current=wrapped(current+animating);animating=false;setSlots();centerTrack(false);track.offsetHeight;track.style.removeProperty("transition");updateSelection();
    };
    const advance=direction=>{
      if(animating)return;
      animating=direction;track.style.transition="";track.style.transform=`translate3d(${-imageArea.clientWidth*(1+direction)}px,0,0)`;
    };
    const jumpTo=index=>{
      if(animating)return;
      current=wrapped(index);setSlots();centerTrack(false);track.offsetHeight;track.style.removeProperty("transition");updateSelection();
    };
    const closeViewer=()=>{document.removeEventListener("keydown",onKeyDown);overlay.remove();};
    const onKeyDown=event=>{if(event.key==="Escape")closeViewer();else if(event.key==="ArrowRight")advance(1);else if(event.key==="ArrowLeft")advance(-1);};
    track.addEventListener("transitionend",finishMove);
    previous.addEventListener("click",()=>advance(-1));next.addEventListener("click",()=>advance(1));close.addEventListener("click",closeViewer);
    overlay.addEventListener("click",event=>{if(event.target===overlay)closeViewer();});
    imageArea.addEventListener("pointerdown",event=>{if(event.target.closest("button")||animating)return;pointer={id:event.pointerId,x:event.clientX,y:event.clientY,delta:0};track.style.transition="none";imageArea.setPointerCapture(event.pointerId);});
    imageArea.addEventListener("pointermove",event=>{if(!pointer||pointer.id!==event.pointerId)return;pointer.delta=event.clientX-pointer.x;if(Math.abs(pointer.delta)>Math.abs(event.clientY-pointer.y))track.style.transform=`translate3d(${-imageArea.clientWidth+pointer.delta}px,0,0)`;});
    imageArea.addEventListener("pointerup",event=>{if(!pointer||pointer.id!==event.pointerId)return;const dx=pointer.delta,dy=event.clientY-pointer.y;pointer=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))advance(dx<0?1:-1);else centerTrack(true);});
    imageArea.addEventListener("pointercancel",()=>{pointer=null;centerTrack(true);});
    window.addEventListener("resize",()=>{if(!animating&&!pointer)centerTrack(false);});
    document.addEventListener("keydown",onKeyDown);setSlots();centerTrack(false);updateSelection();close.focus();
  }
  function startHeroSlideshow(data){
    const frame=document.getElementById("heroImage");
    const image=document.getElementById("heroSlide");
    const counter=document.getElementById("heroSlideCount");
    const previous=document.getElementById("heroPrev");
    const next=document.getElementById("heroNext");
    if(!frame||!image)return;
    const slides=[data.heroImage,data.heroImage2]
      .filter(Boolean)
      .map((url,index)=>({url,alt:`Wedding invitation cover ${index+1}`}));
    if(!slides.length)return;
    let current=0,timer;
    const show=(index,fade=true)=>{
      current=(index+slides.length)%slides.length;
      const slide=slides[current];
      if(fade)image.classList.add("is-changing");
      window.setTimeout(()=>{
        image.src=slide.url;
        image.alt=slide.alt||`Ảnh cưới ${current+1}`;
        if(counter)counter.textContent=`${current+1} / ${slides.length}`;
        if(fade)requestAnimationFrame(()=>image.classList.remove("is-changing"));
      },fade?180:0);
    };
    const stop=()=>window.clearInterval(timer);
    const start=()=>{
      stop();
      if(slides.length>1&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        timer=window.setInterval(()=>show(current+1),5000);
    };
    show(0,false);
    previous?.addEventListener("click",()=>{show(current-1);start();});
    next?.addEventListener("click",()=>{show(current+1);start();});
    frame.addEventListener("mouseenter",stop);
    frame.addEventListener("mouseleave",start);
    frame.addEventListener("focusin",stop);
    frame.addEventListener("focusout",event=>{if(!frame.contains(event.relatedTarget))start();});
    start();
  }
  function openPhoto(src,alt){
    const overlay=document.createElement("div");
    Object.assign(overlay.style,{position:"fixed",inset:"0",zIndex:"100",background:"rgba(25,10,14,.92)",display:"grid",placeItems:"center",padding:"20px",cursor:"zoom-out"});
    const img=document.createElement("img");img.src=src;img.alt=alt;Object.assign(img.style,{maxWidth:"min(100%,1000px)",maxHeight:"90vh",objectFit:"contain",boxShadow:"0 10px 50px #0005"});
    overlay.append(img);overlay.addEventListener("click",()=>overlay.remove());document.body.append(overlay);
  }
  let countdownTimer;
  function startCountdown(date,time){
    clearInterval(countdownTimer);
    const update=()=>{
      const target=new Date(`${date||"2026-11-16"}T${time||"14:00"}:00`).getTime();
      let diff=target-Date.now();const past=diff<0;diff=Math.abs(diff);
      const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
      const put=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=String(val).padStart(2,"0");};
      put("days",d);put("hours",h);put("minutes",m);put("seconds",s);
      const label=document.querySelector(".countdown");
      if(label)label.setAttribute("aria-label",past?"Thời gian kể từ ngày cưới":"Thời gian còn lại đến ngày cưới");
    };
    update();countdownTimer=setInterval(update,1000);
  }
  const menu=document.getElementById("menuToggle"),nav=document.querySelector(".desktop-nav");
  if(menu&&nav)menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.textContent=open?"×":"☰";});
  if(nav)nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu?.setAttribute("aria-expanded","false");if(menu)menu.textContent="☰";}));
  const form=document.getElementById("rsvpForm");
  if(form)form.addEventListener("submit",e=>{
    e.preventDefault();const f=new FormData(form);
    const record={name:String(f.get("name")||"").trim(),phone:String(f.get("phone")||"").trim(),attendance:f.get("attendance"),count:Number(f.get("count")||1),message:String(f.get("message")||"").trim()};
    if(!record.name||!record.attendance)return;
    try{saveRSVP(record);document.getElementById("rsvpFeedback").textContent="Cảm ơn bạn đã phản hồi. Thông tin đã được ghi nhận trên trình duyệt này.";form.reset();}
    catch{document.getElementById("rsvpFeedback").textContent="Chưa thể lưu phản hồi. Vui lòng thử lại.";}
  });
  applyData(loadData());
})();
