import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

interface PropsType {
    children: React.ReactNode;
    onClick: () => void;
    classNameButton: string;
    isSave: boolean;
    disabled: boolean;
}

const Button = ({ children, onClick, classNameButton, disabled, isSave, ...attrs }: PropsType) => {
    const classes = classNames(styles.button, { [styles[classNameButton]]: !disabled }, { [styles.button__save]: isSave });

    return (
        <button className={classes} disabled={disabled} onClick={onClick} {...attrs}>
            {children}
        </button>
    );
};

export default Button;
