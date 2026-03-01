import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const CLIENTES_INIT = [
  { id: 1, nombre: "Ana García", email: "ana@gmail.com", telefono: "555-1234", segmento: "VIP", compras: 12, valor: 8400, ultima: "2026-02-20", estado: "Activo" },
  { id: 2, nombre: "Carlos Mendoza", email: "carlos@hotmail.com", telefono: "555-2345", segmento: "Regular", compras: 4, valor: 1200, ultima: "2026-02-10", estado: "Activo" },
  { id: 3, nombre: "Sofía Ruiz", email: "sofia@gmail.com", telefono: "555-3456", segmento: "Nuevo", compras: 1, valor: 350, ultima: "2026-02-25", estado: "Activo" },
  { id: 4, nombre: "Miguel Torres", email: "miguel@empresa.mx", telefono: "555-4567", segmento: "VIP", compras: 24, valor: 21500, ultima: "2026-02-18", estado: "Activo" },
  { id: 5, nombre: "Laura Díaz", email: "laura@gmail.com", telefono: "555-5678", segmento: "Regular", compras: 7, valor: 2800, ultima: "2026-01-30", estado: "Inactivo" },
  { id: 6, nombre: "Roberto Jiménez", email: "rjimenez@corp.mx", telefono: "555-6789", segmento: "Regular", compras: 3, valor: 950, ultima: "2026-02-05", estado: "Activo" },
];

const PIPELINE_INIT = [
  { id: 1, cliente: "Pedro Salinas", producto: "Laptop Pro 15", valor: 18500, etapa: "Contacto", prob: 20, vendedor: "María L.", fecha: "2026-02-26" },
  { id: 2, cliente: "Empresa ABC", producto: "Pack Oficina x10", valor: 42000, etapa: "Propuesta", prob: 50, vendedor: "Juan R.", fecha: "2026-02-24" },
  { id: 3, cliente: "Claudia Vera", producto: "Smart TV 55\"", valor: 12800, etapa: "Negociación", prob: 75, vendedor: "María L.", fecha: "2026-02-22" },
  { id: 4, cliente: "Tech Solutions", producto: "Servidores x3", valor: 95000, etapa: "Propuesta", prob: 40, vendedor: "Carlos A.", fecha: "2026-02-20" },
  { id: 5, cliente: "Mario Hernández", producto: "Celular Galaxy S25", valor: 8900, etapa: "Negociación", prob: 80, vendedor: "Juan R.", fecha: "2026-02-27" },
  { id: 6, cliente: "Distribuidora Norte", producto: "Electrodomésticos x5", valor: 28000, etapa: "Ganado", prob: 100, vendedor: "Carlos A.", fecha: "2026-02-15" },
  { id: 7, cliente: "Ana Robles", producto: "Refrigerador DoubleDoor", valor: 15600, etapa: "Contacto", prob: 15, vendedor: "María L.", fecha: "2026-02-28" },
  { id: 8, cliente: "ImportMax", producto: "Aires acondicionados x8", valor: 64000, etapa: "Ganado", prob: 100, vendedor: "Juan R.", fecha: "2026-02-12" },
];

const PEDIDOS_INIT = [
  { id: "PED-001", cliente: "Ana García", producto: "iPhone 15 Pro", cantidad: 1, precio: 24500, estado: "Entregado", fecha: "2026-02-20" },
  { id: "PED-002", cliente: "Miguel Torres", producto: "MacBook Air M3", cantidad: 2, precio: 35000, estado: "En tránsito", fecha: "2026-02-25" },
  { id: "PED-003", cliente: "Carlos Mendoza", producto: "AirPods Pro", cantidad: 1, precio: 4200, estado: "Procesando", fecha: "2026-02-27" },
  { id: "PED-004", cliente: "Sofía Ruiz", producto: "Smart Watch Ultra", cantidad: 1, precio: 9800, estado: "Pendiente", fecha: "2026-02-28" },
  { id: "PED-005", cliente: "Empresa ABC", producto: "Monitor 4K x3", cantidad: 3, precio: 18900, estado: "Entregado", fecha: "2026-02-18" },
];

