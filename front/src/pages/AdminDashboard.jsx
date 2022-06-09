import React, { Component } from 'react'
import { connect } from 'react-redux'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import { ScreenOverlay } from '../cmps/ScreenOverlay'
import AssignmentIcon from '@material-ui/icons/Assignment';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import { ReactComponent as ExclamationIcon } from '../assets/img/icons/exclamation-lg.svg'
import { ReactComponent as ChartIcon } from '../assets/img/icons/chart.svg'
import { BoardCharts } from '../cmps/BoardCharts'
import { CircularProgressbar } from 'react-circular-progressbar';
import { Loader } from '../cmps/Loader'
import 'react-circular-progressbar/dist/styles.css';
import StackedBarChart from '../cmps/StackedBarChart';


class _AdminDashboard extends Component {

    state = {
        chartsData: null
    }
    render() {
        const { chartsData } = this.state
        return (
            <>

                <div className="StackedBarChart">
                    <StackedBarChart>

                    </StackedBarChart>

                </div>

            
            </>
        )
    }
}
function mapStateToProps(state) {
    return {
        boards: state.boardModule.boards,
    }
}

export const AdminDashboard = connect(mapStateToProps, null)(_AdminDashboard)
