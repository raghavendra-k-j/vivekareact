import clsx from 'clsx';
import styles from './../styles.module.css';
import { QuestionVm } from '../models/QuestionVm';



export function QuestionCardView({ children, parent }: { children: React.ReactNode, parent?: QuestionVm }) {
    const resolvedClassName = !parent ? styles.questionCardDefault : styles.questionCardChild;
    return (
        <div className={clsx(styles.questionCard, resolvedClassName)}>
            {children}
        </div>
    );

}