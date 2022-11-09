import React from 'react';
import ReactApexChart from 'react-apexcharts';

const FrequencyChart = (props) => {
    const {DATALIST} = props

    const config = {
          
        series: DATALIST.result,
        options: {
          chart: {
            type: 'bar',
            height: 700,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          //       yellow      red       pink     green      gray     blue      purple    brown    
          colors:['#fcba03','#ba452b','#f9b9fa','#76d60f','#dbd7db','#0f49db','#9f8aa8','#5e3d27',
                  '#a88734','#f72b02','#db0fa8','#27400a','#4d494d','#1a3463','#9f8aa8','#7a3405',
                  '#f7daab','#990202','#f558ce','#bffa78','#d4d2d4','#adcced','#9454c4','#40220e',
                ],
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: {
                total: {
                  enabled: true,
                  style: {
                    fontSize: '18px',
                    fontWeight: 900
                  }
                }
              }
            },
          },
          xaxis: {
            type: 'integer',
            categories: DATALIST.categories,
            title: {
                text: 'Years',
                style:{
                    fontSize: '18px',
                    fontWeight: 900
                },
            },
            labels:{
                style:{
                    fontSize: '18px',
                    fontWeight: 600
                },
            }
          },
          yaxis: {
            title: {
                text: 'Word Occurrence',
                style:{
                    fontSize: '18px',
                    fontWeight: 900
                }
            },
            labels:{
                style:{
                    fontSize: '18px',
                    fontWeight: 600
                },
            }
          },
          legend: {
            position: 'right',
            offsetY: 40,
            fontSize: '18px',
            fontWeight: 600
          },
          fill: {
            opacity: 1
          }
        },
    }

    return (
            <ReactApexChart options={config.options} series={config.series} type="bar" height={700} />
      );

}

export default FrequencyChart
