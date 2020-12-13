import React, {Fragment, useContext} from 'react';

import '../styles/deck_styles.css';
import MyContext from './MyContext.js';

const IMAGES_PATH = './images/';

function Deck() {
    const my_context = useContext(MyContext);
    const default_deck = IMAGES_PATH + 'decks/' + my_context.decks[my_context.current_deck].default;

    return (
        <Fragment>
            <img className="chrome-ext-deck" src={default_deck} alt="deck"/>
        </Fragment>
    )
}

export default Deck;