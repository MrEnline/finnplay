import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import classNames from 'classnames';

interface PropsType {
    children: React.ReactNode;
    onClick: () => void;
    classNameButton: string;
    disabled: boolean;
    active: boolean;
    invert: boolean;
}

const Button = ({ children, onClick, classNameButton, disabled, active, invert, ...attrs }: PropsType) => {
    const classes = classNames(styles.button, { classNameButton: active });

    return (
        <button className={classes} disabled={disabled} onClick={onClick} {...attrs}>
            {children}
        </button>

        // <div className={classes} disabled={disabled} onClick={onClick} {...attrs}>
        //     {children}
        // </div>
    );
};

export default Button;
