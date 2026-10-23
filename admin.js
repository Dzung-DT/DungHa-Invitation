(() => {
  "use strict";
  const KEY="weddingInvitationDataV1", RSVP_KEY="weddingInvitationRsvpV1";
  const defaults={
    bride:"Trọng Dũng",groom:"Thu Hà",eyebrow:"Ngày chung đôi",heroMessage:"Một hành trình mới bắt đầu từ hôm nay.",
    introTitle:"Chúng mình sắp về chung một nhà!",introText:"Sau những ngày tháng cùng nhau viết nên câu chuyện nhỏ, chúng mình mong được chia sẻ khoảnh khắc đặc biệt này với những người thân yêu nhất.",
    signature:"Thân mời, Trọng Dũng & Thu Hà",detailsMessage:"Sự hiện diện của bạn là niềm vui lớn với gia đình chúng mình.",
    date:"2026-11-16",time:"14:00",receptionDate:"2026-11-15",receptionTime:"16:00",venue:"Tư gia nhà trai",address:"Xóm 1, Tổ dân phố Thượng Mão, Phường Mão Điền, Thành phố Bắc Ninh",
    mapUrl:"https://maps.google.com/?q=25+Nguyen+Hue+Quan+1+TP+Ho+Chi+Minh",ceremonyTitle:"Lễ thành hôn",receptionTitle:"Tiệc mừng hạnh phúc",
    rsvpDeadline:"10/03/2027",closingText:"Hẹn gặp bạn ở ngày hạnh phúc nhất của chúng mình.",
    heroImage:"Phóng_WAGO1064.JPG",heroImage2:"Phóng_WAGO0967.JPG",
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
  const $=id=>document.getElementById(id);
  function load(){
    try{
      const saved=JSON.parse(localStorage.getItem(KEY)||"{}");
      const data={...defaults,...saved};
      if(saved.galleryVersion!==defaults.galleryVersion){data.photos=defaults.photos;data.galleryVersion=defaults.galleryVersion;save(data)}
      if(!Object.prototype.hasOwnProperty.call(saved,"receptionDate")){
        data.receptionDate=defaults.receptionDate;
        data.receptionTime=defaults.receptionTime;
        save(data);
      }
      return data;
    }catch{return {...defaults}}
  }
  function save(data){localStorage.setItem(KEY,JSON.stringify(data))}
  function rsvps(){try{return JSON.parse(localStorage.getItem(RSVP_KEY)||"[]")}catch{return []}}
  function flash(id,msg){$(id).textContent=msg}
  function download(name,content,type){const blob=new Blob([content],{type});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function fillForm(data){const form=$("contentForm");Object.keys(data).forEach(k=>{const field=form.elements.namedItem(k);if(field&&typeof data[k]==="string")field.value=data[k]})}
  function renderPhotos(){
    const data=load(),container=$("photoFields");container.replaceChildren();
    const photos=[...(data.photos||[])];while(photos.length<4)photos.push({url:"",alt:""});
    photos.slice(0,13).forEach((p,i)=>{
      const box=document.createElement("div");box.className="photo-row";
      const label=document.createElement("label");label.textContent=`Ảnh ${i+1} — URL`;label.htmlFor=`photoUrl${i}`;
      const url=document.createElement("input");url.id=`photoUrl${i}`;url.type="url";url.value=p.url||"";url.placeholder="https://...";
      const altLabel=document.createElement("label");altLabel.textContent="Mô tả ảnh";altLabel.htmlFor=`photoAlt${i}`;
      const alt=document.createElement("input");alt.id=`photoAlt${i}`;alt.value=p.alt||"";alt.maxLength=150;alt.placeholder="Ảnh cưới";
      const img=document.createElement("img");img.alt="Xem trước ảnh";img.src=p.url||"";img.hidden=!p.url;
      url.addEventListener("input",()=>{img.src=url.value;img.hidden=!url.value});
      box.append(label,url,altLabel,alt,img);container.append(box);
    });
    const add=document.createElement("p");add.className="small";add.textContent="Để trống URL nếu không muốn hiển thị ảnh đó.";container.append(add);
  }
  function renderRsvps(){
    const rows=rsvps(),yes=rows.filter(r=>r.attendance==="yes").length,no=rows.filter(r=>r.attendance==="no").length;
    $("rsvpStats").textContent=`Tổng ${rows.length} phản hồi · ${yes} khách xác nhận tham dự · ${no} khách không thể tham dự.`;
    const container=$("rsvpTable");
    if(!rows.length){container.innerHTML='<div class="empty-state">Chưa có phản hồi RSVP nào trên trình duyệt này.</div>';return}
    let html='<table class="rsvp-table"><thead><tr><th>Tên</th><th>Điện thoại</th><th>Trạng thái</th><th>Số người</th><th>Lời chúc</th><th>Thời gian</th></tr></thead><tbody>';
    rows.forEach(r=>{html+=`<tr><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.phone||"—")}</td><td>${r.attendance==="yes"?"Tham dự":"Không tham dự"}</td><td>${Number(r.count)||1}</td><td>${escapeHtml(r.message||"—")}</td><td>${escapeHtml(r.createdAt?new Date(r.createdAt).toLocaleString("vi-VN"):"—")}</td></tr>`});
    container.innerHTML=html+"</tbody></table>";
  }
  document.querySelectorAll(".admin-tab").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".admin-tab").forEach(b=>b.classList.toggle("active",b===btn));
    document.querySelectorAll(".admin-panel").forEach(p=>p.classList.toggle("active",p.id===`panel-${btn.dataset.panel}`));
    if(btn.dataset.panel==="rsvps")renderRsvps();if(btn.dataset.panel==="photos")renderPhotos();
  }));
  fillForm(load());
  $("contentForm").addEventListener("submit",e=>{
    e.preventDefault();const data=load(),form=new FormData(e.currentTarget);
    for(const [k,v] of form.entries())data[k]=String(v).trim();
    data.photos=load().photos;save(data);flash("contentStatus","Đã lưu nội dung. Mở lại hoặc tải lại trang thiệp để xem thay đổi.");
  });
  $("resetContent").addEventListener("click",()=>{
    if(!confirm("Khôi phục nội dung mẫu? Ảnh và RSVP sẽ không bị xóa."))return;
    const old=load();save({...defaults,photos:old.photos});fillForm(load());flash("contentStatus","Đã khôi phục nội dung mẫu.");
  });
  $("savePhotos").addEventListener("click",()=>{
    const data=load(),photos=[];
    for(let i=0;i<13;i++){const url=$(`photoUrl${i}`);if(!url)continue;const value=url.value.trim();if(value)photos.push({url:value,alt:$(`photoAlt${i}`).value.trim()||`Ảnh cưới ${i+1}`})}
    data.photos=photos;save(data);flash("photoStatus","Đã lưu album ảnh.");
  });
  $("exportCsv").addEventListener("click",()=>{
    const rows=rsvps(),cols=["name","phone","attendance","count","message","createdAt"],labels=["Tên","Điện thoại","Trạng thái","Số người","Lời chúc","Thời gian"];
    const cell=v=>`"${String(v??"").replace(/"/g,'""')}"`;
    const lines=[labels.map(cell).join(","),...rows.map(r=>cols.map(k=>cell(k==="attendance"?(r[k]==="yes"?"Tham dự":"Không tham dự"):r[k])).join(","))];
    download("danh-sach-rsvp.csv","\ufeff"+lines.join("\r\n"),"text/csv;charset=utf-8");
  });
  $("clearRsvps").addEventListener("click",()=>{if(confirm("Xóa toàn bộ RSVP đang lưu trong trình duyệt này?")){localStorage.removeItem(RSVP_KEY);renderRsvps()}});
  $("exportJson").addEventListener("click",()=>download("sao-luu-thiep-cuoi.json",JSON.stringify({invitation:load(),rsvps:rsvps()},null,2),"application/json"));
  $("importJson").addEventListener("click",()=>$("importFile").click());
  $("importFile").addEventListener("change",async e=>{
    const file=e.target.files[0];if(!file)return;
    try{
      const parsed=JSON.parse(await file.text()),data=parsed.invitation||parsed;
      if(!data||typeof data!=="object"||Array.isArray(data))throw new Error("invalid");
      save({...defaults,...data});if(Array.isArray(parsed.rsvps))localStorage.setItem(RSVP_KEY,JSON.stringify(parsed.rsvps));
      fillForm(load());renderPhotos();renderRsvps();flash("backupStatus","Đã nhập dữ liệu sao lưu.");
    }catch{flash("backupStatus","File JSON không hợp lệ hoặc không đọc được.");}
    e.target.value="";
  });
  $("resetAll").addEventListener("click",()=>{
    if(!confirm("Khôi phục mẫu và xóa RSVP trên trình duyệt này? Hành động không thể hoàn tác."))return;
    save({...defaults});localStorage.removeItem(RSVP_KEY);fillForm(load());renderPhotos();renderRsvps();flash("backupStatus","Đã khôi phục dữ liệu mẫu.");
  });
})();
