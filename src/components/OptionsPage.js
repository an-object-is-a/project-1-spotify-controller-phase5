import React, { useEffect, useState, useContext } from "react";
import { CSSTransition } from 'react-transition-group';

import '../styles/options_styles.css';
import MyContext from './MyContext.js';
import Deck from './Deck.js';


let options_page = null,
	options_name = null,
	options_navigator = null,
	options_deck_type = null;


function OptionsPage() {
	const [force_update, forceUpdate] = useState();
	const my_context = useContext(MyContext);


	useEffect(() => {
		let options_page_height = options_page.getBoundingClientRect().height;

		window.addEventListener("resize", () => {
			if (!options_page) return; // check to see if component is mounted before running this listener

			options_page_height = options_page.getBoundingClientRect().height;

			options_name.style.fontSize = `${options_page_height * 0.12}px`;
			options_navigator.style.fontSize = `${options_page_height * 0.06}px`;
			options_deck_type.style.fontSize = `${options_page_height * 0.10}px`;

			forceUpdate();
		});

		options_name.style.fontSize = `${options_page_height * 0.12}px`;
		options_navigator.style.fontSize = `${options_page_height * 0.06}px`;
		options_deck_type.style.fontSize = `${options_page_height * 0.10}px`;
		forceUpdate();
	});

	return (
		<div id="chrome-ext-container_options">
			<div ref={ref_id => options_page = ref_id} className="chrome-ext-options_page">
				<div ref={ref_id => options_name = ref_id} className="chrome-ext-options_name">Current Deck</div>
				<div ref={ref_id => options_navigator = ref_id} className="chrome-ext-options_navigator">
					<div onClick={() => my_context.unload_deck(0)} id="chrome-ext-prev">&#60;&#60;</div>
					<div onClick={() => my_context.unload_deck(1)} id="chrome-ext-next">&#62;&#62;</div>
				</div>
				<div className="chrome-ext-options_content">
					<CSSTransition
						onExited={my_context.load_deck}
						in={my_context.load}
						appear={true}
						timeout={400}
						classNames={my_context.direction ? 'chrome-ext-slide-next' : 'chrome-ext-slide-prev'}>
						<Deck />
					</CSSTransition>
				</div>
				<div ref={ref_id => options_deck_type = ref_id} className="chrome-ext-deck_type">{my_context.current_deck}</div>
			</div>
		</div>
	);
}

export default OptionsPage;
