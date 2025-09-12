import { Timer } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useInteractionStore } from "../InteractionContext";
import styles from "./../styles.module.css";


export const TimerView = observer(() => {
    const store = useInteractionStore();
    const totalSeconds = store.remainingSeconds;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return (
        <div className={styles.timer}>
            <Timer strokeWidth={2.5} className={styles.timerIcon} />
            <div className={styles.timerText}>
                {hours > 0 && (
                    <>
                        <span className={styles.timerNumber}>{paddedHours}</span>
                        <span className={styles.timerColon}>:</span>
                    </>
                )}
                <span className={styles.timerNumber}>{paddedMinutes}</span>
                <span className={styles.timerColon}>:</span>
                <span className={styles.timerNumber}>{paddedSeconds}</span>
            </div>
        </div>
    );
});