const MENSAJES_INIT = [
  { id: 1, cliente: "Ana García", canal: "WhatsApp", mensaje: "Hola, ¿tienen el iPhone 16 en color negro?", hora: "10:23", leido: false, avatar: "AG" },
  { id: 2, cliente: "Usuario Web", canal: "Chat Web", mensaje: "¿Cuál es el tiempo de entrega para CDMX?", hora: "10:45", leido: false, avatar: "UW" },
  { id: 3, cliente: "Carlos M.", canal: "Instagram", mensaje: "Vi el post del Samsung, ¿hay en meses sin intereses?", hora: "11:02", leido: true, avatar: "CM" },
  { id: 4, cliente: "Laura Díaz", canal: "WhatsApp", mensaje: "Mi pedido PED-002 no ha llegado", hora: "11:30", leido: false, avatar: "LD" },
];

const VENTAS_MES = [
  { mes: "Sep", ventas: 185000, meta: 200000 },
  { mes: "Oct", ventas: 212000, meta: 200000 },
  { mes: "Nov", ventas: 198000, meta: 210000 },
  { mes: "Dic", ventas: 340000, meta: 300000 },
  { mes: "Ene", ventas: 156000, meta: 180000 },
  { mes: "Feb", ventas: 224000, meta: 220000 },
];

const PRODUCTOS_TOP = [
  { nombre: "iPhone 15 Pro", ventas: 48, ingreso: 1176000, stock: 12 },
  { nombre: "MacBook Air M3", ventas: 31, ingreso: 1085000, stock: 5 },
  { nombre: "Samsung Galaxy S25", ventas: 67, ingreso: 596300, stock: 23 },
  { nombre: "AirPods Pro", ventas: 112, ingreso: 470400, stock: 45 },
  { nombre: 'Smart TV 55"', ventas: 29, ingreso: 371200, stock: 8 },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0b0f1a; --surface:#131929; --card:#1a2235; --border:#232d42;
    --text:#e8edf5; --muted:#6b7a99; --accent:#3b82f6; --accent2:#f97316;
    --green:#22c55e; --red:#ef4444; --yellow:#f59e0b; --purple:#a78bfa;
    --font:'Plus Jakarta Sans',sans-serif; --mono:'JetBrains Mono',monospace;
  }
  body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:var(--surface)}
  ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
  button{cursor:pointer;font-family:var(--font)}
  input,select,textarea{font-family:var(--font)}
