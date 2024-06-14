import React from 'react';
import Latex from 'react-latex-next';
import styles from './TargetFunctionDetails.module.css';
import {functionNames} from "@/components/TargetFunctionSelector";

const TargetFunctionDetails = ({targetFunction}) => {
    const funcName = functionNames[targetFunction.slice(-3).toLowerCase()];

    const functionDetails = {
        'Rastrigin': {
            name: 'Rastrigin Function',
            formula: 'A n + \\sum_{i=1}^{n} \\left[ x_i^2 - A \\cos(2 \\pi x_i) \\right]',
            description: 'The Rastrigin function is a non-convex function used as a performance test problem for optimization algorithms. It is highly multimodal, but locations of the minima are regularly distributed.',
            graphic: '/images/rastrigin.png'
        },
        'Rosenbrock': {
            name: 'Rosenbrock Function',
            formula: '\\sum_{i=1}^{n-1} \\left[ 100 (x_{i+1} - x_i^2)^2 + (1 - x_i)^2 \\right]',
            description: 'The Rosenbrock function, also known as the Valley or Banana function, is a popular test problem for optimization algorithms. The global minimum is inside a long, narrow, parabolic shaped flat valley.',
            graphic: '/images/rosenbrock.png'
        },
        'Sphere Function': {
            name: 'Sphere Function',
            formula: '\\sum_{i=1}^{n} (x_i - a)^2 + (y_i - b)^2',
            description: 'The Sphere function is a simple unimodal function. It is continuous, convex, and unimodal. The global minimum is at the origin.',
            graphic: '/images/sphere.png'
        }
    };

    const details = functionDetails[funcName] || {};

    return (
        <div className={styles.functionDetails}>
            <h2>{details.name}</h2>
            <p><strong>Formula:</strong></p>
            {/*<p><Latex>{`$${details.formula}$`}</Latex></p>*/}
            <Latex>{`$${details.formula}$`}</Latex>
            <p>{details.description}</p>
            {details.graphic && <img src={details.graphic} alt={`${details.name} graphic`} className={styles.graphic}/>}
        </div>
    );
};

export default TargetFunctionDetails;
