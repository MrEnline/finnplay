import { FC } from "react";
import { TypeProvider } from "../../../../utils/Interfaces";
import styles from "./Providers.module.css";
import { NUMBER_ELEMENT_IN_ROW } from "../../../../utils/Constants";

interface TypeProp {
    providers: Array<TypeProvider>;
}

const Providers: FC<TypeProp> = ({ providers }) => {
    // const createProviders = () => {
    //     if (providers.length === 0) return;

    //     const divGamesArr = providers.map((provider) => {
    //         return (
    //             <div className={styles.game}>
    //                 <div className={styles.game__image}>
    //                     <img src={} alt="game" />
    //                 </div>
    //                 <div className={styles.game__name}>{provider.name}</div>
    //             </div>
    //         );
    //     });

    //     const divGamesArrRow = [];
    //     for (let index = 0; index < divGamesArr.length; index += NUMBER_ELEMENT_IN_ROW) {
    //         divGamesArrRow.push(divGamesArr.slice(index, index + NUMBER_ELEMENT_IN_ROW));
    //     }

    //     return divGamesArrRow.map((item) => {
    //         return <div className={styles.providers__rowproviders}>{item}</div>;
    //     });
    // };

    return (
        <div className={styles.app__providers}>
            <div className={styles.providers__title}>
                <span className={styles.providers__titletext}>Providers</span>
            </div>
        </div>
    );
};

export default Providers;
