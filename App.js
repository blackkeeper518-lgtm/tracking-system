import React, { useState, useEffect } from 'react';

// 🚀 ระบบ Badge สถานะ
const StatusBadge = ({ status }) => (
  <div className="border border-orange-500 bg-black p-2 px-4 rounded-sm shadow-[0_0_15px_rgba(234,88,12,0.4)] animate-pulse mb-6 text-center">
    <span className="text-orange-500 font-mono tracking-widest uppercase text-sm">
      {status === 'รับพัสดุแล้ว' ? '>> MISSION ACCOMPLISHED' : '>> SCANNING SECTOR...'}
    </span>
  </div>
);

export default function SingtoStore() {
  const [phone, setPhone] = useState('');
  const [shipment, setShipment] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false); // แยกสถานะหน้าบ้าน-หลังบ้าน
  const [mockData, setMockData] = useState({});

  // 🔐 ระบบเข้าหลังบ้าน (Double Click ชื่อร้าน + รหัสผ่าน)
  const unlockAdmin = () => {
    if (!isAdminView) {
      const pass = prompt("เข้าสู่โหมดควบคุมหลังบ้าน (Drakside Only):");
      if (pass === "168") { // เปลี่ยนรหัสได้ตรงนี้ครับ
        setIsAdminView(true);
      }
    } else {
      setIsAdminView(false); // กดอีกรอบเพื่อกลับหน้าลูกค้า
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const newData = { ...mockData };
      let count = 0;
      rows.forEach((row, index) => {
        if (index === 0) return;
        const cols = row.split(/\t|,/);
        if (cols.length > 11) {
          const tracking = cols[3]?.trim();
          const customerPhone = cols[11]?.replace(/-/g, '').trim();
          const status = cols[31]?.trim() || 'กำลังจัดส่ง';
          if (customerPhone && tracking) {
            newData[customerPhone] = { tracking, status };
            count++;
          }
        }
      });
      localStorage.setItem('singto_data', JSON.stringify(newData));
      setMockData(newData);
      alert(`✅ อัปเดตข้อมูล ${count} บ้าน เรียบร้อย!`);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('singto_data');
    if (savedData) setMockData(JSON.parse(savedData));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center p-6 relative overflow-hidden border-4 border-orange-600/50 rounded-[3.5rem] shadow-[0_0_60px_rgba(234,88,12,0.3)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600 rounded-full opacity-10 blur-[150px] pointer-events-none"></div>
      
      {/* 🔐 จุดวาร์ปไปหลังบ้าน */}
      <div className="mt-16 mb-12 text-center relative z-10 select-none cursor-pointer" onDoubleClick={unlockAdmin}>
        <h1 className="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-600 animate-pulse-glow uppercase leading-none">
          {isAdminView ? "ADMIN CONTROL" : "SINGTO STORE"}
        </h1>
        <p className="text-[12px] text-orange-400 uppercase tracking-[0.6em] mt-4 font-bold italic">
          {isAdminView ? "DRAKSIDE SYSTEM" : "VIP TRACKING SYSTEM"}
        </p>
      </div>

      <div className="w-full max-w-sm space-y-6 relative z-10 flex-grow">
        {!isAdminView ? (
          /* --- [ หน้าบ้านสำหรับลูกค้า ] --- */
          <div className="animate-in fade-in duration-500">
            <div className="bg-zinc-900/95 p-7 rounded-[2.5rem] border border-orange-500/20 backdrop-blur-xl shadow-2xl">
              <input type="tel" placeholder="กรอกเบอร์โทร..." className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-center text-3xl text-white outline-none focus:border-yellow-400" onChange={(e) => setPhone(e.target.value.replace(/-/g, ''))} />
              <button onClick={() => setShipment(mockData[phone] || null)} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-6 rounded-3xl text-2xl mt-5 shadow-lg uppercase">ค้นหาสถานะ VIP</button>
            </div>
            <button onClick={() => window.location.href = `https://line.me/ti/p/@singoto-store`} className="w-full bg-[#06C755] text-white py-6 rounded-3xl font-black text-xl mt-6 flex items-center justify-center gap-3 border-b-4 border-green-800">ติดต่อแอดมิน (LINE)</button>
            
            {shipment && (
              <div className="animate-in zoom-in duration-300 bg-white text-black p-8 rounded-[3.5rem] text-center shadow-2xl border-t-8 border-orange-600 flex flex-col items-center mt-6">
                <StatusBadge status={shipment.status} />
                <p className="text-3xl font-mono font-black mb-6">{shipment.tracking}</p>
                <button onClick={() => window.location.href=`https://www.flashexpress.co.th/tracking/?trackNo=${shipment.tracking}`} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase">FOLLOW ORDER 🚚</button>
              </div>
            )}
          </div>
        ) : (
          /* --- [ หลังบ้านสำหรับคุณเท่านั้น ] --- */
          <div className="animate-in slide-in-from-bottom duration-500">
            <div className="p-12 border-4 border-dashed border-orange-500 rounded-[3rem] text-center bg-zinc-900 shadow-2xl" onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()}>
                <div className="text-6xl mb-4 animate-bounce">📦</div>
                <p className="text-orange-400 font-bold uppercase tracking-widest mb-4">Master Drakside</p>
                <p className="text-[11px] text-zinc-500 font-bold">โยนไฟล์ Flash เพื่ออัปเดตระบบ</p>
                <button onClick={() => setIsAdminView(false)} className="mt-8 text-[10px] text-zinc-600 underline">กลับหน้าลูกค้า</button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-auto py-10 text-[9px] text-zinc-800 font-bold tracking-[0.5em] uppercase italic relative z-10">SINGTO STORE SOLAR TECHNOLOGY</p>
    </div>
  );
}
