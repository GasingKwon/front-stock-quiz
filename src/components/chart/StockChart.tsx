'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockChart({ data }) {
    const processedData = data?.map(item => ({
        date: new Date(item.date).toLocaleDateString('ko-KR', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '').trim(), // 날짜 포맷을 간결하게 변환
        price: Math.floor(parseFloat(item.close_price)) // close_price를 정수로 변환
    })) || [];

    const startDate = processedData[0]?.date;
    const endDate = processedData[processedData.length - 1]?.date;
    const xAxisLabel = startDate && endDate ? `${startDate} ~ ${endDate}` : '';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={processedData}
                margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 50,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    angle={-30}
                    textAnchor="middle"
                    height={50}
                    interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip
                    formatter={(value) => [`${Math.floor(value).toLocaleString()}원`, '주가']}
                    labelFormatter={(label) => label}
                />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
