import styles from "./Footer.module.scss";
import Image from "next/image";

export const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Image src="/icon/logo.svg" alt="Logo" width={80} height={60} />
          <p>Your trusted platform for<br></br> concert and event ticket booking</p>
          <div className={styles.qrCode}>
            <Image src="/icon/qrcode.svg" alt="QR Code" width={80} height={80} />
            <p>Scan to  start your<span><br></br>journey</span></p>
          </div>
        </div>
        <div className={styles.tab}>
            <h3>Booking</h3>
            <p>Book Tickets</p>
            <p>Search Schedules</p>
            <p>My Bookings</p>
            <p>Cancel/Reschedule</p>
        </div>
        <div className={styles.tab}>
            <h3>Company</h3>
            <p>About Us</p>
            <p>News & Promotions</p>
            <p>Careers</p>
            <p>Contact</p>
        </div>
        <div className={styles.tab}>
            <h3>Support</h3>
            <p>Help Center</p>
            <p>FAQ</p>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};
