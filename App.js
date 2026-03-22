import React, { useState, useEffect } from 'react';

export default function SingtoStore() {
  const [phone, setPhone] = useState('');
  const [shipment, setShipment] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [mockData, setMockData] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem('singto_data');
    if (savedData) {
      try { setMockData(JSON.parse(savedData)); } catch (e) { setMockData({}); }
    }
  }, []);

  const handleAdminAuth = () => {
    if (!isAdminMode) {
      const pass = prompt("ระบบความปลอดภัยสูง (Drakside Only):");
      if (pass === "168") setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
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
          if (customerPhone && tracking) {
            newData[customerPhone] = { tracking };
            count++;
          }
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
      
      <div className="mt-20 mb-12 text-center relative z-10 select-none cursor-pointer" onDoubleClick={handleAdminAuth}>
        <h1 className="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-600 animate-pulse-glow leading-none uppercase">
          {isAdminMode ? "ADMIN PANEL" : "SINGTO STORE"}
        </h1>
        <p className="text-[12px] text-orange-400 uppercase tracking-[0.6em] mt-4 font-bold italic">
          {isAdminMode ? "SECURE BACKEND" : "VIP TRACKING SYSTEM"}
        </p>
      </div>

      <div className="flex-grow flex items-center justify-center w-full relative z-10">
        {isAdminMode ? (
          <div className="w-full max-w-sm p-12 border-4 border-dashed border-orange-
