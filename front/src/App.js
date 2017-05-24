import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactTable from 'react-table';
//import ReactPlayer from 'react-player';
//import Reactable from 'reactable';

import general_methods from './scripts/general_methods';

//const Table = Reactable.Table;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoList: [],
            currentVideoIndex: 0,
            currentVideoTitle: '',
            currentUrl: 'https://www.youtube.com/watch?v=q6EoRBvdVPQ'
        };
    }

    getVideoList() {
        general_methods.getVideoList((response) => {
            if (response !== false) {
                this.setState({videoList: response});
            }
        })
    }

    clickVideo(title) {
        this.setState({currentUrl: general_methods.backendUrl + '/getWatchVideo?videoTitle=' + title});

    }

    componentDidMount() {
        this.getVideoList();
        this.setState({
            currentVideoTitle: this.state.videoList[0],
            currentUrl: general_methods.backendUrl + '/getWatchVideo?videoTitle=' + this.state.currentVideoTitle
        })
    }

    render() {


        let data = [];

        for (let i in this.state.videoList) {
            data.push({
                name: this.state.videoList[i]
            })
        }

        const columns = [{
            Header: 'Name',
            accessor: 'name' // String-based value accessors!
        }]

        return (
            <div className="App">
                <div className="App-header">
                    <a href="/"> <img src={logo} className="App-logo" alt="logo"/></a>
                    <h2>Welcome to VideoStream</h2>
                </div>

                {/*

                <Table className="table" data={data}
                       itemsPerPage={4}
                       filterable={['name']}
                />

                */}

                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize="5"
                    filterable={true}
                    defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id
                        return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) !==-1 : true
                    }}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: e => {
                                console.log('It was in this row:', rowInfo.row.name);
                                this.clickVideo(rowInfo.row.name);
                            }
                        }
                    }}
                />

                <video
                    src={this.state.currentUrl}
                    controls={true}
                    width="640" height="480"
                />

            </div>
        )
            ;
    }
}

export default App;
