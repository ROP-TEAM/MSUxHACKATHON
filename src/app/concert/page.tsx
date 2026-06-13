import StageOverview from "@/components/stageOverview/StageOverview";
import styles from "./page.module.scss";
const ConcertPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.stage}>
                <StageOverview></StageOverview>
            </div>
        </div>
    )
}

export default ConcertPage;