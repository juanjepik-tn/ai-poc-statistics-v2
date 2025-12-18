import { addOpacityToHexColor } from '@/common/utils/addOpacityToHexColor';
import { Card } from '@nimbus-ds/components';
import { ReactElement } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { abbreviateNumber } from '../../utils/abbreviateNumber';
import StatisticChartLegend from './StatisticChartLegend';
import StatisticChartTooltip from './StatisticChartTooltip';

export interface BarChartInterface {
  name: string;
  principalValue: number;
  secondaryValue?: number;
  secondaryName?: string;
}

interface StatisticChartProps {
  values: BarChartInterface[];
  primaryColor: string;
  secondaryColor: string;
  customTooltipContent?: ReactElement;
  cutomLegendContent?: ReactElement;
  oneYAxis: boolean;
  xAxisFormatter?: (value: string) => string;
  secondaryColorOpacity?: boolean;
  title?: string;
  principalName: string;
  secondaryName: string;
}

function StatisticChart({
  title,
  values,
  primaryColor,
  secondaryColor,
  secondaryColorOpacity = false, // We force the opacity with this prop since it does not apply for all cases
  oneYAxis = false,
  principalName,
  secondaryName,
}: StatisticChartProps) {
  const hasSecondary = values.some((value) => value.secondaryValue);
  const marginRight = oneYAxis ? 16 * 2 : 0;
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return <StatisticChartTooltip payload={payload} label={label} />;
    }
    return null;
  };
  return (
    <Card>
      <Card.Header title={title} />

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={values}
          margin={{ right: marginRight }}
          style={{ fontSize: '12px' }}
          maxBarSize={values.length > 8 ? 12 : undefined}
        >
          <CartesianGrid vertical={false} strokeDasharray="2 0" />
          <XAxis dataKey="name" />
          <YAxis
            yAxisId="left"
            type="number"
            tickFormatter={abbreviateNumber}
            axisLine={false}
            tickLine={false}
          />
          {!oneYAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={abbreviateNumber}
              axisLine={false}
              tickLine={false}
            />
          )}
          <Bar
            dataKey="principalValue"
            name={principalName}
            fill={primaryColor}
            yAxisId="left"
            stackId="a"
            stroke={primaryColor}
            strokeWidth={1}
          />
          {hasSecondary && (
            <>
              <Bar
                stackId="a"
                name={secondaryName}
                dataKey="secondaryValue"
                stroke={secondaryColor}
                strokeWidth={1}
                yAxisId={oneYAxis ? 'left' : 'right'}
                /*
                 * We do not use the "opacity" prop of <Bar /> component
                 * because we want the color with opacity to reach the legend and the tooltip
                 */
                fill={
                  secondaryColorOpacity
                    ? addOpacityToHexColor(secondaryColor, 0.3)
                    : secondaryColor
                }
              />
            </>
          )}
          <Legend content={<StatisticChartLegend payload={values} />} />
          <Tooltip
            content={<CustomTooltip />}
            trigger="hover"
            cursor={{ fill: 'grey', fillOpacity: 0.1 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default StatisticChart;
