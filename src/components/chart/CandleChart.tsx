import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Customized,
} from "recharts";

interface ChartDataItem {
  date: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
}

interface ProcessedChartDataItem extends ChartDataItem {
  // 원본 속성을 포함하면서 재가공한 속성 추가
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  isUp: boolean;
}

const CandleChart: React.FC<{ chartData: ChartDataItem[] }> = ({ chartData }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoveredData, setHoveredData] = useState<ProcessedChartDataItem | null>(null);

  if (!chartData?.length) return null;

  const processedData: ProcessedChartDataItem[] = chartData.map((data) => ({
    ...data, // 원본 속성 포함
    date: new Date(data.date).toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    }),
    open: Number(data.open_price) || 0,
    high: Number(data.high_price) || 0,
    low: Number(data.low_price) || 0,
    close: Number(data.close_price) || 0,
    isUp: Number(data.close_price) >= Number(data.open_price),
  }));

  const minPrice = Math.floor(Math.min(...processedData.map((d) => d.low)));
  const maxPrice = Math.ceil(Math.max(...processedData.map((d) => d.high)));
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
            allowDecimals={false}
            tickFormatter={(value) => Math.round(value).toLocaleString()}
          />
          {/* 툴팁 */}
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const hoveredItem = payload[0]?.payload as ProcessedChartDataItem | undefined;
              if (!hoveredItem) return null;
              // 상태 업데이트
              setHoveredData(hoveredItem);
              return (
                <div className="bg-white p-2 border rounded shadow text-xs">
                  <p>{hoveredItem.date}</p>
                  <p>시가: {hoveredItem.open_price.toLocaleString()}</p>
                  <p>고가: {hoveredItem.high_price.toLocaleString()}</p>
                  <p>저가: {hoveredItem.low_price.toLocaleString()}</p>
                  <p>종가: {hoveredItem.close_price.toLocaleString()}</p>
                </div>
              );
            }}
          />
          {/* 투명한 Bar (이벤트 감지용) */}
          <Bar
            dataKey="high"
            fill="transparent"
            barSize={20}
            onMouseEnter={(e) => {
              // Recharts 이벤트 객체에 payload가 있을 수 있으므로 type assertion 사용
              const { payload } = e as { payload?: ProcessedChartDataItem };
              if (payload) {
                setHoveredData(payload);
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          />
          {/* 캔들 차트 렌더링 */}
          <Customized
            component={({ xAxisMap, yAxisMap }) => {
              const xAxis = Object.values(xAxisMap)[0] as {
                x: number;
                width: number;
                scale: (value: number) => number;
              };
              const yAxis = Object.values(yAxisMap)[0] as {
                scale: (value: number) => number;
              };
              const xOffset = xAxis.x;
              const chartWidth = xAxis.width;
              const candleWidth = Math.min(
                (chartWidth / processedData.length) * 0.6,
                15
              );
              const yScale = yAxis.scale;

              return (
                <g>
                  {processedData.map((data, index) => {
                    const x =
                      xOffset + (chartWidth / processedData.length) * (index + 0.5);
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
                        <line
                          x1={wickX}
                          y1={highY}
                          x2={wickX}
                          y2={lowY}
                          stroke={color}
                          strokeWidth={1}
                        />
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
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChart;
