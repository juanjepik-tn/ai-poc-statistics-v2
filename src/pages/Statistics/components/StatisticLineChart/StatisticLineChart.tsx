import { Card } from '@nimbus-ds/components';
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { abbreviateNumber } from '../../utils/abbreviateNumber';
import StatisticLineChartLegend from './StatisticLineChartLegend';
import StatisticLineChartTooltip from './StatisticLineChartTooltip';

export interface LineChartDataPoint {
  name: string;
  label?: string;
  value: number;
  secondaryValue?: number;
}

interface StatisticLineChartProps {
  values: LineChartDataPoint[];
  primaryColor: string;
  secondaryColor?: string;
  title?: string;
  primaryName: string;
  secondaryName?: string;
  valueFormatter?: (value: number) => string;
  isPercentage?: boolean;
  isCurrency?: boolean;
  currencySymbol?: string;
}

function StatisticLineChart({
  title,
  values,
  primaryColor,
  secondaryColor,
  primaryName,
  secondaryName,
  valueFormatter,
  isPercentage = false,
  isCurrency = false,
  currencySymbol = '$',
}: StatisticLineChartProps) {
  const hasSecondary = values.some((value) => value.secondaryValue !== undefined);

  const formatValue = (value: number): string => {
    if (valueFormatter) return valueFormatter(value);
    if (isPercentage) return `${value.toFixed(1)}%`;
    if (isCurrency) return `${currencySymbol}${abbreviateNumber(value)}`;
    return abbreviateNumber(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <StatisticLineChartTooltip
          payload={payload}
          label={label}
          isPercentage={isPercentage}
          isCurrency={isCurrency}
          currencySymbol={currencySymbol}
        />
      );
    }
    return null;
  };

  return (
    <Card>
      <Card.Header title={title} />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={values}
          margin={{ right: 32, left: 8, top: 16, bottom: 8 }}
          style={{ fontSize: '12px' }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickFormatter={formatValue}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            width={60}
          />
          <Line
            type="monotone"
            dataKey="value"
            name={primaryName}
            stroke={primaryColor}
            strokeWidth={2}
            dot={{ r: 3, fill: primaryColor }}
            activeDot={{ r: 5, fill: primaryColor }}
          />
          {hasSecondary && secondaryColor && secondaryName && (
            <Line
              type="monotone"
              dataKey="secondaryValue"
              name={secondaryName}
              stroke={secondaryColor}
              strokeWidth={2}
              dot={{ r: 3, fill: secondaryColor }}
              activeDot={{ r: 5, fill: secondaryColor }}
              strokeDasharray="5 5"
            />
          )}
          <Legend content={<StatisticLineChartLegend />} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#ccc', strokeDasharray: '3 3' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default StatisticLineChart;