`;

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
const fmtK = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

const ETAPAS = ["Contacto", "Propuesta", "Negociación", "Ganado", "Perdido"];
const ETAPA_COLORS = { Contacto: "#3b82f6", Propuesta: "#f59e0b", Negociación: "#a78bfa", Ganado: "#22c55e", Perdido: "#ef4444" };
const CANAL_COLORS = { WhatsApp: "#25d366", "Chat Web": "#3b82f6", Instagram: "#e1306c", Facebook: "#1877f2" };
const ESTADO_COLORS = { Entregado: "#22c55e", "En tránsito": "#3b82f6", Procesando: "#f59e0b", Pendiente: "#6b7a99" };
const SEG_COLORS = { VIP: "#f59e0b", Regular: "#3b82f6", Nuevo: "#22c55e" };

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ label, color }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>{label}</span>
);

const StatCard = ({ label, value, sub, color = "#3b82f6", icon }) => (
  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "14px 14px 0 0" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4, fontFamily: "var(--mono)" }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 28, opacity: 0.15 }}>{icon}</div>
    </div>
  </div>
);

const MiniBar = ({ value, max, color }) => (
  <div style={{ background: "var(--border)", borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s" }} />
  </div>
);

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard() {
  const totalVentas = VENTAS_MES.reduce((s, m) => s + m.ventas, 0);
  const maxVenta = Math.max(...VENTAS_MES.map(m => Math.max(m.ventas, m.meta)));
  const mesActual = VENTAS_MES[VENTAS_MES.length - 1];
  const pctMeta = Math.round((mesActual.ventas / mesActual.meta) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatCard label="Ventas Feb" value={fmtK(mesActual.ventas)} sub={`Meta: ${fmtK(mesActual.meta)} · ${pctMeta}%`} color="#3b82f6" icon="💰" />
        <StatCard label="Conversión" value="38.4%" sub="↑ 60% vs mes ant." color="#22c55e" icon="🎯" />
        <StatCard label="CSAT" value="4.3/5" sub="↑ 34% mejora" color="#f59e0b" icon="⭐" />
        <StatCard label="Pedidos activos" value="18" sub="3 requieren atención" color="#a78bfa" icon="📦" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        {/* Gráfica de ventas */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Ventas vs. Meta</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Últimos 6 meses</div>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#3b82f6", display: "inline-block" }} />Ventas</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 3, background: "#f59e0b", display: "inline-block" }} />Meta</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
            {VENTAS_MES.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 3 }}>
                  <div style={{ position: "relative", width: "100%" }}>
                    <div title={`Meta: ${fmtK(m.meta)}`} style={{ width: "100%", height: 3, background: "#f59e0b44", borderRadius: 2, position: "absolute", bottom: `${(m.meta / maxVenta) * 130}px` }} />
                    <div title={fmtK(m.ventas)} style={{ width: "100%", height: `${(m.ventas / maxVenta) * 130}px`, background: m.ventas >= m.meta ? "linear-gradient(180deg,#22c55e,#16a34a)" : "linear-gradient(180deg,#3b82f6,#1d4ed8)", borderRadius: "4px 4px 0 0", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = 0.8} onMouseLeave={e => e.target.style.opacity = 1} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{m.mes}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos top */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Top Productos</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>Por ingresos generados</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PRODUCTOS_TOP.map((p, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{p.nombre}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>{fmtK(p.ingreso)}</span>
                </div>
                <MiniBar value={p.ingreso} max={PRODUCTOS_TOP[0].ingreso} color={["#3b82f6","#22c55e","#f59e0b","#a78bfa","#f97316"][i]} />
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>{p.ventas} unidades · Stock: {p.stock}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline resumen + alertas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Pipeline de Ventas</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>Distribución por etapa</div>
          {ETAPAS.slice(0, 4).map(etapa => {
            const items = PIPELINE_INIT.filter(p => p.etapa === etapa);
            const total = items.reduce((s, p) => s + p.valor, 0);
            return (
              <div key={etapa} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: ETAPA_COLORS[etapa], display: "inline-block" }} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{etapa}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>({items.length})</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>{fmtK(total)}</span>
                </div>
                <MiniBar value={total} max={200000} color={ETAPA_COLORS[etapa]} />
              </div>
            );
          })}
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Alertas y Tareas</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>Requieren atención hoy</div>
          {[
            { icon: "💬", msg: "4 mensajes sin responder en chat", urgencia: "Alta", color: "#ef4444" },
            { icon: "📦", msg: "Pedido PED-002 retrasado 2 días", urgencia: "Alta", color: "#ef4444" },
            { icon: "🎯", msg: "5 oportunidades sin actividad >3 días", urgencia: "Media", color: "#f59e0b" },
            { icon: "📊", msg: "Stock bajo: MacBook Air M3 (5 unid.)", urgencia: "Media", color: "#f59e0b" },
            { icon: "⭐", msg: "3 encuestas CSAT pendientes de revisión", urgencia: "Baja", color: "#6b7a99" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <span style={{ flex: 1, fontSize: 12 }}>{a.msg}</span>
              <Badge label={a.urgencia} color={a.color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CRM ─────────────────────────────────────────────────────────────────────
function CRM() {
  const [clientes, setClientes] = useState(CLIENTES_INIT);
  const [busqueda, setBusqueda] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", segmento: "Nuevo" });

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const guardar = () => {
    if (!form.nombre || !form.email) return;
    setClientes(prev => [...prev, { id: Date.now(), ...form, compras: 0, valor: 0, ultima: new Date().toISOString().split("T")[0], estado: "Activo" }]);
    setForm({ nombre: "", email: "", telefono: "", segmento: "Nuevo" });
    setShowForm(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16 }}>
      <div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Clientes</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{filtrados.length} registros encontrados</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar cliente..." style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", color: "var(--text)", fontSize: 13, width: 220 }} />
            <button onClick={() => setShowForm(!showForm)} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 13 }}>+ Nuevo cliente</button>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: 10, alignItems: "end" }}>
            {[["Nombre", "nombre"], ["Email", "email"], ["Teléfono", "telefono"]].map(([ph, key]) => (
              <div key={key}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 5, fontWeight: 600 }}>{ph}</div>
                <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7, padding: "8px 12px", color: "var(--text)", fontSize: 13 }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 5, fontWeight: 600 }}>Segmento</div>
              <select value={form.segmento} onChange={e => setForm(p => ({ ...p, segmento: e.target.value }))} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7, padding: "8px 12px", color: "var(--text)", fontSize: 13 }}>
                {["Nuevo", "Regular", "VIP"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={guardar} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontWeight: 600, fontSize: 13 }}>Guardar</button>
          </div>
        )}

        {/* Tabla */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Cliente", "Segmento", "Compras", "Valor total", "Última compra", "Estado", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c, i) => (
                <tr key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", background: selected?.id === c.id ? "rgba(59,130,246,0.08)" : "transparent", transition: "background 0.15s" }} onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = "rgba(255,255,255,0.02)" }} onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = "transparent" }}>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${SEG_COLORS[c.segmento]}22`, border: `2px solid ${SEG_COLORS[c.segmento]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: SEG_COLORS[c.segmento] }}>
                        {c.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nombre}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}><Badge label={c.segmento} color={SEG_COLORS[c.segmento]} /></td>
                  <td style={{ padding: "13px 16px", fontFamily: "var(--mono)", fontSize: 13 }}>{c.compras}</td>
                  <td style={{ padding: "13px 16px", fontFamily: "var(--mono)", fontSize: 13, color: "#22c55e" }}>{fmt(c.valor)}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "var(--muted)" }}>{c.ultima}</td>
                  <td style={{ padding: "13px 16px" }}><Badge label={c.estado} color={c.estado === "Activo" ? "#22c55e" : "#6b7a99"} /></td>
                  <td style={{ padding: "13px 16px", fontSize: 16, color: "var(--muted)" }}>›</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel detalle */}
      {selected && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, height: "fit-content" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Perfil del cliente</div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 18 }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${SEG_COLORS[selected.segmento]}22`, border: `3px solid ${SEG_COLORS[selected.segmento]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: SEG_COLORS[selected.segmento], marginBottom: 12 }}>
              {selected.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.nombre}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{selected.email}</div>
            <div style={{ marginTop: 8 }}><Badge label={selected.segmento} color={SEG_COLORS[selected.segmento]} /></div>
          </div>
          {[["📞 Teléfono", selected.telefono], ["🛒 Compras totales", selected.compras], ["💰 Valor total", fmt(selected.valor)], ["📅 Última compra", selected.ultima], ["🟢 Estado", selected.estado]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button style={{ flex: 1, background: "#3b82f6", border: "none", borderRadius: 8, padding: "10px", color: "#fff", fontWeight: 600, fontSize: 12 }}>✉ Enviar email</button>
            <button style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px", color: "var(--text)", fontWeight: 600, fontSize: 12 }}>📋 Ver pedidos</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PIPELINE ────────────────────────────────────────────────────────────────
function Pipeline() {
  const [opps, setOpps] = useState(PIPELINE_INIT);
  const [drag, setDrag] = useState(null);

  const mover = (id, nuevaEtapa) => {
    setOpps(prev => prev.map(o => o.id === id ? { ...o, etapa: nuevaEtapa } : o));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {ETAPAS.slice(0, 4).map(etapa => {
          const items = opps.filter(o => o.etapa === etapa);
          const total = items.reduce((s, o) => s + o.valor, 0);
          return (
            <div key={etapa} style={{ flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", borderTop: `3px solid ${ETAPA_COLORS[etapa]}` }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: ETAPA_COLORS[etapa] }}>{etapa.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 700, marginTop: 4 }}>{fmtK(total)}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{items.length} oportunidades</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, alignItems: "start" }}>
        {ETAPAS.slice(0, 4).map(etapa => (
          <div key={etapa} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (drag) mover(drag, etapa); setDrag(null); }} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 12, minHeight: 200 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: ETAPA_COLORS[etapa], marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span>{etapa}</span>
              <span style={{ background: ETAPA_COLORS[etapa] + "22", borderRadius: 10, padding: "1px 8px" }}>{opps.filter(o => o.etapa === etapa).length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {opps.filter(o => o.etapa === etapa).map(opp => (
                <div key={opp.id} draggable onDragStart={() => setDrag(opp.id)} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px", cursor: "grab", transition: "transform 0.15s, box-shadow 0.15s", position: "relative" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{opp.cliente}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>{opp.producto}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: "#22c55e" }}>{fmtK(opp.valor)}</span>
                    <span style={{ fontSize: 10, color: "var(--muted)", background: "var(--surface)", borderRadius: 4, padding: "2px 6px" }}>{opp.prob}%</span>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ background: "var(--border)", borderRadius: 3, height: 4, overflow: "hidden" }}>
                      <div style={{ width: `${opp.prob}%`, height: "100%", background: ETAPA_COLORS[etapa], transition: "width 0.5s" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span>👤 {opp.vendedor}</span>
                    <span>{opp.fecha}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 12, textAlign: "center" }}>💡 Arrastra las tarjetas entre columnas para actualizar la etapa</div>
    </div>
  );
}

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
function Chatbot() {
  const [mensajes, setMensajes] = useState(MENSAJES_INIT);
  const [selChat, setSelChat] = useState(mensajes[0]);
  const [conv, setConv] = useState([
    { from: "cliente", text: "Hola, ¿tienen el iPhone 16 en color negro?", time: "10:23" },
    { from: "bot", text: "¡Hola Ana! 👋 Sí, el iPhone 16 en color negro está disponible en nuestra tienda. Tenemos el modelo base (128GB) y Pro (256GB). ¿Cuál te interesa?", time: "10:23" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conv]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput("");
    setConv(p => [...p, { from: "agente", text: txt, time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Eres un asistente de atención al cliente de una tienda retail de electrónica y artículos del hogar en México. Responde de forma amable, concisa y en español. Puedes ayudar con información de productos, precios estimados, disponibilidad, tiempos de entrega y posventa. Usa emojis con moderación.",
          messages: [
            ...conv.filter(m => m.from !== "bot").map(m => ({ role: m.from === "agente" ? "assistant" : "user", content: m.text })),
            { role: "assistant", content: conv[conv.length - 1]?.text || "" },
            { role: "user", content: txt }
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "¿En qué más puedo ayudarte?";
      setConv(p => [...p, { from: "bot", text: reply, time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setConv(p => [...p, { from: "bot", text: "Entiendo tu consulta. Un agente te atenderá en breve. 😊", time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, height: "calc(100vh - 160px)" }}>
      {/* Lista chats */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 14 }}>
          Bandeja Unificada
          <span style={{ float: "right", background: "#ef444422", color: "#ef4444", borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>
            {mensajes.filter(m => !m.leido).length} nuevos
          </span>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {mensajes.map(m => (
            <div key={m.id} onClick={() => { setSelChat(m); setMensajes(p => p.map(x => x.id === m.id ? { ...x, leido: true } : x)); }} style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer", background: selChat?.id === m.id ? "rgba(59,130,246,0.1)" : "transparent", borderLeft: selChat?.id === m.id ? "3px solid #3b82f6" : "3px solid transparent", transition: "background 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${CANAL_COLORS[m.canal] || "#3b82f6"}22`, border: `2px solid ${CANAL_COLORS[m.canal] || "#3b82f6"}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: CANAL_COLORS[m.canal] || "#3b82f6", flexShrink: 0 }}>{m.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: m.leido ? 500 : 700 }}>{m.cliente}</div>
                    <div style={{ fontSize: 10, color: CANAL_COLORS[m.canal] || "var(--muted)", fontWeight: 600 }}>{m.canal}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>{m.hora}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.mensaje}</div>
              {!m.leido && <div style={{ width: 6, height: 6, background: "#3b82f6", borderRadius: "50%", marginTop: 6 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Chat ventana */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header chat */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#22c55e22", border: "2px solid #22c55e44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#22c55e" }}>{selChat?.avatar}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{selChat?.cliente}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{selChat?.canal} · <span style={{ color: "#22c55e" }}>● En línea</span></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Badge label="🤖 Asistido por IA" color="#a78bfa" />
            <Badge label="Activo" color="#22c55e" />
          </div>
        </div>

        {/* Mensajes */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {conv.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "cliente" ? "flex-start" : "flex-end", gap: 8, alignItems: "flex-end" }}>
              {m.from === "cliente" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#22c55e22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#22c55e", flexShrink: 0 }}>AG</div>
              )}
              <div style={{ maxWidth: "70%" }}>
                <div style={{ background: m.from === "cliente" ? "var(--surface)" : m.from === "bot" ? "rgba(167,139,250,0.15)" : "rgba(59,130,246,0.2)", border: `1px solid ${m.from === "cliente" ? "var(--border)" : m.from === "bot" ? "rgba(167,139,250,0.3)" : "rgba(59,130,246,0.3)"}`, borderRadius: m.from === "cliente" ? "14px 14px 14px 4px" : "14px 14px 4px 14px", padding: "10px 14px", fontSize: 13, lineHeight: 1.5 }}>
                  {m.from === "bot" && <div style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa", marginBottom: 4 }}>🤖 Asistente IA</div>}
                  {m.from === "agente" && <div style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", marginBottom: 4 }}>👤 Agente</div>}
                  {m.text}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, textAlign: m.from === "cliente" ? "left" : "right" }}>{m.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "14px 14px 4px 14px", padding: "10px 16px", fontSize: 13, color: "#a78bfa" }}>
                <span style={{ animation: "pulse 1s infinite" }}>Escribiendo...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && enviar()} placeholder="Responder al cliente..." style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 16px", color: "var(--text)", fontSize: 13, outline: "none" }} />
          <button onClick={enviar} disabled={loading} style={{ background: "#3b82f6", border: "none", borderRadius: 10, padding: "10px 20px", color: "#fff", fontWeight: 700, fontSize: 13, opacity: loading ? 0.6 : 1 }}>Enviar →</button>
        </div>
      </div>
    </div>
  );
}

// ─── PEDIDOS ─────────────────────────────────────────────────────────────────
function Pedidos() {
  const [pedidos, setPedidos] = useState(PEDIDOS_INIT);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cliente: "", producto: "", cantidad: 1, precio: "" });

  const guardar = () => {
    if (!form.cliente || !form.producto) return;
    const nuevo = { id: `PED-00${pedidos.length + 1}`, ...form, precio: Number(form.precio), estado: "Pendiente", fecha: new Date().toISOString().split("T")[0] };
    setPedidos(p => [nuevo, ...p]);
    setForm({ cliente: "", producto: "", cantidad: 1, precio: "" });
    setShowForm(false);
  };

  const cambiarEstado = (id, nuevoEstado) => setPedidos(p => p.map(x => x.id === id ? { ...x, estado: nuevoEstado } : x));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {["Pendiente", "Procesando", "En tránsito", "Entregado"].map(e => (
          <div key={e} style={{ background: "var(--card)", border: `1px solid ${ESTADO_COLORS[e]}33`, borderRadius: 10, padding: "14px 16px", borderTop: `3px solid ${ESTADO_COLORS[e]}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ESTADO_COLORS[e], textTransform: "uppercase", letterSpacing: "0.05em" }}>{e}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 800, marginTop: 4 }}>{pedidos.filter(p => p.estado === e).length}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 600, fontSize: 13 }}>+ Nuevo pedido</button>
      </div>

      {showForm && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 80px 1fr auto", gap: 10, alignItems: "end" }}>
          {[["Cliente", "cliente", "text"], ["Producto", "producto", "text"], ["Qty", "cantidad", "number"], ["Precio MXN", "precio", "number"]].map(([ph, key, type]) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 5, fontWeight: 600 }}>{ph}</div>
              <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: type === "number" ? Number(e.target.value) : e.target.value }))} placeholder={ph} style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7, padding: "8px 12px", color: "var(--text)", fontSize: 13 }} />
            </div>
          ))}
          <button onClick={guardar} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontWeight: 600, fontSize: 13 }}>Crear</button>
        </div>
      )}

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["# Pedido", "Cliente", "Producto", "Cant.", "Total", "Estado", "Fecha", "Acción"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "13px 16px", fontFamily: "var(--mono)", fontSize: 12, color: "#3b82f6", fontWeight: 700 }}>{p.id}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600 }}>{p.cliente}</td>
                <td style={{ padding: "13px 16px", fontSize: 12, color: "var(--muted)" }}>{p.producto}</td>
                <td style={{ padding: "13px 16px", fontFamily: "var(--mono)", fontSize: 13 }}>{p.cantidad}</td>
                <td style={{ padding: "13px 16px", fontFamily: "var(--mono)", fontSize: 13, color: "#22c55e", fontWeight: 700 }}>{fmt(p.precio * p.cantidad)}</td>
                <td style={{ padding: "13px 16px" }}><Badge label={p.estado} color={ESTADO_COLORS[p.estado]} /></td>
                <td style={{ padding: "13px 16px", fontSize: 12, color: "var(--muted)" }}>{p.fecha}</td>
                <td style={{ padding: "13px 16px" }}>
                  <select value={p.estado} onChange={e => cambiarEstado(p.id, e.target.value)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", color: "var(--text)", fontSize: 11, cursor: "pointer" }}>
                    {["Pendiente", "Procesando", "En tránsito", "Entregado"].map(e => <option key={e}>{e}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "crm", label: "Clientes CRM", icon: "◎" },
  { id: "pipeline", label: "Pipeline", icon: "◧" },
  { id: "chat", label: "Atención al Cliente", icon: "◉" },
  { id: "pedidos", label: "Pedidos / POS", icon: "◫" },
];

export default function App() {
  const [mod, setMod] = useState("dashboard");

  const render = () => {
    if (mod === "dashboard") return <Dashboard />;
    if (mod === "crm") return <CRM />;
    if (mod === "pipeline") return <Pipeline />;
    if (mod === "chat") return <Chatbot />;
    if (mod === "pedidos") return <Pedidos />;
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* SIDEBAR */}
        <div style={{ width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 14, color: "#3b82f6", letterSpacing: "0.04em" }}>RETAIL</div>
            <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 14, color: "var(--text)", letterSpacing: "0.04em" }}>SYSTEM</div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, letterSpacing: "0.06em" }}>v2.0 · 2026</div>
          </div>
          <nav style={{ flex: 1, padding: "12px 10px" }}>
            {MODULES.map(m => (
              <button key={m.id} onClick={() => setMod(m.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: mod === m.id ? "rgba(59,130,246,0.15)" : "transparent", color: mod === m.id ? "#3b82f6" : "var(--muted)", fontWeight: mod === m.id ? 700 : 400, fontSize: 13, marginBottom: 2, textAlign: "left", transition: "all 0.15s", cursor: "pointer" }}>
                <span style={{ fontSize: 16, opacity: mod === m.id ? 1 : 0.6 }}>{m.icon}</span>
                {m.label}
                {m.id === "chat" && <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>4</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#3b82f622", border: "2px solid #3b82f644", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#3b82f6" }}>AD</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Admin</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>Gerente Retail</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          {/* Top bar */}
          <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", flexShrink: 0 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{MODULES.find(m => m.id === mod)?.label}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Empresa Retail · Sistema Integrado</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 12px" }}>28 Feb 2026</div>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <div style={{ fontSize: 12, color: "#22c55e" }}>Sistema activo</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
            {render()}
          </div>
        </div>
      </div>
    </>
  );
}
