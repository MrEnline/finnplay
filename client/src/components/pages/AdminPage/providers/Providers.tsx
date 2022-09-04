import { FC, useMemo } from "react";
import { TypeProvider } from "../../../../utils/Interfaces";
import styles from "./Providers.module.css";
import { NUMBER_ELEMENT_IN_ROW } from "../../../../utils/Constants";
import Altenar from "../../../../assets/img/altenar.png";
import Greentube from "../../../../assets/img/greentube.png";
import Gameart from "../../../../assets/img/gameart.png";
import Evolution from "../../../../assets/img/evolution.png";
import Endorphina from "../../../../assets/img/endorphina.png";
import Nolimitcity from "../../../../assets/img/nolimitcity.png";
import { TypeAliasDeclaration } from "typescript";

interface TypeProp {
    providers: Array<TypeProvider>;
}

interface TypeObj {
    [index: string]: string;
}

const Providers: FC<TypeProp> = ({ providers }) => {
    const objProviders = useMemo<TypeObj>(() => {
        return {
            GameArt: Gameart,
            "Nolimit city": Nolimitcity,
            Greentube: Greentube,
            Endorphina: Endorphina,
        };
    }, []);

    const createProviders = () => {
        if (providers.length === 0) return;

        const divProvidersArr = providers.map((provider) => {
            return (
                <div className={styles.provider}>
                    <div className={styles.provider__borderimage}>
                        <img
                            className={styles.provider__image}
                            src={provider.name in objProviders ? objProviders[provider.name] : undefined}
                            alt={provider.name}
                        />
                    </div>
                    <div className={styles.provider__name}>{provider.name}</div>
                </div>
            );
        });

        const divProvidersArrRow = divProvidersArr.reduce((result, provider, index, arr) => {
            if (index % NUMBER_ELEMENT_IN_ROW === 0) {
                result.push(arr.slice(index, index + NUMBER_ELEMENT_IN_ROW));
            }
            return result;
        }, new Array<JSX.Element[]>());

        return divProvidersArrRow.map((item) => {
            return <div className={styles.providers__rowproviders}>{item}</div>;
        });
    };

    return (
        <div className={styles.app__providers}>
            <div className={styles.providers__title}>
                <span className={styles.providers__titletext}>Providers</span>
            </div>
            {createProviders()}
        </div>
    );
};

export default Providers;
