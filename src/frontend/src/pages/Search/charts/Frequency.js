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
          colors:['#fcba03', '#ba452b', '#d6c211','#76d60f','#12dbca','#0f49db','#9f8aa8','#db0fa8','#4d494d', '#825344', '#62804e', '#1a3463' ],
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
