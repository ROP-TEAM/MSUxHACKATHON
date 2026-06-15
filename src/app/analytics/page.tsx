import Analytics from "@/components/Analytics/Analytics";
import Image from "next/image";
const AnalyticsPage = () => {
  return (
    <div>
      <div
        style={{
          backgroundColor: "#EC4E00",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
          <rect
            width="100%"
            height="100%"
            fill="white"
            opacity="0.18"
            filter="url(#grain)"
          />
          <rect
            width="100%"
            height="100%"
            fill="black"
            opacity="0.12"
            filter="url(#grain)"
          />
        </svg>
        <Image
          style={{ width: "400px", height: "auto", display: "block" }}
          src={"/image/background2.svg"}
          width={400}
          height={200}
          alt="backgroubd"
        ></Image>
      </div>
      <div
        style={{
          maxWidth: "52rem",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Analytics />
      </div>
    </div>
  );
};

export default AnalyticsPage;
