import React, { useContext } from 'react';

import '../styles/playerbuttons_styles.css';
import MyContext from './MyContext.js';


function PlayerButtons() {
    const my_context = useContext(MyContext);

    return (
        <div id="chrome-ext-container_playerbuttons">
            <div onClick={my_context.open_close_player} className="chrome-ext-playerbuttons" id="chrome-ext-button_open_close"></div>
            <div onClick={my_context.start_pause} className="chrome-ext-playerbuttons" id="chrome-ext-button_play_pause"></div>
            <div onClick={my_context.next_track} className="chrome-ext-playerbuttons" id="chrome-ext-button_next"></div>
            <div onClick={my_context.prev_track} className="chrome-ext-playerbuttons" id="chrome-ext-button_previous"></div>
        </div>
    )
}

export default PlayerButtons;