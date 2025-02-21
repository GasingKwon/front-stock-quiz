import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Customized
} from "recharts";

const CandleChart = ({ chartData }) => {
  const [data, setData] = useState(chartData);
  useEffect(() => {
      setData(chartData); // 새로운 데이터를 반영
  }, [chartData]); // chartData가 변경될 때 업데이트

  if (!chartData?.length) return null;

  const [hoveredData, setHoveredData] = useState(null);

  const processedData = chartData.map(data => ({
    date: new Date(data.date).toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    }),
    open: parseFloat(data.open_price),
    high: parseFloat(data.high_price),
    low: parseFloat(data.low_price),
    close: parseFloat(data.close_price),
    isUp: parseFloat(data.close_price) >= parseFloat(data.open_price)
  }));

  const minPrice = Math.floor(Math.min(...processedData.map(d => d.low))); // 정수형 변환
  const maxPrice = Math.ceil(Math.max(...processedData.map(d => d.high))); // 정수형 변환
  const padding = Math.ceil((maxPrice - minPrice) * 0.1);

  return (
    <div className="w-full h-[300px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={processedData}
          margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fontSize: 12 }}
            allowDecimals={false} // 소수점 제거
            tickFormatter={(value) => Math.round(value).toLocaleString()} // 정수형 변환
          />
          {/* 툴팁 */}
          <Tooltip
            content={({ active }) => {
              if (!active || !hoveredData) return null;
              return (
                <div className="bg-white p-2 border rounded shadow text-xs">
                  <p>{hoveredData.date}</p>
                  <p>시가: {hoveredData.open.toLocaleString()}</p>
                  <p>고가: {hoveredData.high.toLocaleString()}</p>
                  <p>저가: {hoveredData.low.toLocaleString()}</p>
                  <p>종가: {hoveredData.close.toLocaleString()}</p>
                </div>
              );
            }}
          />
          {/* 투명한 Bar 추가 (이벤트 감지를 위해 유지) */}
          <Bar
            dataKey="high"
            fill="transparent"
            barSize={20}
            onMouseEnter={(e) => setHoveredData(e)}
            onMouseLeave={() => setHoveredData(null)}
          />
          {/* 캔들 차트 렌더링 */}
          <Customized component={({ height, width, xAxisMap, yAxisMap }) => {
            const xAxis = Object.values(xAxisMap)[0]; 
            const yAxis = Object.values(yAxisMap)[0]; 
            const xOffset = xAxis.x; 
            const chartWidth = xAxis.width; 
            const candleWidth = Math.min(chartWidth / processedData.length * 0.6, 15);
            const yScale = yAxis.scale;

            return (
              <g>
                {processedData.map((data, index) => {
                  const x = xOffset + (chartWidth / processedData.length) * (index + 0.5);
                  const color = data.isUp ? "#26A69A" : "#EF5350";

                  // Y 좌표 변환
                  const openY = yScale(data.open);
                  const closeY = yScale(data.close);
                  const highY = yScale(data.high);
                  const lowY = yScale(data.low);
                  const candleX = x - candleWidth / 2;
                  const wickX = x;

                  return (
                    <g key={index}>
                      {/* 심지 */}
                      <line x1={wickX} y1={highY} x2={wickX} y2={lowY} stroke={color} strokeWidth={1} />
                      {/* 캔들 몸통 */}
                      <rect
                        x={candleX}
                        y={Math.min(openY, closeY)}
                        width={candleWidth}
                        height={Math.max(Math.abs(closeY - openY), 1)}
                        fill={color}
                        stroke={color}
                        onMouseEnter={() => setHoveredData(data)}
                        onMouseLeave={() => setHoveredData(null)}
                      />
                    </g>
                  );
                })}
              </g>
            );
          }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChart;
