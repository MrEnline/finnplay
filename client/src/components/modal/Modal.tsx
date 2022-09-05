import Portal from '../portal/Portal';
import styles from './Modal.module.css';
import classNames from 'classnames';
import ButtonClose from '../../assets/img/icon-close.svg';

type PropsType = {
    title: string;
    isOpen: boolean;
    onResetSettings: () => void;
    description: JSX.Element;
    body: JSX.Element;
    footer: JSX.Element;
};

const Modal = ({ title, isOpen, onResetSettings, description, body, footer }: PropsType) => {
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
