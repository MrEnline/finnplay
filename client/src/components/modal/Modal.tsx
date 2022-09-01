import Portal from '../portal/Portal';
import styles from './Modal.module.css';
import classNames from 'classnames';
import ButtonClose from '../../assets/img/icon-close.svg';
import Button from '../button/Button';

type PropsType = {
    title: string;
    isOpen: boolean;
    onResetSettings: () => void;
    description: JSX.Element;
    body: JSX.Element;
    footer: JSX.Element;
};

//const Modal = ({ title, isOpen, dataDeleteGroup, nameEditGroup, setNameEditGroup, onResetSettings, body, footer }: PropsType) => {
const Modal = ({ title, isOpen, onResetSettings, description, body, footer }: PropsType) => {
    // const description = (
    //     <>
    //         Do you want to delete {dataDeleteGroup?.nameGame} group? <br /> If you want to move {dataDeleteGroup?.numberGame} games, select new group
    //         below.
    //     </>
    // );

    // const editGroupName = (
    //     <>
    //         {/* <div className={styles.groupname}>
    //             <div className={styles.groupname__content}>
    //                 <span className={styles.groupname__title}>Group name</span>
    //                 <span className={styles.groupname__name}>{nameEditGroup}</span>
    //             </div>
    //         </div> */}
    //         <div className={styles.inputfield}>
    //             <div className={styles.inputfield__content}>
    //                 <input
    //                     className="groupname"
    //                     type="groupname"
    //                     name="groupname"
    //                     id="groupname"
    //                     value={nameEditGroup}
    //                     onChange={(e:) => setNameEditGroup(e.target.value)}
    //                     required
    //                 />
    //                 <label htmlFor="groupname">Group name</label>
    //             </div>
    //         </div>
    //     </>
    // );

    return (
        <>
            {isOpen && (
                <Portal>
                    <div className={classNames(styles.modal__overlay, { [styles.modal__overlay_visible]: isOpen })}>
                        <div className={styles.modal__content}>
                            <div className={styles.modal__header}>
                                <div className={styles.modal__title}>{title}</div>
                            </div>
                            <div className={styles.modal__close}>
                                <img onClick={onResetSettings} src={ButtonClose} alt="close" />
                            </div>
                            <div className={styles.modal__description}>{description}</div>
                            <div className={styles.modal__body}>{body}</div>
                            <div className={styles.modal__footer}>{footer}</div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
};

export default Modal;
