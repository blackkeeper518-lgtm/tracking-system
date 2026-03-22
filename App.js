import React, { useState, useEffect } from 'react';

// --- [ ส่วนประกอบหน้าบ้าน (Customer Page) ] ---
const CustomerView = ({ mockData }) => {
  const [phone, setPhone] = useState('');
  const [shipment, setShipment] = useState(null);

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-sm space-y-6">
      <div className="bg-zinc-900/95 p-7 rounded-[2.5rem] border border-orange-500/20 backdrop-blur-xl shadow-2xl">
        <input type="tel" placeholder="กรอกเบอร์โทร..." className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-center text-3xl text-white outline-none focus:border-yellow-400" onChange={(e) => setPhone(e.target.value.replace(/-/g, ''))} />
        <button onClick={() => setShipment(mockData[phone] || null)} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-6 rounded-3xl text-2xl mt-5 shadow-lg uppercase active:scale-95 transition-all">ค้นหาสถานะ VIP</button>
      </div>
      <button onClick={() => window.location.href = `https://line.me/ti/p/@singoto-store`} className="w-full bg-[#06C755] text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 border-b-4 border-green-800 shadow-lg active:scale-95 transition-all">ติดต่อแอดมิน (LINE)</button>
      {shipment && (
        <div className="animate-in zoom-in duration-300 bg-white text-black p-8 rounded-[3.5rem] text-center shadow-2xl border-t-8 border-orange-600 flex flex-col items-center mt-6">
          <div className="border border-orange-500 bg-black p-2 px-4 rounded-sm shadow-[0_0_15px_rgba(234,88,12,0.4)] animate-pulse mb-6 text-orange-500 font-mono text-xs tracking-widest uppercase">>> MISSION ACCOMPLISHED</div>
          <p className="text-3xl font-mono font-black mb-6">{shipment.tracking}</p>
          <button onClick={() => window.location.href=`https://www.flashexpress.co.th/tracking/?trackNo=${shipment.tracking}`} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase">FOLLOW ORDER 🚚</button>
        </div>
      )}
    </div>
  );
};

// --- [ ส่วนประกอบหลังบ้าน (Admin Page) ] ---
const AdminView = ({ onUpload, onExit }) => (
  <div className="animate-in slide-in-from-bottom duration-500 w-full max-w-sm">
    <div className="p-12 border-4 border-dashed border-orange-500 rounded-[3rem] text-center bg-zinc-900 shadow-2xl" onDrop={(e) => { e.preventDefault(); onUpload(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()}>
      <div className="text-6xl mb-4 animate-bounce">📦</div>
      <p className="text-orange-400 font-bold uppercase tracking-widest mb-4">Master Drakside Only</p>
      <p className="text-[11px] text-zinc-500 font-bold mb-8">ลากไฟล์ Flash มาวางเพื่ออัปเดตระบบ</p>
      <button onClick={onExit} className="text-[10px] text-zinc-600 underline uppercase tracking-widest hover:text-orange-400 transition-colors">กลับหน้าหลักลูกค้า</button>
    </div>
  </div>
);

// --- [ ส่วนหลัก (Main App) ] ---
export default function SingtoStore() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [mockData, setMockData] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem('singto_data');
    if (savedData) setMockData(JSON.parse(savedData));
  }, []);

  const handleAdminAuth = () => {
    if (!isAdminMode) {
      const pass = prompt("ระบบความปลอดภัยสูง (Drakside Only):");
      if (pass === "168") setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
    }
  };

  const onUpload = (file) => {
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
          if (customerPhone && tracking) { newData[customerPhone] = { tracking }; count++; }
        }
      });
      localStorage.setItem('singto_data', JSON.stringify(newData));
      setMockData(newData);
      alert(`✅ อัปเดต ${count} บ้าน เรียบร้อย!`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center p-6 relative overflow-hidden border-4 border-orange-600/50 rounded-[3.5rem] shadow-[0_0_60px_rgba(234,88,12,0.3)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600 rounded-full opacity-10 blur-[150px] pointer-events-none"></div>
      
      {/* 🔐 ทางลับ: Double Click ที่ชื่อร้านเพื่อสลับหน้า */}
      <div className="mt-16 mb-12 text-center relative z-10 select-none cursor-pointer" onDoubleClick={handleAdminAuth}>
        <h1 className="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-600 animate-pulse-glow uppercase leading-none">
          {isAdminMode ? "ADMIN PANEL" : "SINGTO STORE"}
        </h1>
        <p className="text-[12px] text-orange-400 uppercase tracking-[0.6em] mt-4 font-bold italic text-center w-full">
          {isAdminMode ? "SECURE BACKEND" : "VIP TRACKING SYSTEM"}
        </p>
      </div>

      {isAdminMode ? (
        <AdminView onUpload={onUpload} onExit={() => setIsAdminMode(false)} />
      ) : (
        <CustomerView mockData={mockData} />
      )}

      <p className="mt-auto py-10 text-[9px] text-zinc-800 font-bold tracking-[0.5em] uppercase italic relative z-10 text-center">SINGTO STORE SOLAR TECHNOLOGY</p>
      
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(251,191,36,0.6); }
          50% { text-shadow: 0 0 25px rgba(249,115,22,0.8); }
        }
        .animate-pulse-glow { animation: pulse-glow 3s infinite; }
      `}</style>
    </div>
  );
}
