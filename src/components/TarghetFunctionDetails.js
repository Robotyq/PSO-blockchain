import React from 'react';
import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';
import styles from './TargetFunctionDetails.module.css';
import {functionNames} from "@/components/TargetFunctionSelector";

const TargetFunctionDetails = ({targetFunction}) => {
    const funcName = functionNames[targetFunction.slice(-3).toLowerCase()];

    const functionDetails = {
        'Rastrigin': {
            name: 'Rastrigin Function',
            formula: 'A n + \\sum_{i=1}^{n} \\left[ x_i^2 - A \\cos(2 \\pi x_i) \\right]',
            description: 'The Rastrigin function is a non-convex function used as a performance test problem for optimization algorithms. It is highly multimodal, but locations of the minima are regularly distributed. For this deployment, A is set to 10 and n is 2 because the function is 2-dimensional. In order to work with decimal numbers, the function is scaled by 10^18. When deploying a new Particle the initial coordinates must also be scaled by 10^18.',
            minimum: 'The global minimum is at the origin.',
            graphic: '/images/Rastrigin.png'
        },
        'Rosenbrock': {
            name: 'Rosenbrock Function',
            formula: '\\sum_{i=1}^{n-1} \\left[ 100 (x_{i+1} - x_i^2)^2 + (1 - x_i)^2 \\right]',
            description: 'The Rosenbrock function, also known as the Valley or Banana function, is a popular test problem for optimization algorithms. The global minimum is inside a long, narrow, parabolic shaped flat valley.',
            minimum: 'The global minimum is at (1,1)',
            graphic: '/images/Rosenbrock.png'
        },
        'Sphere Function': {
            name: 'Sphere Function',
            formula: 'A \\cdot (x - A)^2 + (y - A)^2',
            description: 'The Sphere function, as implemented, offsets the input values by a constant factor before squaring them. This function is a simple unimodal function. The global minimum is at the origin after the offset.',
            graphic: '/images/Sphere.png',
            minimum: 'The minimum for the deployed contract is at (200,200)',
        }
    };

    const details = functionDetails[funcName] || {};

    return (
        <div className={styles.functionDetails}>
            <h2>{details.name}</h2>
            <br/>
            <p><strong>Formula:</strong></p>
            <p><InlineMath>{details.formula}</InlineMath></p>
            <br/>
            <p>{details.description}</p>
            <br/>
            <p>{details.minimum}</p>
            {details.graphic && <img src={details.graphic} alt={`${details.name} graphic`} className={styles.graphic}/>}
        </div>
    );
};

export default TargetFunctionDetails;
