import React from 'react';
import { CSSTransition } from 'react-transition-group';

import '../styles/shared_styles.css';
import '../styles/player_styles.css';
import Ticker from './Ticker.js';
import PlayerBody from './PlayerBody.js';
import PlayerButtons from './PlayerButtons.js';

function Player(props) {
    return (
        <CSSTransition in={props.isClosed} appear={true} timeout={1000} classNames="chrome-ext-flip">
            <div className="chrome-ext-sub_container">
                <Ticker
                    shouldResize={props.shouldResize}
                    current_track={props.current_track}
                    isPlaying={props.isPlaying}
                />
                <PlayerBody />
                <PlayerButtons />
            </div>
        </CSSTransition>
    )
}

export default React.memo(Player);