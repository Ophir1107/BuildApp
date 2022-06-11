
import React, { Component } from 'react'
import { Bar, defaults, } from 'react-chartjs-2'



export class StackedBarChart extends Component {

  get cardsPerMemberData() {
    const { cardsPerMemberMap } = this.props.chartsData
    return {
        labels: Object.keys(cardsPerMemberMap),
        datasets: [
            {
                data: Object.values(cardsPerMemberMap),
                backgroundColor: this.state.gradientColor,
                barThickness: 20
            }
        ]
    }
  }


  get cardsPerMemberMap() {
    const { members } = this.props.board
    const allCards = this.allCards
    const cardsPerMemberMap = members.reduce((acc, member) => {
        if (!acc[member.fullname]) acc[member.fullname] = 0
        const cardsPerMemberCount = allCards.reduce((acc, card) => {
            const memberIdx = card.members.findIndex(currMember => currMember._id === member._id)
            if (memberIdx > -1 && !card.isDone) acc++
            return acc
        }, 0)
        acc[member.fullname] = cardsPerMemberCount
        return acc
    }, {})
    return cardsPerMemberMap
  }


  get cardsPerMemberData() {
    const { cardsPerMemberMap } = this.props.chartsData
    return {
        labels: Object.keys(cardsPerMemberMap),
        datasets: [
            {
                data: Object.values(cardsPerMemberMap),
                backgroundColor: this.state.gradientColor,
                barThickness: 20
            }
        ]
    }
}


  render() {

    return (
        <div className="board-charts flex wrap justify-center align-center">
            <div className=" flex column">
                <h3>Tasks per member</h3>
                <div className="chart">
                    <Bar
                        data={this.cardsPerMemberData}
                        options={{
                            indexAxis: 'y',
                            maintainAspectRatio: false,
                            legend: {
                                labels: {
                                    // This more specific font property overrides the global property
                                    fontColor: 'black'
                                }
                            }
                        }
                        }


                    />
                </div>
            </div>
            <div className="flex column">
                <h3>Tasks per list</h3>
                <div className="chart">
                    <Bar
                        data={this.cardsPerListData}
                        options={{
                            indexAxis: 'y',
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>
        </div>
    )
  }



}