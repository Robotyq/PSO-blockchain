import React from 'react';
import styles from './TargetFunctionDetails.module.css';
import {functionNames} from "@/components/TargetFunctionSelector";

const TargetFunctionDetails = ({targetFunction}) => {
    console.log('Targhet Function Details...', targetFunction);
    const funcName = functionNames[targetFunction.slice(-3).toLowerCase()];
    console.log('Function Name...', funcName);

    const functionDetails = {
        'Rastrigin': {
            name: 'Rastrigin Function',
            formula: 'An + Σ[x_i^2 - A * cos(2π * x_i)]',
            description: 'The Rastrigin function is a non-convex function used as a performance test problem for optimization algorithms. It is highly multimodal, but locations of the minima are regularly distributed.',
            graphic: '/path/to/rastrigin.png'
        },
        'Rosenbrock': {
            name: 'Rosenbrock Function',
            formula: 'Σ [100 * (x_{i+1} - x_i^2)^2 + (1 - x_i)^2]',
            description: 'The Rosenbrock function, also known as the Valley or Banana function, is a popular test problem for optimization algorithms. The global minimum is inside a long, narrow, parabolic shaped flat valley.',
            graphic: '/path/to/rosenbrock.png'
        },
        'Sphere Function': {
            name: 'Sphere Function',
            formula: 'Σ (x_i - a)^2 + (y_i - b)^2',
            description: 'The Sphere function is a simple unimodal function. It is continuous, convex, and unimodal. The global minimum is at the origin.',
            graphic: '/path/to/sphere.png'
        }
    };

    const details = functionDetails[funcName] || {};

    return (
        <div className={styles.functionDetails}>
            <h2>{details.name}</h2>
            <p><strong>Formula:</strong></p>
            <p>{details.formula} </p>
            <p>{details.description}</p>
            {details.graphic && <img src={details.graphic} alt={`${details.name} graphic`} className={styles.graphic}/>}
        </div>
    );
};

export default TargetFunctionDetails;
