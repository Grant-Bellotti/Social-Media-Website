import React, { Component, useEffect} from 'react';
import io from "socket.io-client";
const socket = io.connect('http://localhost:3000')



class App extends React.Component {


    getHref(){
        let ref = window.location.pathname
        if(ref=='/')
        return('/api');
        else  
        return (window.location.pathname)
        }
        
    fetchHtml() {
        fetch(this.getHref())
        .then((response) => {
        return response.text();
        })
        .then((html) => {
        document.body.innerHTML = html
        })
    }

    getScript(){
        socket.on('welcome',function(data){
        (document.getElementById('realScript'));
        })
    }


    async componentDidMount(){
        this.getHref()
        this.fetchHtml()
    }

    render() {
        let test = this.getScript()
        return (
            <div>

            </div>
        )
    }
}


export default App;