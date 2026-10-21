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
    date:"2026-11-16", time:"14:00", receptionTime:"11:30",
    venue:"Tư gia nhà trai", address:"Xóm 1, Tổ dân phố Thượng Mão, Phường Mão Điền, Thành phố Bắc Ninh",
    mapUrl:"https://maps.app.goo.gl/nwSwh5NCdH24ihhd8",
    ceremonyTitle:"Lễ thành hôn", receptionTitle:"Tiệc mừng hạnh phúc",
    rsvpDeadline:"16/11/2026",
    closingText:"Hẹn gặp bạn ở ngày hạnh phúc nhất của chúng mình.",
    heroImage:"Phóng_WAGO1064.JPG?auto=format&fit=crop&w=1100&q=85",
    photos:[
      {url:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80",alt:"Khoảnh khắc ngày cưới"},
      {url:"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",alt:"Ngày hạnh phúc"},
      {url:"https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80",alt:"Kỷ niệm đôi mình"},
      {url:"https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80",alt:"Cùng nhau trọn đời"}
    ]
  };
  function loadData(){
    try { const saved = JSON.parse(localStorage.getItem(KEY)); return saved ? {...defaults,...saved} : {...defaults}; }
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
    const suffix = h < 12 ? "AM" : "PM";
    return `${String((h%12)||12).padStart(2,"0")}:${String(m||0).padStart(2,"0")} ${suffix}`;
  }
  function applyData(data){
    document.title = `Thiệp cưới | ${data.bride} & ${data.groom}`;
    document.querySelectorAll('[data-bind]').forEach(el=>{
      const key=el.dataset.bind;
      if(key==="dateText") el.textContent=formatDate(data.date);
      else if(key==="timeText") el.textContent=formatTime(data.time);
      else if(key==="receptionTime") el.textContent=formatTime(data.receptionTime);
      else if(data[key]!==undefined) el.textContent=data[key];
    });
    const hero=document.getElementById("heroImage");
    if(hero && data.heroImage) hero.style.backgroundImage=`url("${data.heroImage.replace(/"/g,"%22")}")`;
    const map=document.getElementById("mapLink");
    if(map) map.href=data.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(data.address||"")}`;
    const grid=document.getElementById("galleryGrid");
    if(grid){
      grid.replaceChildren();
      (data.photos||[]).filter(p=>p && p.url).slice(0,8).forEach((photo,i)=>{
        const button=document.createElement("button");button.type="button";button.className="gallery-item";button.setAttribute("aria-label",photo.alt||`Ảnh ${i+1}`);
        const img=document.createElement("img");img.src=photo.url;img.alt=photo.alt||`Ảnh cưới ${i+1}`;img.loading="lazy";
        button.append(img);button.addEventListener("click",()=>openPhoto(photo.url,photo.alt||"Ảnh cưới"));grid.append(button);
      });
    }
    startCountdown(data.date,data.time);
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
      const put=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=String(val).padStart(id==="days"?3:2,"0");};
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