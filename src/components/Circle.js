import React from 'react';

const Circle = ({ children }) => {
    const styles = {
        circle: {
            width: '100px', // 调整圆圈的大小
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px solid #000' // Optional: border around the circle
        }
    };

    return <div style={styles.circle}>{children}</div>;
};

export default Circle;
