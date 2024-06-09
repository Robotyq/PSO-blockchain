import React from 'react';
import styles from '../page.module.css';

const EventItem = ({ event }) => {
    switch (event.event) {
        case 'ParticleBorn':
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>:
                    Particle: {event.particle}<br />
                    Initial Position: [{event.initialPosition.join(', ')}]<br />
                    Speed: [{event.speed.join(', ')}]
                </div>
            );
        case 'NewBestGlobal':
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>:
                    Particle: {event.particle}<br />
                    Old Value: [{event.oldValue.join(', ')}]<br />
                    New Value: [{event.newValue.join(', ')}]
                </div>
            );
        case 'New Local Min':
            console.log(" position event", event.oldPos.x, event.newPos[1])
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>:
                    Particle: {event.particle}<br />
                    Old Position: [{Number(event.oldPos.x)}, {Number(event.oldPos.y)}, {Number(event.oldPos.z)}]<br />
                    New Position: [{Number(event.newPos.x)}, {Number(event.newPos.y)}, {Number(event.newPos.z)}]
                </div>
            );
        default:
            return (
                <div className={styles.eventItem}>
                    <strong>{event.event}</strong>: {JSON.stringify(event.returnValues)}
                </div>
            );
    }
};

const EventsList = ({ events }) => (
    <div className={styles.events}>
        <h2>Events from last 5 blocks</h2>
        <ul className={styles.list}>
            {events.map((event, index) => (
                <li key={index} className={styles.listItem}>
                    <EventItem event={event} />
                </li>
            ))}
        </ul>
    </div>
);

export default EventsList;
