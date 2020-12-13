import React, { useContext } from "react";

import "../styles/playerbody_styles.css";
import MyContext from './MyContext.js';

const IMAGES_PATH = "./images/";

function PlayerBody() {
	const my_context = useContext(MyContext);

	return (
		<div id="chrome-ext-container_playerbody">
			<img
				src={my_context.get_deck_image()}
				alt="img"
				id="chrome-ext-player_gif"
			/>
		</div>
	);
}

export default PlayerBody;
