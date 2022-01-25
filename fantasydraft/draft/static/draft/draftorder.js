'use strict';
const { useState } = React;

function SlotBox(props) {
    return(
        <table className='table-responsive' style={{'background': props.highlight}}>
            <thead>
                <tr><td colSpan='3'>{props.team}</td></tr>
            </thead>
            <tbody>
                <tr><td>{props.round}</td><td>-</td><td>{props.pick}</td></tr>
            </tbody>
        </table>
    )
}
//What we want here is a bar across the bottom which both indicates who is in the draft as well as who is on the clock to make
//a pick.  
function DraftOrder(props) {

    const HandleFocus = (e) => {
        e.preventDefault()
        props.shiftFocus({'context': 'team', 'team': e.currentTarget.attributes.team.value})
    }

    const numTeams = props.teams.length
    const draftMax = numTeams * ROUNDS
    let draftData = []

    if (props.currentPick >= draftMax) {
        return null
    }
    for (let i = props.currentPick; i < props.currentPick + 5; i++) {
        let round = Math.floor(i/numTeams) + 1
        let pick = (i % numTeams) + 1
        let highlight = ''
        if (i < draftMax) {
            if (i === props.currentPick) {
                highlight = BS_SUCCESS
                if (!props.teamStatus[props.history[i].team].active) {
                    highlight = BS_WARNING
                }
            } else {
                highlight = BS_PRIMARY
                if (!props.teamStatus[props.history[i].team].active) {
                    highlight = BS_SECONDARY
            }
            }
        }
        if (i < draftMax) {
            draftData.push({'pick': pick, 'round': round, 'team': props.history[i].team, 'highlight': highlight})
        }
    }

    return(
        <div className='draftBar'>
            <div className='orderRow'>
                    {draftData.map(data => 
                    <div className='orderCol' key={data.team + 'order' + data.round + data.pick} onClick={HandleFocus} team={data.team}><SlotBox pick={data.pick} round={data.round} team={data.team} highlight={data.highlight}/></div>)}
            </div>
        </div>
    )
}

//Predraft will just have share links and a preview of the first round of picks.
function PredraftOrder(props) {
    if (props.commissioner !== '') {
        return(
            <table className='table'>
                <thead><tr><th>Team</th><th>Share Link</th></tr></thead>
                <tbody>
                    {props.teams.map((team, index) => props.teamStatus[team].active ? 
                        <tr key={team + '_' + index}><td style={{'background':BS_SUCCESS}}>{team}</td><td>{props.teamStatus[team].manager}</td></tr>: 
                        <tr key={team + '_' + index}><td style={{'background':BS_WARNING}}>{team}</td><td>{props.teamStatus[team].manager === 'No owner'? window.location.href + 'draft/' + props.leagueID + '/' + team.split(' ').join('_'):props.teamStatus[team].manager}</td></tr>)}
                </tbody>
            </table>
        )
    } 

    return(
        <table className='table'>
            <thead><tr><th>Team</th><th>Owner</th></tr></thead>
            <tbody>
            {props.teams.map((team, index) => props.teamStatus[team].active ? 
                        <tr key={team + '_' + index}><td style={{'background':BS_SUCCESS}}>{team}</td>{props.teamStatus[team].manager}<td></td></tr>: 
                        <tr key={team + '_' + index}><td style={{'background':BS_WARNING}}>{team}</td><td>{props.teamStatus[team].manager}</td></tr>)}
            </tbody>
        </table>
    )
}
