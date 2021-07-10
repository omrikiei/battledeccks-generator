import {RandomWordGeneratorClient} from "../utils/random-generator-client";
import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card'

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
    started: boolean
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
            started: false,
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

    init = <div>
        <h1>Welcome to battledecks</h1>
        <p>Battledecks — also called Powerpoint Karaoke — is an improv game that works well at conferences.
            Contestants make up presentations using slide decks they have never seen before. That means your goal is
            to make the audience laugh using two props: slide decks and willing participants. </p>
        <Card>
            
        </Card>
        <InputGroup className='mb-3'>
            <InputGroup.Text>{this.state.seconds}</InputGroup.Text>
        </InputGroup>
        <InputGroup size="lg">
            <InputGroup.Text id="inputGroup-sizing-lg">Large</InputGroup.Text>
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm"/>
        </InputGroup>
        <Button>Start</Button>
    </div>

    render() {
        const remainingSecondsColor = this.state.seconds > 3 ? 'white' : 'red';
        const runningGame = <div>
            <img src={this.state.imgURL} alt={this.state.imgAlt} style={{'width': '100%'}} onClick={this.toggle}/>
            {this.state.slideNum % 4 < 3 && <div className="slide-title">{this.state.title}</div>}
            <div className="remaining-seconds" style={
                {'WebkitTextFillColor': remainingSecondsColor}
            }>{this.state.seconds}</div>
        </div>
        return (
            <div className="App">
                <header className="App-header">
                    {!this.state.started ? this.init : runningGame}
                </header>
            </div>)
    }
}
