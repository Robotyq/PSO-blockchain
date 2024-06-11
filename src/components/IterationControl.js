import React, {useState} from 'react';
import styles from '../page.module.css';

const IterationControl = ({onIterate}) => {
    const [value, setValue] = useState(1);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleIterate = () => {
        onIterate(value);
    };

    return (
        <div className={styles.iterationControl}>
            <label>Number of iterations</label>
            <input
                type="range"
                min="1"
                max="20"
                value={value}
                onChange={handleChange}
                className={styles.slider}
            />
            <span>{value}</span>
            <button className={styles.button_gas} onClick={handleIterate}>
                Iterate
            </button>
        </div>
    );
};

export default IterationControl;
