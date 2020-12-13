import React from 'react';

import '../styles/popup_styles.css';

function Popup() {
    return (
        <div id="chrome-ext-container_popup">
            <div className="chrome-ext-popup_name">Welcome</div>
            <div className="chrome-ext-sign_in_out">Sign In</div>
            <div className="chrome-ext-sign_in_out">Sign Out</div>
        </div>
    )
}

export default Popup;