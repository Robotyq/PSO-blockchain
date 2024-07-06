import React from 'react';
import styles from '../page.module.css';

const EventItem = ({event}) => {
    switch (event.event) {
        case 'ParticleAdded':
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>
                    : {event.particle}<br/>
                    block: {Number(event.blockNumber)}<br/>
                </div>
            );
        case 'NewBestGlobal':
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>
                    : [{event.newValue.join(', ')}]<br/>
                    Particle: {event.particle}<br/>
                    block: {Number(event.blockNumber)}<br/>
                </div>
            );
        case 'New Local Min':
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>
                    : [{event.newPos.join(', ')}]<br/>
                    Particle: {event.particle}<br/>
                    block: {Number(event.blockNumber)}<br/>
                </div>
            );
        case 'TargetFunctionUpdated':
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>
                    : {event.targetFunctionAddress}<br/>
                    block: {Number(event.blockNumber)}<br/>
                </div>
            );
        case 'Moved':
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>
                    : {event.particle}<br/>
                    new value: {Number(event.newValue)}<br/>
                    block: {Number(event.blockNumber)}<br/>
                </div>
            );
        default:
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>: {JSON.stringify(event.returnValues)}
                    block: {Number(event.blockNumber)}<br/>
                </div>
            );
    }
};

const EventsList = ({events}) => {
    // Sort events by blockNumber in descending order
    const sortedEvents = events.sort((a, b) => {
        return Number(b.blockNumber) - Number(a.blockNumber);
    });

    return (
        <div className={styles.events}>
            <h2>Events from last 5 blocks</h2>
            <ul className={styles.list}>
                {sortedEvents.map((event, index) => (
                    <li key={index} className={styles.listItem}>
                        <EventItem event={event}/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventsList;
