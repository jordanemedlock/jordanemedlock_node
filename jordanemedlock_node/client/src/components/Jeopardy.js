import React, { Component } from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import './Jeopardy.css'

const AnsweredQuestion = (props) => {
    return (
        <div className="question answered" onClick={props.onClick}>
            <div>{props.answer}</div>
        </div>
    );
}

const OpenedQuestion = (props) => {
    return (
        <div className="question opened" onClick={props.onClick}>
            <div>{props.question}</div>
        </div>
    );
}

const UnopenedQuestion = (props) => {
    return (
        <div className="question unopened" onClick={props.onClick}> 
            <div>${props.price}</div>
        </div>
    );
}

const EmptyQuestion = (props) => {
    return null;
}

const Question = (props) => {
    if (!props.question.question) {
        return <EmptyQuestion />;
    } else if (!props.question.state || props.question.state === "unopened") {
        return <UnopenedQuestion price={props.question.price} onClick={props.onClick}/>;
    } else if (props.question.state === "opened") {
        return <OpenedQuestion question={props.question.question} onClick={props.onClick}/>;
    } else if (props.question.state === "answered") {
        return <AnsweredQuestion answer={props.question.answer} onClick={props.onClick}/>;
    }
}

const Category = (props) => {
    return (
        <div className="category">
            {props.category}
        </div>
    );
}

const TeamButtons = (props) => {
    let teamsButtons = props.teams.map((team, index) => (
        <div className={`${index == 0 && "offset-md-2"} col-md-1 jpdy-btn`} key={index} onClick={() => props.handleTeamWon(index)}>{team.name}</div>
    ));
    return (
        <>
            {teamsButtons}
            <div className="col-md-1 jpdy-btn" onClick={props.handleNoTeamWon}>No Team</div>
        </>
    );
}

const AnswerBox = (props) => {
    return (
        <>
            <div className="row">
                <h2 className="col-md-12">{props.answer}</h2>
            </div>
            <div className="row">
                <TeamButtons teams={props.teams} handleTeamWon={props.handleTeamWon} handleNoTeamWon={props.handleNoTeamWon} />
            </div>
        </>
    );
}

export class Jeopardy extends Component {
    static displayName = Jeopardy.name;

    constructor(props) {
        super(props);
        this.state = {
            open: null,
            teams: [
                {
                    name: "Group 1",
                    score: 0,
                },
                {
                    name: "Group 2",
                    score: 0,
                },
                {
                    name: "Group 3",
                    score: 0,
                },
                {
                    name: "Group 4",
                    score: 0,
                },
                {
                    name: "Group 5",
                    score: 0,
                },
                {
                    name: "Group 6",
                    score: 0,
                },
                {
                    name: "Group 7",
                    score: 0,
                },
                {
                    name: "Group 8",
                    score: 0,
                },
            ],
            board: [
                {
                    category: "Avengers",
                    questions: [
                        {
                            question: "How many Infinity Stones are there in the MCU?",
                            answer: "6: Space (Blue), Mind (Yellow), Power (Purple), Time (Green), Reality (Red), and Soul (Orange)",
                            price: 100,
                        },
                        {
                            question: "What movie did Thanos first appear in?",
                            answer: "Avengers",
                            price: 500,
                        },
                        {
                            question: "How many Spider-Man movies have been released in the US since 2000?",
                            answer: "8: Spider-Man 1-3, Amazing Spider-Man 1-2, Spiderman: Homecomming, Spider-Man: Far from Home, Into the Spider-Verse",
                            price: 1000,
                        },
                    ]
                },
                {
                    category: "Science",
                    questions: [
                        {
                            question: "The earth has three layers of varying temperatures and materials. What are these layers?",
                            answer: "Crust, mantle and core",
                            price: 100,
                        },
                        {
                            question: "What part of the brain deals with hearing and language?",
                            answer: "Temporal Lobe",
                            price: 500,
                        },
                        {
                            question: "What are the only two egg-laying mammals in the world today?",
                            answer: "Echidna and Platypus",
                            price: 1000,
                        },
                    ]
                },
                {
                    category: "Hiking",
                    questions: [

                        {
                            question: "How many leaves are in a cluster on a poison ivy plant?",
                            answer: "3",
                            price: 100,
                        },
                        {
                            question: "What should a hiker do if they encounter a grizzly bear?",
                            answer: "Lie face-down and cover your head with your arms/play dead",
                            price: 500,
                        },
                        {
                            question: "What is the longest hiking train in North America?",
                            answer: "American Discovery Trail",
                            price: 1000,
                        },
                    ]
                },
                {
                    category: "Biking",
                    questions: [
                        {
                            question: "What is the core of a bicycle called?",
                            answer: "The frame",
                            price: 100,
                        },
                        {
                            question: "What were the early bicycles that featured huge front wheels and small rear wheels called?",
                            answer: "Penny-Farthing Bicycles",
                            price: 500,
                        },
                        {
                            question: "When was the first pedal powered bicycle invented?",
                            answer: "1866 (Will accept late 19th century)",
                            price: 1000,
                        },
                    ]
                },
                {
                    category: "Cooking",
                    questions: [
                        {
                            question: "What ingredients are used in \"Ants on a log\"",
                            answer: "Celery peanut butter and raisins",
                            price: 100,
                        },
                        {
                            question: "What's the difference between a convection oven and a conventional oven?",
                            answer: "A convection oven uses a fan.",
                            price: 500,
                        },
                        {
                            question: "Which of these is an 18th-century word for flattening chicken for quick cooking?",
                            answer: "Spatchcocking",
                            price: 1000,
                        },
                    ]
                }
            ]
        };
    }

