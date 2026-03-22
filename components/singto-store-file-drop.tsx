"use client";

import React, { useState } from 'react';

interface ShipmentData {
  tracking: string;
  status: string;
}

interface MockDataType {
  [key: string]: ShipmentData;
}

const StatusBadge = ({ status }: { status: string }) => (
  <div className="border border-orange-500 bg-black p-2 px-4 rounded-sm shadow-[0_0_15px_rgba(234,88,12,0.4)] animate-pulse mb-6 text-center">
    <span className="text-orange-500 font-mono tracking-widest uppercase text-sm">
      {status === 'รับพัสดุแล้ว' ? '>> MISSION ACCOMPLISHED' : '>> SCANNING SECTOR...'}
    </span>
  </div>
);

const SingtoStoreFileDrop = () => {
  const [phone, setPhone] = useState('');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [mockData, setMockData] = useState<MockDataType>({});

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
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
          if (customerPhone && tracking && tracking.startsWith('TH')) {
            newData[customerPhone] = { tracking, status };
            count++;
          }
        }
      });
      setMockData(newData);
      alert(`SINGTO STORE: อัปเดตข้อมูล ${count} บ้าน เรียบร้อย!`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center p-6 relative overflow-hidden border-4 border-orange-600/50 rounded-[3.5rem] shadow-[0_0_60px_rgba(234,88,12,0.3)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600 rounded-full opacity-10 blur-[150px] pointer-events-none"></div>
      
      {/* 1. Store Name at Top */}
      <div className="mt-16 mb-12 text-center relative z-10">
        <h1 className="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-600 animate-pulse-glow uppercase">SINGTO STORE</h1>
        <p className="text-[12px] text-orange-400 uppercase tracking-[0.6em] mt-4 font-bold italic">VIP TRACKING SYSTEM</p>
      </div>

      <div className="w-full max-w-sm space-y-6 relative z-10 flex-grow">
        {/* 2. Search Section */}
        <div className="bg-zinc-900/95 p-7 rounded-[2.5rem] border border-orange-500/20 backdrop-blur-xl">
          <input 
            type="tel" 
            placeholder="กรอกเบอร์โทร..." 
            className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-center text-3xl text-white outline-none focus:border-yellow-400" 
            onChange={(e) => setPhone(e.target.value.replace(/-/g, ''))} 
          />
          <button 
            onClick={() => setShipment(mockData[phone] || null)} 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-6 rounded-3xl text-2xl mt-5 shadow-lg uppercase"
          >
            ค้นหาสถานะ VIP
          </button>
        </div>

        {/* 3. Contact Admin Button */}
        <button 
          onClick={() => window.location.href = `https://line.me/ti/p/@singoto-store`} 
          className="w-full bg-[#06C755] text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 border-b-4 border-green-800 shadow-lg"
        >
          <span>ติดต่อแอดมิน (LINE)</span>
        </button>

        {shipment && (
          <div className="animate-in zoom-in duration-300 bg-white text-black p-8 rounded-[3.5rem] text-center shadow-2xl border-t-8 border-orange-600 flex flex-col items-center">
            <StatusBadge status={shipment.status} />
            <p className="text-3xl font-mono font-black tracking-tighter mb-6">{shipment.tracking}</p>
            <button 
              onClick={() => window.location.href = `https://www.flashexpress.co.th/tracking/?trackNo=${shipment.tracking}`} 
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase"
            >
              FOLLOW ORDER
            </button>
          </div>
        )}

        {/* 4. Admin Drop Zone (Hidden at bottom) */}
        {adminMode && (
          <div 
            className="mt-6 p-10 border-4 border-dashed border-zinc-800 rounded-[2.5rem] text-center bg-black/40 hover:border-orange-500 transition-all cursor-pointer" 
            onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files[0]); }} 
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="text-4xl mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400 mx-auto">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
              </svg>
            </div>
            <p className="text-[10px] text-zinc-400 uppercase font-bold">โยนไฟล์ Flash ของ SINGTO ตรงนี้</p>
          </div>
        )}
      </div>

      {/* Footer (Double Click to open Admin) */}
      <p 
        className="mt-auto py-10 text-[9px] text-zinc-800 font-bold tracking-[0.5em] uppercase italic cursor-pointer select-none" 
        onDoubleClick={() => setAdminMode(!adminMode)}
      >
        SINGTO STORE SOLAR TECHNOLOGY
      </p>
      
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(251,191,36,0.6); }
          50% { text-shadow: 0 0 25px rgba(249,115,22,0.8); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default SingtoStoreFileDrop;
