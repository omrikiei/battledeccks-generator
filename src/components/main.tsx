import {RandomWordGeneratorClient} from "../utils/random-generator-client";
import React, {Component} from "react";

const randomGeneratorClient = new RandomWordGeneratorClient()

interface Config {
    secondsPerSlide: number
}

const DEFAULT_CONFIG = {
    secondsPerSlide: 15,
}

type GameState = {
    config: Config
    imgURL: string
    imgAlt: string
    title: string
    seconds: number
    slideNum: number
    running: boolean
}

export class Game extends Component<any, GameState> {

    myInterval: NodeJS.Timeout | undefined

    constructor(props: any) {
        super(props);
        this.toggle = this.toggle.bind(this)
    }

    componentWillMount() {
        this.setState({
            config: DEFAULT_CONFIG,
            imgURL: randomGeneratorClient.randomImageSrc(),
            imgAlt: randomGeneratorClient.randomPhrase(),
            title: randomGeneratorClient.randomSlideTitle(),
            seconds: DEFAULT_CONFIG.secondsPerSlide,
            slideNum: 0,
            running: true,
        })
    }

    componentDidMount() {
        this.run()
    }

    componentWillUnmount() {
        this.myInterval && clearInterval(this.myInterval)
    }

    run() {
        this.myInterval = setInterval(() => {
            const {seconds, slideNum, config} = this.state

            if (seconds > 0) {
                this.setState(({seconds}) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 1) {
                this.setState({
                    imgURL: randomGeneratorClient.randomImageSrc(),
                    imgAlt: randomGeneratorClient.randomPhrase(),
                    title: randomGeneratorClient.randomSlideTitle(),
                    seconds: config.secondsPerSlide,
                    slideNum: slideNum + 1
                })
            }
        }, 1000)
    }

    toggle() {
        if (this.state.running) {
            this.myInterval && clearInterval(this.myInterval)
            this.setState({
                running: false,
            })
        } else {
            this.run()
            this.setState({
                running: true
            })
        }
    }

    render() {
        const remainingSecondsColor = this.state.seconds > 3 ? 'white' : 'red';
        return (
            <div className="App">
                <header className="App-header">
                    <img src={this.state.imgURL} alt={this.state.imgAlt} style={{'width': '100%'}} onClick={this.toggle}/>
                    {this.state.slideNum % 4 < 3 && <div className="slide-title">{this.state.title}</div>}
                    <div className="remaining-seconds" style={
                        {'WebkitTextFillColor': remainingSecondsColor}
                    }>{this.state.seconds}</div>
                </header>
            </div>)
    }
}
