import { FC } from 'react';
import styles from './Groups.module.css';
import { TypeGroup } from '../../../../utils/Interfaces';
import IconAdd from '../../../../assets/img/icon-add.svg';

interface TypeProp {
    groups: Array<TypeGroup>;
}

const Groups: FC<TypeProp> = ({ groups }) => {
    return (
        <div className={styles.app__groups}>
            <div className={styles.groups__title}>
                <span className={styles.groups__titletext}>Groups</span>
                <img onClick={() => console.log('add group')} alt="add" src={IconAdd} />
            </div>
        </div>
    );
};

export default Groups;
