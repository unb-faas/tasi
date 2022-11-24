import React from 'react';
import ReactApexChart from 'react-apexcharts';

const AnswersChart = (props) => {

            //       yellow      red       pink     green      gray     blue      purple    brown    
    const defaultColors = [
                    '#f7daab','#800000','#f558ce','#bffa78','#d4d2d4','#adcced','#9454c4','#40220e']
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)

    const {DATALIST} = props
    const config = {    
      series: DATALIST.series,
      options: {
        colors: defaultColors,
        labels: DATALIST.labels,
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '18px',
            colors: ['#757a7f']
        },
        },
        chart: {
          toolbar: {
            show: true
          },
          width: 200,
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270
          }
        },
        fill: {
          type: 'solid',
        },
        legend: {
          fontSize: '18px',
          formatter: (val, opts) => `${val} - ${opts.w.globals.series[opts.seriesIndex]}`
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    }
    
  

    return (
            <ReactApexChart options={config.options} series={config.series} type="donut" height={200} />
      );

}

export default AnswersChart
