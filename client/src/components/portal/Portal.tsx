import React, { Component, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

type PropsType = {
    children: React.ReactNode;
};

const Portal = ({ children }: PropsType) => {
    const divElement = useMemo(() => document.createElement('div'), []);

    useEffect(() => {
        document.body.appendChild(divElement);
        return () => {
            document.body.removeChild(divElement);
        };
    }, []);

    return ReactDOM.createPortal(children, divElement);
};

export default Portal;

// class Portal extends Component {
//     el = document.createElement('div');

//     componentDidMount() {
//         document.body.appendChild(this.el);
//     }

//     componentWillUnmount() {
//         document.body.removeChild(this.el);
//     }

//     render() {
//         const { children } = this.props;

//         return ReactDOM.createPortal(children, this.el);
//     }
// }

// export default Portal;
