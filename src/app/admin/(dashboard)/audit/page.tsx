import { getDb } from "@/lib/store";
import { ClipboardList, Shield, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminAuditLogPage() {
  const db = getDb();
  const logs = db.auditLogs || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="pb-4 border-b border-neutral-200">
        <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Editorial Audit Log</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Immutable history of all content mutations, publishing actions, and role modifications.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs font-semibold text-neutral-600">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#B80000]" />
            <span>Total Recorded Events: {logs.length}</span>
          </div>
          <span className="font-mono text-neutral-400">Timestamp: UTC</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No audit logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100/70 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4 w-28">Action</th>
                  <th className="py-3 px-4 w-28">Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 w-36">User</th>
                  <th className="py-3 px-4 w-40 text-right">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          log.action === "PUBLISH"
                            ? "bg-emerald-100 text-emerald-800"
                            : log.action === "DELETE"
                            ? "bg-red-100 text-red-800"
                            : log.action === "UPDATE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-700">
                      {log.entity}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-800">
                      {log.details || <span className="text-neutral-400">&mdash;</span>}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-600">
                      {log.userName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
