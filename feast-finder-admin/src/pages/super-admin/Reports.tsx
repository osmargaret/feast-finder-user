import React from "react";
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  PieChart, 
  BarChart4, 
  Clock,
  CheckCircle,
  FileSpreadsheet,
  FileJson,
  ArrowRight
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_REPORTS = [
  { id: "REP-201", name: "Monthly Financial Reconciliation", type: "Financial", date: "June 2026", status: "Generated", format: "PDF/CSV" },
  { id: "REP-202", name: "Vendor Performance Audit", type: "Operational", date: "Q2 2026", status: "Generated", format: "PDF" },
  { id: "REP-203", name: "User Growth & Retention", type: "Marketing", date: "May 2026", status: "Archived", format: "CSV" },
  { id: "REP-204", name: "Compliance & KYC Audit", type: "Legal", date: "2026 Annual", status: "Pending", format: "N/A" },
];

const Reports = () => {
  return (
    <div className="space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white text-glow flex items-center gap-4">
            <FileText className="text-primary" size={36} />
            Data Export Center
          </h2>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Generate and download high-fidelity reports for platform stakeholders.</p>
        </div>
        <button className="h-14 px-10 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-3">
          <FileSpreadsheet size={18} /> Generate Custom Report
        </button>
      </header>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportTypeCard title="Financial" icon={PieChart} count="12" color="text-primary" />
        <ReportTypeCard title="Operational" icon={BarChart4} count="8" color="text-primary" />
        <ReportTypeCard title="Marketing" icon={Calendar} count="15" color="text-emerald-500" />
        <ReportTypeCard title="Compliance" icon={CheckCircle} count="4" color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Reports */}
        <div className="lg:col-span-2 glass-card rounded-[3rem] overflow-hidden border border-white/5">
           <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Generated Document Registry</h3>
              <div className="flex gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
                    <input type="text" placeholder="Search reports..." className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-[10px] outline-none focus:border-primary w-40 text-white" />
                 </div>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.01] text-[9px] uppercase font-black tracking-widest text-muted-foreground border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5">Document Name</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Date Range</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_REPORTS.map((rep) => (
                    <tr key={rep.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <FileText size={16} className="text-primary" />
                           <div>
                              <p className="text-xs font-black text-white">{rep.name}</p>
                              <p className="text-[9px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">{rep.id} • {rep.format}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-muted-foreground uppercase">{rep.type}</td>
                      <td className="px-8 py-6 text-[10px] font-bold text-white uppercase">{rep.date}</td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter",
                          rep.status === "Generated" ? "bg-emerald-500/10 text-emerald-500" :
                          rep.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                          "bg-white/5 text-muted-foreground"
                        )}>
                          {rep.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
                            <Download size={14} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Quick Export Panel */}
        <div className="glass-card p-10 rounded-[3rem] space-y-8">
           <h3 className="font-black text-lg tracking-tight uppercase text-white">Scheduled Sync</h3>
           <div className="space-y-6">
              <ScheduledItem title="Weekly Sales Digest" time="Every Sunday, 11PM" active={true} />
              <ScheduledItem title="Monthly Tax Record" time="1st of Month, 2AM" active={true} />
              <ScheduledItem title="Vendor Growth Audit" time="Quarterly" active={false} />
           </div>
           <div className="pt-8 border-t border-white/5">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Export Format</p>
              <div className="flex gap-2">
                 <button className="flex-1 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase text-white hover:border-primary transition-all">PDF</button>
                 <button className="flex-1 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase text-white hover:border-primary transition-all">CSV</button>
                 <button className="flex-1 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase text-white hover:border-primary transition-all">JSON</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ReportTypeCard = ({ title, icon: Icon, count, color }: any) => (
  <div className="glass-card glass-card-hover p-6 rounded-[2.5rem] flex flex-col items-center text-center gap-4 group">
     <div className={cn("w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform", color)}>
        <Icon size={24} />
     </div>
     <div>
        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{title}</h4>
        <p className="text-[10px] text-muted-foreground font-medium mt-1">{count} Available Reports</p>
     </div>
  </div>
);

const ScheduledItem = ({ title, time, active }: any) => (
  <div className="flex items-center justify-between group cursor-pointer">
     <div className="flex items-center gap-4">
        <div className={cn("w-2 h-2 rounded-full", active ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-white/10")} />
        <div>
           <p className="text-[11px] font-black text-white uppercase tracking-wider">{title}</p>
           <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{time}</p>
        </div>
     </div>
     <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
  </div>
);

export default Reports;
