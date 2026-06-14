import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { Tooltip } from "./Tooltip";

import styles from "./TicketBarChart.module.scss"; 

export default function TicketBarChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className={styles.emptyState}>ไม่มีข้อมูลการขายในช่วงเวลานี้</div>;
  }

  return (
    <div className={styles.chartBody}>
      <div className={styles.barChartWrapper}>
        <BarChart 
          width={350} 
          height={250} 
          data={data} 
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          barSize={52}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <RechartsTooltip content={<Tooltip />} cursor={{ fill: '#f3f4f6', radius: 4 }} />
          
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </div>

      <div className={styles.legendContainer}>
        {data.map((entry, index) => (
          <div key={index} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: entry.fill }} />
            <div className={styles.legendPercent}>{entry.percentage}%</div>
            <div className={styles.legendLabel}>{entry.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}