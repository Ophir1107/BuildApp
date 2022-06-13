
// import React, { Component } from 'react'
// import { Bar, defaults, } from 'react-chartjs-2'



// export class BoardCharts extends Component {

//     state = {
//         gradientColor: '',
//     }

//     componentDidMount() {
//         defaults.font.size = 16
//         defaults.color = '#fff'
//         defaults.plugins.legend.display = false
//         setTimeout(() => this.setState({ gradientColor: this.getGradientColor() }), 50)
//     }

//     get cardsPerMemberData() {
//         const { cardsPerMemberMap } = this.props.chartsData
//         return {
//             labels: Object.keys(cardsPerMemberMap),
//             datasets: [
//                 {
//                     data: Object.values(cardsPerMemberMap),
//                     backgroundColor: this.state.gradientColor,
//                     barThickness: 20
//                 }
//             ]
//         }
//     }


//     get cardsPerLabelData() {
//         const { cardsPerLabelMap } = this.props.chartsData
//         let labels = [];
//         let values = [];
//         const sortedLabels = Object.entries(cardsPerLabelMap).sort((labelA, labelB) => labelB[1].count - labelA[1].count).slice(0, 5)
//         sortedLabels.forEach(label => {
//             labels.push(label[0])
//             values.push(label[1].count)
//         })
        
//         return {
//             labels,
//             datasets: [
//                 {
//                     data: values,
//                     backgroundColor: this.state.gradientColor,
//                     barThickness: 20,
//                     borderWidth: 0,

//                 },
//             ],
//         }
//     }


//     get cardsPerListData() {
//         const { cardsPerListMap } = this.props.chartsData
//         return {
//             labels: Object.keys(cardsPerListMap),
//             datasets: [
//                 {
//                     data: Object.values(cardsPerListMap),
//                     backgroundColor: this.state.gradientColor,
//                     borderWidth: 0,
//                     barThickness: 20
//                 },
//             ],
//         }
//     }

//     getGradientColor(canvas = this.canvas) {
//         if (!canvas) return
//         const ctx = canvas.getContext("2d");
//         const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 300, 0)
//         gradient.addColorStop(0, '#4fa8f8');
//         gradient.addColorStop(0.3, '#2fb4f5');
//         gradient.addColorStop(0.6, '#23beee');
//         gradient.addColorStop(0.85, '#37c7e5');
//         gradient.addColorStop(1, '#55ceda');
//         return gradient


//         // #4fa8f8, #2fb4f5, #23beee, #37c7e5, #55ceda);
//     }
//     render() {

//         return (
//             <div className="board-charts flex wrap justify-center align-center">
//                 <div className=" flex column">
//                     <h3>Tasks per label</h3>
//                     <div className="chart">
//                         <Bar
//                             data={this.cardsPerLabelData}
//                             options={{
//                                 maintainAspectRatio: false,

//                                 title: {
//                                     display: true,
//                                     text: 'Tasks per label',
//                                 },
//                                 legend: {
//                                     display: false,
//                                 },
//                                 cutout: '60%',
//                             }}
//                             ref={(canvas) => { this.canvas = canvas }}
//                         />
//                     </div>
//                 </div>
//                 <div className="flex column">
//                     <h3>Tasks per member</h3>
//                     <div className="chart">
//                         <Bar
//                             data={this.cardsPerMemberData}
//                             options={{
//                                 indexAxis: 'y',
//                                 maintainAspectRatio: false,
//                                 legend: {
//                                     labels: {
//                                         // This more specific font property overrides the global property
//                                         fontColor: 'black'
//                                     }
//                                 }
//                             }
//                             }


//                         />
//                     </div>
//                 </div>
//                 <div className="flex column">
//                     <h3>Tasks per list</h3>
//                     <div className="chart">
//                         <Bar
//                             data={this.cardsPerListData}
//                             options={{
//                                 indexAxis: 'y',
//                                 maintainAspectRatio: false
//                             }}
//                         />
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

// import React, { Component } from "react";
// import {View,StyleSheet,Text,Dimensions} from 'react-native';
// import { Provider,Appbar} from 'react-native-paper';
// import { StackedBarChart} from "react-native-chart-kit";
// // export class BoardCharts extends Component {
// const BoardCharts = () => {

//   const data = {
//     labels: ["Item1", "Item2"],
//     legend: ["L1", "L2", "L3"],
//     data: [
//       [60, 60, 60],
//       [30, 30, 60]
//     ],
//     barColors: ["#F2E96D", "#E9D40B", "#B6AB0E"]
//   };

//   const _goBack = () => console.log('Went back');

//   const _handleSearch = () => console.log('Searching');

//   const _handleMore = () => console.log('Shown more');

//   return (
//         < StackedBarChart
//           data={data}
//           width={340}
//           height={220}
//           strokeWidth={16}
//           radius={20}
//            chartConfig={{
//             backgroundColor: "#218838",
//             backgroundGradientFrom: "#e2e2e2",
//             backgroundGradientTo: "#e2e2e2",
//             decimalPlaces: 2, // optional, defaults to 2dp
//             color: (opacity = 1) => `rgba(13, 136, 56, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0,0, ${opacity})`,
//             style: {
//               borderRadius: 16
//             },
//             propsForDots: {
//               r: "6",
//               strokeWidth: "2",
//               stroke: "#218838"
//             }
//           }}
//           style={{
//             marginVertical: 8,
//             borderRadius: 16
//           }}
//           hideLegend={false}
//         />
//   );
// };


// const styles = StyleSheet.create({
//   title:{
//     fontSize: 20,
//     textAlign:'center',
//   },
//   mainbox:{
//     textAlign:'center',
//     margin: 15,
//     justifyContent: 'space-between',
//   },
// });
// export default BoardCharts;