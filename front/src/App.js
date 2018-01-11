import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactTable from 'react-table';

//import ReactPlayer from 'react-player';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import general_methods from './scripts/general_methods';
import * as rester from './scripts/rester';

import {Collapse} from 'react-collapse';

import URL from 'url-parse';

//const Table = Reactable.Table;

class App extends Component {

    constructor(props) {

        const url = new URL(general_methods.backendUrl);
        //console.log(url.protocol);

        super(props);
        this.state = {
            videoList: [],
            currentVideoIndex: 0,
            currentVideoTitle: 0,
            currentVideoSubs: '',
            currentUrl: 'https://www.youtube.com/watch?v=q6EoRBvdVPQ',
            custom_back_type: url.protocol + '//',
            custom_back_ip: url.hostname,
            custom_back_port: url.port,
            menu_open: false,
            current_page: undefined
        };
    }

    getVideoList() {
        general_methods.getVideoList((response) => {
            if (response !== false) {
                this.setState({videoList: response});
            }
        })
    }

    refreshList() {
        console.log('getting refreshments');

        rester.refreshLists((response) => {
            if (response !== false) {
                console.log(response);
            }
        })
    }

    setBackendUrl() {
        //console.log(newUrl);
        general_methods.backendUrl = this.state.custom_back_type + this.state.custom_back_ip + (this.state.custom_back_port !== '' ? (':' + this.state.custom_back_port) : '');
        this.getVideoList();
    }

    clickVideo(title) {
        this.setState({
            currentUrl: general_methods.backendUrl + '/getWatchVideo?videoId=' + title,
            currentVideoSubs: general_methods.backendUrl + '/getVideoSubs?videoId=' + title
        });

    }

    componentDidMount() {
        this.getVideoList();
        this.setState({
            currentVideoTitle: this.state.videoList[0],
            currentUrl: general_methods.backendUrl + '/getWatchVideo?videoId=' + this.state.currentVideoTitle
        })
    }

    getRandomPage() {

        const total = parseInt(document.querySelector('.-totalPages').innerHTML, 0);
        const newPage = Math.random() * total;

        console.log('total: ' + total +
            '\nnext: ' + newPage);

        this.setState({current_page: newPage});
    }


    render() {

        const type_options = [
            {value: 'http://', label: 'http'},
            {value: 'https://', label: 'https'},
        ];

        let data = [];

        for (let i in this.state.videoList) {
            data.push({
                id: this.state.videoList[i].id,
                name: this.state.videoList[i].name
            })
        }

        const columns = [
            {
                Header: 'ID',
                accessor: 'id' // String-based value accessors!
            },
            {
                Header: 'Name',
                accessor: 'name' // String-based value accessors!
            }
        ];

        return (
            <div className="App">
                <div className="App-header">
                    <a href="/"> <img src={logo} className="App-logo" alt="logo"/></a>
                    <h2>Welcome to <b onClick={() => {
                        this.setState({menu_open: !this.state.menu_open})
                    }}>VideoStream</b>
                    </h2>
                </div>

                {/*

                 <Table className="table" data={data}
                 itemsPerPage={4}
                 filterable={['name']}
                 />

                 */}

                <Collapse isOpened={this.state.menu_open}>

                    <Select
                        className="dropDown"
                        name="form-field-name"
                        value={this.state.custom_back_type}
                        options={type_options}
                        onChange={(val) => {
                            this.setState({custom_back_type: val.value});
                        }}
                    />
                    <input className="Select-control" placeholder={this.state.custom_back_ip} onChange={(event) => {
                        this.setState({custom_back_ip: event.target.value});
                    }}/>
                    <input type="number" className="Select-control" placeholder={this.state.custom_back_port}
                           onChange={(event) => {
                               this.setState({custom_back_port: event.target.value});
                           }}/>
                    <br/>
                    <button className="button blue shield glossy" onClick={() => {
                        this.setBackendUrl()
                    }}>Set Backend URL
                    </button>

                    <hr/>


                    <button className="button pink shield glossy" onClick={() => {
                        this.refreshList()
                    }}>Refresh List
                    </button>

                </Collapse>


                <ReactTable
                    page={this.state.current_page}
                    data={data}
                    columns={columns}
                    defaultPageSize={5}
                    itemsPerPage={5}
                    filterable={true}
                    defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        //console.log('filtering: ');
                        //console.log(filter.value.split(' '));
                        //return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1 : true
                        return row[id] !== undefined ? general_methods.stringHasWords(String(row[id]), filter.value.split(' ')) : true
                    }}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: e => {
                                if (rowInfo !== undefined) {
                                    console.log('video requested:', rowInfo.row.id);
                                    this.clickVideo(rowInfo.row.id);
                                }
                                else {
                                    console.log('no video in that row!');
                                }
                            }
                        }
                    }}
                />

                <section id="videoArea">

                    <video
                        src={this.state.currentUrl}
                        controls={true}
                        width="640" height="480"
                    >
                    </video>
                    <p><a rel="noopener noreferrer" href={this.state.currentUrl} target="_blank">open in new tab</a></p>
                    <p onClick={() => {
                        this.getRandomPage();
                    }}>random page
                    </p>
                </section>

            </div>
        )
            ;
    }
}

export default App;
