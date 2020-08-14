import io from "socket.io-client"

const apiUrl = "http://localhost:3000/api/"

export const createGame = (playerName) => {
    const url = apiUrl + 'game/create/' + playerName;

    return fetch(url)
        .then(res => res.json());
}


export const joinGame = (gameNumber, playerName) => {
    const url = apiUrl + 'game/join/' + gameNumber + '/' + playerName;

    return fetch(url)
        .then(res => res.json());
}