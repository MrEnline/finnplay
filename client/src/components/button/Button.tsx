import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import classNames from 'classnames';
import { act } from 'react-dom/test-utils';

interface PropsType {
    children: React.ReactNode;
    onClick: () => void;
    classNameButton: string;
    disabled: boolean;
}

const Button = ({ children, onClick, classNameButton, disabled, ...attrs }: PropsType) => {
    const classes = classNames(styles.button, { [styles[classNameButton]]: !disabled });

    return (
        <button className={classes} disabled={disabled} onClick={onClick} {...attrs}>
            {children}
        </button>
    );
};

export default Button;
