import Portal from '../portal/Portal';
import styles from './Modal.module.css';
import classNames from 'classnames';
import ButtonClose from '../../assets/img/icon-close.svg';

type PropsType = {
    title: string;
    description: JSX.Element | string | null;
    isOpen: boolean;
    onResetSettings: () => void;
    children: JSX.Element;
};

const Modal = ({ title, description, isOpen, onResetSettings, children }: PropsType) => {
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
                            <div className={styles.modal__body}>{children}</div>
                            <div className={styles.modal__footer}>
                                {/* <Button onClick={onCancel} invert>
                                    Cancel
                                </Button>
                                <Button onClick={onSubmit}>Submit</Button> */}
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
};

export default Modal;
