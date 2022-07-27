import { FC } from 'react';
import styles from './Groups.module.css';
import { TypeGroup } from '../../../../utils/Interfaces';

interface TypeProp {
    groups: Array<TypeGroup>;
}

const Groups: FC<TypeProp> = ({ groups }) => {
    return <div className={styles.app__groups}></div>;
};

export default Groups;