    flippedBoard = () => {
        let rows = []
        let keepGoing = true;
        for (let y = 0; keepGoing; y++) {
            let row = []
            let rowHasElem = false;
            for (let x = 0; x < this.state.board.length; x++) {
                let cat = this.state.board[x];
                if (y < cat.questions.length) {
                    row.push(cat.questions[y]);
                    rowHasElem = true;
                } else {
                    row.push({});
                }
            }
            if (rowHasElem) {
                rows.push(row);
            } else {
                keepGoing = false;
            }
        }
        return rows;
    }

    questionClicked = (rowNum, colNum, question) => {
        this.setState((state) => ({
            ...state,
            open: {
                rowNum,
                colNum,
                question
            }
        }));
    }

    handleHideModal = () => {
        this.setState((state) => ({
            ...state,
            open: null,
            board: state.board.map((col, colIndex) => ({
                ...col,
                questions: col.questions.map((q, rowIndex) => (
                    colIndex == state.open.colNum && rowIndex == state.open.rowNum ? {} : q
                ))
            }))
        }))
    }

    handleClickModal = () => {
        this.setState((state) => ({
            ...state,
            open: {
                ...state.open,
                answered: true
            }
        }))
    }
    handleTeamWon = (index) => {
        this.setState((state) => ({
            ...state,
            teams: state.teams.map((team, teamIndex) => ({
                ...team,
                score: team.score + (teamIndex == index ? state.open.question.price : 0)
            }))
        }))
        this.handleHideModal()
    }

    render() {
        let flippedBoard = this.flippedBoard();
        let rows = flippedBoard.map((row, rowNum) =>
            <div className="row" key={rowNum}>
                {row.map((value, colNum) =>
                    <div className={`col-md-2 ${colNum===0 && "offset-md-1"}`} key={colNum}>
                        <Question question={value} onClick={() => this.questionClicked(rowNum, colNum, value)} />
                    </div>
                )}
            </div>
        );
        return (
            <div id="jeopardy-container">
                <h1 className="jeopardy-header">Jeopardy!</h1>
                <div className="row">
                    <div className="col-md-10">
                        <div className="row">
                            {this.state.board.map((col, index) =>
                                <div className={`col-md-2 ${index == 0 && "offset-md-1"}`} key={index}>
                                    <Category category={col.category} />
                                </div>
                            )}
                        </div>
                        {rows}
                    </div>
                    <div className="col-md-2">
                        <div className="category">
                            Teams
                        </div>
                        {this.state.teams.map((team, index) => (
                            <div key={index} className="row team-row">
                                <div className="col-md-6">{team.name}: </div>
                                <div className="col-md-6">${team.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <Modal className="jeopardy" isOpen={this.state.open != null} onExit={this.handleHideModal} size="lg">
                    <ModalBody>
                        <div className="row">
                            <h1 className="question-header col-md-12">{this.state.open && this.state.open.question.question}</h1>
                        </div>
                        <div className="row">
                            <div className="offset-md-2 col-md-8 jpdy-btn" onClick={this.handleClickModal}>Show Answer</div>
                        </div>
                        {this.state.open && this.state.open.answered && (
                            <AnswerBox
                                answer={this.state.open.question.answer}
                                teams={this.state.teams}
                                handleTeamWon={this.handleTeamWon}
                                handleNoTeamWon={this.handleHideModal}
                            />
                        )}
                    </ModalBody>
                </Modal>
                
            </div>
        );
    }
}