import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Tooltip } from "./Tooltip";

import styles from "./TicketPieChart.module.scss"; 

export default function TicketPieChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className={styles.emptyState}>ไม่มีข้อมูลการขายในช่วงเวลานี้</div>;
  }

  return (
    <div className={styles.chartBody}>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <RechartsTooltip content={<Tooltip />} />
          </PieChart>
        </ResponsiveContainer>
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