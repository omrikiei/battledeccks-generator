import {RandomWordGeneratorClient} from "../utils/random-generator-client";
import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Form'
import Col from 'react-bootstrap/FormGroup'

const randomGeneratorClient = new RandomWordGeneratorClient()

interface Config {
    secondsPerSlide: number
}

const DEFAULT_CONFIG = {
    secondsPerSlide: 15,
    slidesPerDeck: 10
}

type GameState = {
    config: Config
    imgURL: string
    imgAlt: string
    title: string
    seconds: number
    slideNum: number
    slidesPerDeck: number
    running: boolean
    started: boolean
}

export class Game extends Component<any, GameState> {

    myInterval: NodeJS.Timeout | undefined

    constructor(props: any) {
        super(props);
        this.toggle = this.toggle.bind(this)
        this.run = this.run.bind(this)
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event: KeyboardEvent) {
        if (event.keyCode === 27) {
            this.setState({
                slideNum: 0,
                started: false,
                running: false
            })
        }
    }

    componentWillMount() {
        this.setState({
            config: DEFAULT_CONFIG,
            imgURL: randomGeneratorClient.randomImageSrc(),
            imgAlt: randomGeneratorClient.randomPhrase(),
            title: randomGeneratorClient.randomSlideTitle(),
            seconds: DEFAULT_CONFIG.secondsPerSlide,
            slidesPerDeck: DEFAULT_CONFIG.slidesPerDeck,
            slideNum: 0,
            running: true,
            started: false,
        })
    }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }

    componentWillUnmount() {
        this.myInterval && clearInterval(this.myInterval)
        document.removeEventListener("keydown", this.escFunction, false);
    }

    run() {
        this.setState({
            started: true
        })
        this.myInterval = setInterval(() => {
            const {seconds, slideNum, config} = this.state

            if (seconds > 0) {
                this.setState(({seconds}) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 1) {
                if (slideNum < this.state.slidesPerDeck) {
                    this.setState({
                        imgURL: randomGeneratorClient.randomImageSrc(),
                        imgAlt: randomGeneratorClient.randomPhrase(),
                        title: randomGeneratorClient.randomSlideTitle(),
                        seconds: config.secondsPerSlide,
                        slideNum: slideNum + 1
                    })
                } else {
                    this.setState({
                        slideNum: 0,
                        started: false,
                        running: false
                    })
                    this.myInterval && clearInterval(this.myInterval)
                }

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

        const init = <div style={{'width': '50%'}}>
            <h1>Welcome to battledecks</h1>
            <p>Battledecks — also called Powerpoint Karaoke — is an improv game that works well at conferences.
                Contestants make up presentations using slide decks they have never seen before. That means your goal is
                to make the audience laugh using two props: slide decks and willing participants. </p>
            <Card>

            </Card>
            <Form>
                <Row>
                    <Col>
                        <Form.Group controlId="formBasicRange">
                            <Form.Label>Seconds per slide</Form.Label>
                            <Form.Control type="range" value={this.state.seconds} min='5' max='60' onChange={e =>
                                this.setState({
                                    seconds: parseInt(e.target.value),
                                })}/>
                            <Form.Control value={this.state.seconds}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formBasicRange">
                            <Form.Label>Number of slides</Form.Label>
                            <Form.Control type="range" value={this.state.slidesPerDeck} min='2' max='20' onChange={e =>
                                this.setState({
                                    slidesPerDeck: parseInt(e.target.value),
                                })}/>
                            <Form.Control value={this.state.slidesPerDeck}/>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Button onClick={e => {
                this.run()
            }
            }>Start</Button>
        </div>

        const runningGame = <div style={{'width': '100%'}}>
            <img src={this.state.imgURL} alt={this.state.imgAlt} style={{'width': '100%'}} onClick={this.toggle}/>
            {this.state.slideNum % 4 < 3 && <div className="slide-title">{this.state.title}</div>}
            <div className="remaining-seconds" style={
                {'WebkitTextFillColor': remainingSecondsColor}
            }>{this.state.seconds}</div>
            <div className="slide-num">{this.state.slideNum}</div>
        </div>
        return (
            <div className="App">
                <header className="App-header">
                    {!this.state.started ? init : runningGame}
                </header>
            </div>)
    }
}

