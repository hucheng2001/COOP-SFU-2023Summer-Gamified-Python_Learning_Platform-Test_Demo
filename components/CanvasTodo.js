import * as echarts from "echarts";
import { useRef } from "react";
import { useEffect } from "react";

export default function AchievementComponent(props) {
  const ref = useRef();
  useEffect(() => {
    console.log('echarts', echarts);
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(ref.current);
    // 绘制图表
    myChart.setOption({

      color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
      title: {
        text: 'Gradient Stacked Area Chart',
        show: false,
      },
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {}
        }
      },
      legend: {
        show: false,
        data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
        tooltip: {
          show: false
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            }
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#0087ED']
            }
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          color: '#fff',
          style: {
            color: '#fff',
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#0087ED'],
              width: 0,
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        }
      ],
      series: [
        {
          name: 'Line 1',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(128, 255, 165, 0.9)'
              },
              {
                offset: 1,
                color: 'rgba(1, 191, 236, 0.2)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: [140, 232, 101, 264, 90, 340, 250]
        },
      ]
    });
  }, [])

  return <div ref={ref} style={{ height: '240px' }} />
}
