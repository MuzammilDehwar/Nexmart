import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  Layers, 
  Copy, 
  Check, 
  Calculator, 
  Cpu, 
  HardDrive,
  Activity,
  ArrowRight
} from 'lucide-react';
import { DATABASE_SCHEMAS } from '../data/blueprintData';

export const SchemaErdViewer: React.FC = () => {
  const [selectedStorage, setSelectedStorage] = useState<'ALL' | 'PostgreSQL' | 'MongoDB' | 'Redis'>('ALL');
  const [copiedTable, setCopiedTable] = useState<string | null>(null);

  // Scaling calculator inputs
  const [dailyActiveUsers, setDailyActiveUsers] = useState(250000);
  const [ordersPerDay, setOrdersPerDay] = useState(15000);
  const [totalCatalogSkus, setTotalCatalogSkus] = useState(500000);

  // Scaling math
  const peakQps = Math.round((dailyActiveUsers * 12) / 3600); // 12 interactions per user/hr peak
  const redisMemoryGb = Math.round(((dailyActiveUsers * 0.05 * 4) + (totalCatalogSkus * 0.002)) * 10) / 10; // active carts + catalog cache
  const dbIopsRequired = Math.round((peakQps * 0.35) + (ordersPerDay / 10));
  const kafkaPartitions = Math.max(8, Math.round(peakQps / 400));
  const estimatedAwsMonthly = Math.round(
    (peakQps * 0.85) + (redisMemoryGb * 18) + (totalCatalogSkus * 0.001) + 450
  );

  const filteredSchemas = selectedStorage === 'ALL'
    ? DATABASE_SCHEMAS
    : DATABASE_SCHEMAS.filter(s => s.storage === selectedStorage);

  const handleCopySql = (table: typeof DATABASE_SCHEMAS[0]) => {
    let ddl = '';
    if (table.storage === 'PostgreSQL') {
      ddl = `CREATE TABLE ${table.name} (\n` +
        table.fields.map(f => `  ${f.name.padEnd(20)} ${f.type.padEnd(16)} ${f.constraints || ''}`).join(',\n') +
        `\n);`;
    } else {
      ddl = `// MongoDB Collection: ${table.name}\ndb.createCollection("${table.name}", {\n  validator: {\n    $jsonSchema: {\n      bsonType: "object",\n      properties: {\n` +
        table.fields.map(f => `        ${f.name}: { bsonType: "${f.type.toLowerCase()}", description: "${f.description}" }`).join(',\n') +
        `\n      }\n    }\n  }\n});`;
    }
    navigator.clipboard.writeText(ddl);
    setCopiedTable(table.name);
    setTimeout(() => setCopiedTable(null), 2000);
  };

  return (
    <div className="space-y-12 pb-16 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 pt-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Database Schema & Scale Engineering</span>
            <span aria-hidden="true">·</span>
            <span>Polyglot Relational + Document Architecture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
            Data Architecture & Capacity Planner
          </h1>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {['ALL', 'PostgreSQL', 'MongoDB'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedStorage(tab as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedStorage === tab
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All Entities' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Scaling Calculator Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-900" />
            <h3 className="font-bold text-slate-900 text-sm">Real-Time Infrastructure Capacity & Cost Calculator</h3>
          </div>
          <span className="text-xs font-mono-code text-slate-500">Sub-50ms SLA Model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>Daily Active Users (DAU)</span>
              <span className="font-mono-code tabular-nums text-slate-900 font-bold">{dailyActiveUsers.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={dailyActiveUsers}
              onChange={(e) => setDailyActiveUsers(parseInt(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>Completed Orders / Day</span>
              <span className="font-mono-code tabular-nums text-slate-900 font-bold">{ordersPerDay.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={ordersPerDay}
              onChange={(e) => setOrdersPerDay(parseInt(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>Total Catalog SKUs (MongoDB)</span>
              <span className="font-mono-code tabular-nums text-slate-900 font-bold">{totalCatalogSkus.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="5000"
              max="5000000"
              step="10000"
              value={totalCatalogSkus}
              onChange={(e) => setTotalCatalogSkus(parseInt(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Computed Hardware Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">PEAK LOAD QPS</div>
            <div className="text-lg font-bold font-mono-code text-slate-900 tabular-nums mt-0.5">
              {peakQps.toLocaleString()} RPS
            </div>
            <div className="text-[10px] text-slate-500">Load balanced via Envoy</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">POSTGRES IOPS</div>
            <div className="text-lg font-bold font-mono-code text-slate-900 tabular-nums mt-0.5">
              {dbIopsRequired.toLocaleString()} IOPS
            </div>
            <div className="text-[10px] text-slate-500">Aurora 1 Writer + 3 Replicas</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">REDIS RAM CLUSTER</div>
            <div className="text-lg font-bold font-mono-code text-emerald-700 tabular-nums mt-0.5">
              {redisMemoryGb} GB
            </div>
            <div className="text-[10px] text-slate-500">Carts & Stock Locks</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">KAFKA PARTITIONS</div>
            <div className="text-lg font-bold font-mono-code text-purple-700 tabular-nums mt-0.5">
              {kafkaPartitions} Partitions
            </div>
            <div className="text-[10px] text-slate-500">Zero consumer lag guarantee</div>
          </div>

          <div className="bg-slate-900 text-white p-3.5 rounded-lg col-span-2 md:col-span-1">
            <div className="text-[11px] text-slate-400 font-medium">EST. CLOUD COST</div>
            <div className="text-lg font-bold font-mono-code text-emerald-400 tabular-nums mt-0.5">
              ${estimatedAwsMonthly.toLocaleString()}/mo
            </div>
            <div className="text-[10px] text-slate-400">AWS EKS / CloudFront / Aurora</div>
          </div>
        </div>
      </section>

      {/* Schema Entity Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-slate-900">
            Core Schema Definitions & Field Specifications
          </h2>
          <span className="text-xs text-slate-500">
            Showing {filteredSchemas.length} entities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemas.map((table) => (
            <div
              key={table.name}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-700" />
                    <span className="font-bold text-slate-900 font-mono-code text-xs">
                      {table.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      table.storage === 'PostgreSQL'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {table.storage}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopySql(table)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                  >
                    {copiedTable === table.name ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy DDL</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 text-xs text-slate-600 border-b border-slate-100">
                  {table.description}
                </div>

                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-code">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                        <th className="pb-2 font-medium">FIELD</th>
                        <th className="pb-2 font-medium">TYPE</th>
                        <th className="pb-2 font-medium">CONSTRAINTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {table.fields.map((f) => (
                        <tr key={f.name} className="hover:bg-slate-50/50">
                          <td className="py-2 text-slate-900 font-bold">{f.name}</td>
                          <td className="py-2 text-purple-700">{f.type}</td>
                          <td className="py-2 text-slate-500 text-[11px]">{f.constraints || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500">
                Optimized for index-only scans and distributed sharding keys.
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
