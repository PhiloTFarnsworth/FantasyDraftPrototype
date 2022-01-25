'use strict';
const { useState, useEffect, useRef } = React;

function Draft(props) {
    //So My quick sketch suggests there is 5 major areas we need to design for the draft screen.  Starting at the bottom, we have a list of available
    //players, which we can display as a table with all their stats displayed.  On the right side, we'll have a bar which displays a timer for individual draft 
    //picks and the draft order.  Above the draft pool, there is an info-box, which will display information about a selected team, or 
    //information about a selected player or a recap of recent draft picks. So what becomes stateful on the top end?  Our draft pool, teams and draft order.  
    //timer auto drafts, so it probably belongs somewhere in the top end as well.
    const [draftPool, setDraftPool] = useState([])
    const [draftHistory, setDraftHistory] = useState([])
    const [statHeaders, setStatHeaders] = useState([])
    const [boardFocus, setBoardFocus] = useState('')
    const [playerFocus, setPlayerFocus] = useState({})
    const [teamFocus, setTeamFocus] = useState('')
    const [lastSort, setLastSort] = useState('')
    const [currentPick, setCurrentPick] = useState(0)
    const [active, setActive] = useState(false)
    const [teamStatus, setTeamStatus] = useState({})
    const [render, setRender] = useState(false)
    const draftSocket = useRef(null)

    //This useEffect populates some of our states once on load
    useEffect(() => {
        draftPrep()
        //So we're going to use a websocket to update the draft as it progresses.
        draftSocket.current = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/draft/'
            + props.leagueID
            + '/'
        );
        setRender(true)
    }, [])

    //This useEffect mostly controls our draft socket
    useEffect(() => {
        if (draftSocket !== null) {
            //We'll toggle status onopen and onclose of a draft socket, on receipt of these
            //sends we'll update the model and return the active teams in the draft
            draftSocket.current.onclose = (e) => {
                console.log('Websocket closed unexpectedly')
                //draftSocket.send(JSON.stringify({'type': 'status', 'team': props.teamControl, 'league': props.leagueID}))
            }
            draftSocket.current.onopen = (e) => {
                //on open we need to update status of player controlled teams.
                draftSocket.current.send(JSON.stringify({'type': 'status', 'team': props.teamControl, 'league': props.leagueID}))
            }
            draftSocket.current.onmessage = (e) => {
                //What we need is a way to handle multiple types of transmissions on the same websocket.
                //We should have a path for drafting, one for joining/leaving a draft instance and one for a chat?
                const data = JSON.parse(e.data)
                switch (data.type) {
                    case 'draft':
                        let players = JSON.parse(data.data)
                        //I think we're just going to pass the most immediate player selected
                        //and then update our draft history based on that.
                        let available = [...draftPool]
                        let historyUpdate = [...draftHistory]
                        historyUpdate[currentPick].player = players[players.length-1]
                        setDraftHistory(historyUpdate)
                        let index = available.findIndex(player => player.fields['name_code_FB'] === players[players.length-1].fields['name_code_FB'])
                        available.splice(index, 1)
                        setDraftPool(available)
                        let nextPick = currentPick + 1
                        setCurrentPick(nextPick)
                        shiftFocus('default')
                        props.onSuccess(historyUpdate[currentPick].team + ' has selected ' + historyUpdate[currentPick].player.fields.name)
                        break
                    case 'status':
                        setTeamStatus(data.data)
                        break
                    case 'start':
                        setActive(true)
                        break
                    case 'error':
                        console.error(data.data)
                        props.onError(data.data)
                        break
                }
            }
            
            //If the user closes the window, it will reset the status, but we don't have a solution for a failure of the websocket itself.  yet.
            window.onbeforeunload = () => {
                draftSocket.current.onClose = () => {}
                draftSocket.current.send(JSON.stringify({'type': 'status', 'team': props.teamControl, 'league': props.leagueID}))
                draftSocket.current.close()
            }
        }
    }, [draftSocket, draftHistory, currentPick, draftPool, active, teamStatus, render])

    function draftPrep() {
        populateStatus()
        fetchDraftPool()
        generateHistory()
        if (props.locked === true) {
            setActive(true)
        }
    }
    //SelectPlayer takes a player and sends it back to our database to update our draft history.
    //What do we need to update our history?  We need the player, team, leagueID
    function selectPlayer(playerID) {
        //We'll have to pass in the player's id, but we can grab the team by checking the current pick,
        //then checking our history for who is picking at that slot.
        let team = draftHistory[currentPick].team
        draftSocket.current.send(JSON.stringify({'type': 'draft', 'player': playerID, 'team': team, 'league': props.leagueID}))
    }

    // function commishAutoDraft(team) {
    //     let pool = [...draftPool]
    //     pool.sort((a,b) => b.fields[fantasy_VBD_VBD] - a.fields[key])
    //     draftSocket.current.send(JSON.stringify({'type': 'draft', 'player': pool[0].pk, 'team': team, 'league': props.leagueID}))
    // }

    function fetchDraftPool() {
        fetch("/class", {
            
        })
        .then(response => response.json())
        .then(data => {
            let draftClass = []
            let headers = []    
            data.map((player, index) => {
                draftClass.push(player)
                if (index === 0) {
                    Object.keys(player.fields).map((header) =>
                        headers.push(header)
                    )
                }
            })
            setStatHeaders(headers)
            //For a final touch, we need to remove any players already selected.  We already have a list in props.history, so simply run through those
            //players and remove them from draftClass
            props.history.map((draftedPlayer) => {
                let index = draftClass.findIndex(player => player.fields['name_code_FB'] === draftedPlayer.fields['name_code_FB'])
                draftClass.splice(index, 1)
            })
            setDraftPool(draftClass)
        })
    }

    function shiftFocus(focusable) {
        if (focusable.context === 'player') {
            setBoardFocus('player')
            setPlayerFocus(focusable.player)
        } else if (focusable.context === 'team') {
            setBoardFocus('team')
            setTeamFocus(focusable.team)
            setPlayerFocus({})
        } else {
            //Return to base draft board
            setBoardFocus('summary')
            setPlayerFocus({})
        }
        return null
    }

    function sortDraftPool(header) {
        let sortedPool = [...draftPool]
        for (const [key, value] of Object.entries(draftPool[0].fields)) {
            if (key === header) {
                let chars = String(value).toLowerCase().split('')
                if (ALPHA.includes(chars[0])) {
                    // Alpha sort
                    if (lastSort !== header) {
                        sortedPool.sort((a,b) => a.fields[key].toString().localeCompare(b.fields[key].toString()))
                        setLastSort(header)
                    } else {
                        sortedPool.sort((a,b) => b.fields[key].toString().localeCompare(a.fields[key].toString()))
                        setLastSort('')
                    }
                    setDraftPool(sortedPool)
                } else {
                    // Number sort
                    if (lastSort !== header) {
                        sortedPool.sort((a,b) => b.fields[key] - a.fields[key])
                        setLastSort(header)
                    } else {
                        sortedPool.sort((a,b) => a.fields[key] - b.fields[key])
                        setLastSort('')
                    }
                    setDraftPool(sortedPool)
                }
                break
            }
        }    
    }

    //For my own ease, we're going to generate a blank version of the draft, with all slots assigned to teams, and then 
    //we'll pass players into the draft history state as we go along.  
    function generateHistory() {
        //So how do? Well, we need the number of teams and rounds, and then we assign them to a list of objects.
        let history = []
        let progress = props.history.length
        if (progress > 0) {
            setActive(true)
            setCurrentPick(progress)
        }
        let assigned = 0
        for (let i = 0; i < ROUNDS; i++) {
            if (i % 2 === 0) {
                for (let j = 0; j < props.teams.length; j++){
                    history.push({
                        'round': i+1, 
                        'pick': j+1, 
                        'team': props.teams[j], 
                        'player': assigned < progress ? props.history[assigned] : 'tbd' 
                        })
                        assigned = assigned + 1
                }
            } else {
                for (let j = props.teams.length - 1; j > -1; j--){
                    history.push({'round': i+1, 
                    'pick': props.teams.length - j, 
                    'team': props.teams[j], 
                    'player': assigned < progress ? props.history[assigned] : 'tbd', 
                    })
                    assigned = assigned + 1
                }
            }
        }
        setDraftHistory(history)
        shiftFocus({'context': 'summary'})
    }

    //Populate team status
    function populateStatus() {
        let initStatus = {}
        props.teams.map((team, index) => initStatus[team] = {'active': false, 'manager': props.managers[index]})
        setTeamStatus(initStatus)
    }

    function startDraft() {
        setActive(true)
        draftSocket.current.send(JSON.stringify({'type': 'start', 'league': props.leagueID}))
    }

    
    //We'll pass an active and only render draft order, which will provide us with the links to join a league.
    if (render) {
        if (active === false) {
            return (
                <div>
                    <PredraftOrder commissioner={props.commissioner} 
                        teams={props.teams} 
                        teamStatus={teamStatus} 
                        leagueID={props.leagueID} 
                        managers={props.managers} />
                    {props.commissioner === props.teamControl ? <button onClick={startDraft}>Start Draft</button> : ''}
                </div>
            )
        }
        if (draftPool.length > 0) {
            return(
                <div className='container'>
                    <div className='row'>
                        <DraftBoard 
                            focus={boardFocus} 
                            history={draftHistory} 
                            shiftFocus={shiftFocus} 
                            playerFocus={playerFocus}
                            teamFocus={teamFocus} 
                            selectPlayer={selectPlayer}
                            currentPick={currentPick}
                            teams={props.teams} 
                            teamControl={props.teamControl}
                            managers={props.managers} />
                    </div>
                    <div className='row'>
                        {currentPick >= props.teams.length * ROUNDS ? '' :
                        <DraftPool players={draftPool} 
                            history={draftHistory} 
                            headers={statHeaders} 
                            tableSort={sortDraftPool} 
                            shiftFocus={shiftFocus} />}
                    </div>
                    <div className='row'>
                        <DraftOrder currentPick={currentPick} 
                            teams={props.teams} 
                            teamStatus={teamStatus} 
                            history={draftHistory} 
                            shiftFocus={shiftFocus}/>
                    </div>
                </div>
            )
        }
    }
    return null
}
