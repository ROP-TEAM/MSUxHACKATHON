import ticketsRaw from "@/data/event_tickets.json";
import Analytics from "@/components/Analytics/Analytics";

const AnalyticsPage = () => {
  return (
    <div
      style={{
        maxWidth: "52rem",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Analytics tickets={ticketsRaw} />
    </div>
  );
};

export default AnalyticsPage;
