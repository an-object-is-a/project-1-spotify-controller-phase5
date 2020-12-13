import React, { useEffect } from "react";

import "../styles/ticker_styles.css";

let ticker_background = null,
	ticker_text = null;

const FRAME_DURATION = 1000 / 60;

let anim_id = null;
let current_time = 0.0;
let old_time = typeof performance === "function" ? performance.now : Date.now();
let ticker_position_offset = 0.0;
let ticker_position = 0.0;

function start_anim() {
	cancelAnimationFrame(anim_id);

	ticker_position_offset = -1.0 * ticker_text.offsetLeft;

	old_time = Date.now();
	tick();
}

function stop_anim() {
	if (ticker_text) {
		ticker_text.style.left = '0px';
		ticker_position = 0.0;
	}
	cancelAnimationFrame(anim_id);
}

function tick() {
	current_time = typeof performance === "function" ? performance.now : Date.now();
	let delta_time = (current_time - old_time) / FRAME_DURATION;
	old_time = current_time;

	ticker_position -= delta_time;

	if (ticker_text.getBoundingClientRect().right <= ticker_background.getBoundingClientRect().left) {
		ticker_position = (ticker_background.getBoundingClientRect().right - ticker_background.getBoundingClientRect().left) +
			ticker_position_offset +
			20; // just added 20 so text doesn't start a new scroll so quickly

		ticker_text.style.left = `${ticker_position}px`;
	} else {
		ticker_text.style.left = `${ticker_position * 0.9}px`;
	}

	anim_id = requestAnimationFrame(tick);
}

function Ticker(props) {
	/*
  	Resize every re-render.
   	*/
	useEffect(() => {
		ticker_text.style.fontSize = `${ticker_background.getBoundingClientRect().height * .70}px`;
	});

	/* 
	Give time for the 'props.current_track' to load in the render before starting the animation
	This prevents alignment issues.
 	*/
	setTimeout(() => {
		props.isPlaying ?
			start_anim() :
			stop_anim();
	}, 1);

	return (
		<div id="chrome-ext-container_ticker">
			<div ref={ref_id => ticker_background = ref_id} id="chrome-ext-ticker_background">
				<div ref={ref_id => ticker_text = ref_id} id="chrome-ext-ticker_text">{props.current_track}</div>
			</div>
		</div>
	);
}

export default React.memo(Ticker);
