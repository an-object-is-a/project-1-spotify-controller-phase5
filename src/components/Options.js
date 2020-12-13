import React from 'react';

import '../styles/foreground_styles.css';
import { decks, cassettes } from '../images_ledger.js';
import MyContext from './MyContext.js';
import OptionsPage from './OptionsPage.js';
import LoadingPage from './LoadingPage.js';



class Foreground extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // Foreground
            decks: {},
            cassettes: [],
            loaded: false,
            shouldResize: 0,
            // Player.js, Options.js
            isClosed: true,
            isPlaying: false,
            newTrack: false,
            current_track: 'Artist - Song',
            current_deck: 'orange',
            // Options.js
            load: true,
            direction: 1
        }

        this.container_main = null;
        this.container_width = null;
        this.container_height = null;
    }

    componentDidMount() {
        const desktop_size = 30,
            mobile_size = 40,
            mobile_threshold = 500;
        const height_ratio = 1.84;
        let aspect_ratio = window.innerWidth / window.innerHeight;
        let new_container_width = window.innerWidth <= mobile_threshold ? mobile_size : desktop_size;
        let new_container_height = (new_container_width / height_ratio) * aspect_ratio;

        window.addEventListener("resize", () => {
            if (!this.container_main) return; // check to see if component is mounted before running this listener

            aspect_ratio = window.innerWidth / window.innerHeight;
            new_container_width = window.innerWidth <= mobile_threshold ? mobile_size : desktop_size;
            new_container_height = (new_container_width / height_ratio) * aspect_ratio;

            this.container_width = `${new_container_width}%`;
            this.container_height = `${new_container_height}%`;

            this.setState(_state => ({ shouldResize: !_state.shouldResize }));
        });

        this.container_width = `${new_container_width}%`;
        this.container_height = `${new_container_height}%`;

        this.setState(_state => ({
            shouldResize: !_state.shouldResize,
            decks: decks,
            cassettes: cassettes,
            loaded: true
        }));
    }

    get_deck_image = () => {
        let image_location = '';

        if (this.state.isPlaying) {
            image_location = IMAGES_PATH + 'decks/' +
                this.state.decks[this.state.current_deck][this.state.cassettes[0]].play;
        } else if (!this.state.isPlaying) {
            image_location = IMAGES_PATH + 'decks/' +
                this.state.decks[this.state.current_deck][this.state.cassettes[0]].pause;
        }

        if (this.state.newTrack) {
            image_location = IMAGES_PATH + 'decks/' +
                this.state.decks[this.state.current_deck][this.state.cassettes[0]].load;

            setTimeout(() => {
                image_location = IMAGES_PATH + 'decks/' +
                    this.state.decks[this.state.current_deck][this.state.cassettes[0]].pause;
            }, 500);
        }

        return image_location;
    }

    open_close_player = () => {
        this.setState(_state => {
            return {
                isClosed: !_state.isClosed
            }
        });
    }

    start_pause = () => {
        this.setState(_state => {
            return {
                isPlaying: !_state.isPlaying
            }
        });
    }

    next_track = () => {
        this.setState(_state => {
            return {
                newTrack: true,
                isPlaying: false,
            }
        }, () => {
            setTimeout(() => {
                this.setState({ newTrack: false, isPlaying: true });
            }, 400);
        });
    }

    prev_track = () => {
        this.setState(_state => {
            return {
                newTrack: true,
                isPlaying: false,
            }
        }, () => {
            setTimeout(() => {
                this.setState({ newTrack: false, isPlaying: true });
            }, 400);
        });
    }

    unload_deck = () => {
        this.setState(_state => {
            return {
                load: false,
                direction: _direction
            }
        });
    }

    load_deck = () => {
        const deck_names = Object.keys(this.state.decks);
        let next_deck = deck_names.indexOf(this.state.current_deck) + (this.state.direction ? 1 : -1);

        if (next_deck >= deck_names.length) {
            next_deck = 0;
        } else if (next_deck < 0) {
            next_deck = deck_names.length - 1;
        }

        this.setState({
            current_deck: deck_names[next_deck],
            load: true
        });
    }

    render() {
        return (
            <MyContext.Provider
                value={{
                    ...this.state,
                    get_deck_image: this.get_deck_image,
                    open_close_player: this.open_close_player,
                    start_pause: this.start_pause,
                    next_track: this.next_track,
                    prev_track: this.prev_track,
                    unload_deck: this.unload_deck,
                    load_deck: this.load_deck
                }}>
                (
                <div className="chrome-ext-modal" style={{ backgroundColor: 'red' }}>
                    {
                        !this.state.loaded ?
                            <LoadingPage /> :
                            <OptionsPage />
                    }
                </div>
            </MyContext.Provider>
        );
    }
}

export default Foreground;