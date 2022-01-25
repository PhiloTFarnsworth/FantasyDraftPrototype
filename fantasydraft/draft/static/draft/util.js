const { useState, useEffect } = React;

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'
const ROUNDS = 12
const TEAMS = ['Tears of a Brown', 
'Circle the Wagons', 
'Motor City Kitties', 
'Monday Morning Quarterbacks',
'Mile High Club',
'Relocated Raiders',
'Pottsville Maroons',
'Montreal Expos',
'Country Roads, Take Mahomes',
'The 12th Man',
'Gang Green',
'Tom Brady Spice',
'Good Glavin',
"America's Team"]

//Bootstrap colors to keep a cohesive theme
const BS_SUCCESS = '#198754'
const BS_WARNING = '#ffc107'
const BS_PRIMARY = '#0d6efd'
const BS_SECONDARY = '#6c757d'



function treatModelName(stringList) {
    stringList.pop()
    let newList = []
    stringList.map(string => newList.push(string.charAt(0).toUpperCase() + string.slice(1)))
    let newString = newList.join(' ')
    return newString
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function MyError(props) {
    if (props.error === '') {
        return null
    }
    return(
        <div className="alert alert-warning" role="alert">
            <div className='row'>
            <div className='col-6'><h6 className='display-6'>{props.error}</h6></div>
            <div className='col d-flex justify-content-end'><button onClick={props.onClick} className='btn btn-close'></button></div>
            </div>
        </div>
    )
}

function MySuccess(props) {
    if (props.success === '') {
        return null
    } 
    return(
        <div className="alert alert-success" role="alert" >
        <div className='row'>
        <div className='col-6'><h6 className='display-6'>{props.success}</h6></div>
        <div className='col d-flex justify-content-end'><button onClick={props.onClick} className='btn btn-close'></button></div>
        </div>
    </div>
    )
}