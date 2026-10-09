import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Grid, Icon, Table} from 'semantic-ui-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const ChartTooltip = ({ active, payload, label, formatter, labelFormatter }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className='chart-tooltip'>
      <div className='chart-tooltip-label'>
        {labelFormatter ? labelFormatter(label) : label}
      </div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className='chart-tooltip-row'>
          <span
            className='chart-tooltip-dot'
            style={{ background: entry.stroke || entry.fill }}
          />
          <span className='chart-tooltip-name'>{entry.name}</span>
          <span className='chart-tooltip-value'>
            {formatter
              ? formatter(entry.value)
              : Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const fmtDateLabel = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });
};

// Add custom config within the Dashboard component
const chartConfig = {
  lineChart: {
    style: {
      background: '#fff',
      borderRadius: '8px',
    },
    line: {
      strokeWidth: 2,
      dot: false,
      activeDot: { r: 4 },
    },
    grid: {
      vertical: false,
      horizontal: true,
      opacity: 0.1,
    },
  },
  colors: {
    requests: '#4318FF',
    quota: '#00B5D8',
    tokens: '#6C63FF',
  },
  barColors: [
    '#4318FF', // deep purple
    '#00B5D8', // cyan
    '#6C63FF', // purple
    '#05CD99', // green
    '#FFB547', // orange
    '#FF5E7D', // pink
    '#41B883', // emerald
    '#7983FF', // light purple
    '#FF8F6B', // coral
    '#49BEFF', // sky blue
  ],
};

const Dashboard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    todayRequests: 0,
    todayQuota: 0,
    todayTokens: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/user/dashboard');
      if (response.data.success) {
        const dashboardData = response.data.data || [];
        setData(dashboardData);
        calculateSummary(dashboardData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setData([]);
      calculateSummary([]);
    }
  };

  const calculateSummary = (dashboardData) => {
    if (!Array.isArray(dashboardData) || dashboardData.length === 0) {
      setSummaryData({
        todayRequests: 0,
        todayQuota: 0,
        todayTokens: 0,
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayData = dashboardData.filter((item) => item.Day === today);

    const summary = {
      todayRequests: todayData.reduce(
        (sum, item) => sum + item.RequestCount,
        0
      ),
      todayQuota:
        todayData.reduce((sum, item) => sum + item.Quota, 0) / 1000000,
      todayTokens: todayData.reduce(
        (sum, item) => sum + item.PromptTokens + item.CompletionTokens,
        0
      ),
    };

    setSummaryData(summary);
  };

  // Process data for the line chart, filling in missing dates
  const processTimeSeriesData = () => {
    const dailyData = {};

    // Get date range
    const dates = data.map((item) => item.Day);
    const maxDate = new Date(); // always use today as the last day
    let minDate =
      dates.length > 0
        ? new Date(Math.min(...dates.map((d) => new Date(d))))
        : new Date();

    // Ensure at least 7 days of data are shown
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // -6 because today is included
    if (minDate > sevenDaysAgo) {
      minDate = sevenDaysAgo;
    }

    // Generate all dates
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        requests: 0,
        quota: 0,
        tokens: 0,
      };
    }

    // Fill in actual data
    data.forEach((item) => {
      dailyData[item.Day].requests += item.RequestCount;
      dailyData[item.Day].quota += item.Quota / 1000000;
      dailyData[item.Day].tokens += item.PromptTokens + item.CompletionTokens;
    });

    return Object.values(dailyData).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  };

  // Process data for the stacked bar chart
  const processModelData = () => {
    const timeData = {};

    // Get date range
    const dates = data.map((item) => item.Day);
    const maxDate = new Date(); // always use today as the last day
    let minDate =
      dates.length > 0
        ? new Date(Math.min(...dates.map((d) => new Date(d))))
        : new Date();

    // Ensure at least 7 days of data are shown
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // -6 because today is included
    if (minDate > sevenDaysAgo) {
      minDate = sevenDaysAgo;
    }

    // Generate all dates
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      timeData[dateStr] = {
        date: dateStr,
      };

      // Initialize all model data to 0
      const models = [...new Set(data.map((item) => item.ModelName))];
      models.forEach((model) => {
        timeData[dateStr][model] = 0;
      });
    }

    // Fill in actual data
    data.forEach((item) => {
      timeData[item.Day][item.ModelName] =
        item.PromptTokens + item.CompletionTokens;
    });

    return Object.values(timeData).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Get all unique model names
  const getUniqueModels = () => {
    return [...new Set(data.map((item) => item.ModelName))];
  };

  // Aggregate usage per model for the ranking table
  const getModelSummary = () => {
    const map = {};
    data.forEach((item) => {
      const name = item.ModelName || 'Unknown';
      if (!map[name]) {
        map[name] = {
          model: name,
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        };
      }
      map[name].requests += item.RequestCount || 0;
      map[name].inputTokens += item.PromptTokens || 0;
      map[name].outputTokens += item.CompletionTokens || 0;
      map[name].totalTokens +=
        (item.PromptTokens || 0) + (item.CompletionTokens || 0);
    });
    return Object.values(map).sort((a, b) => b.totalTokens - a.totalTokens);
  };

  const timeSeriesData = processTimeSeriesData();
  const modelData = processModelData();
  const models = getUniqueModels();
  const modelSummary = getModelSummary();

  // Generate random colors
  const getRandomColor = (index) => {
    return chartConfig.barColors[index % chartConfig.barColors.length];
  };

  // Add a date formatting function
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
    });
  };

  // Modify all XAxis configs
  const xAxisConfig = {
    dataKey: 'date',
    axisLine: false,
    tickLine: false,
    tick: {
      fontSize: 12,
      fill: '#A3AED0',
      textAnchor: 'middle', // center-align the text
    },
    tickFormatter: formatDate,
    interval: 0,
    minTickGap: 5,
    padding: { left: 30, right: 30 }, // increase padding on both sides to ensure the first/last labels are fully shown
  };

  return (
    <div className='dashboard-container'>
      {/* today's stat cards */}
      <div className='stat-cards'>
        <div className='stat-card-modern stat-card-blue'>
          <div className='stat-card-icon'>
            <Icon name='paper plane' />
          </div>
          <div className='stat-card-info'>
            <div className='stat-card-label'>
              {t('dashboard.statistics.todayRequests')}
            </div>
            <div className='stat-card-value'>
              {summaryData.todayRequests.toLocaleString()}
            </div>
          </div>
        </div>
        <div className='stat-card-modern stat-card-cyan'>
          <div className='stat-card-icon'>
            <Icon name='dollar sign' />
          </div>
          <div className='stat-card-info'>
            <div className='stat-card-label'>
              {t('dashboard.statistics.todayQuota')}
            </div>
            <div className='stat-card-value'>
              ${summaryData.todayQuota.toFixed(2)}
            </div>
          </div>
        </div>
        <div className='stat-card-modern stat-card-purple'>
          <div className='stat-card-icon'>
            <Icon name='cube' />
          </div>
          <div className='stat-card-info'>
            <div className='stat-card-label'>
              {t('dashboard.statistics.todayTokens')}
            </div>
            <div className='stat-card-value'>
              {summaryData.todayTokens.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* three side-by-side area charts */}
      <Grid columns={3} stackable className='charts-grid'>
        <Grid.Column>
          <Card fluid className='chart-card'>
            <Card.Content>
              <Card.Header>
                {t('dashboard.charts.requests.title')}
              </Card.Header>
              <div className='chart-container'>
                <ResponsiveContainer
                  width='100%'
                  height={120}
                  margin={{ left: 10, right: 10 }} // adjust container margins
                >
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id='gradRequests' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor={chartConfig.colors.requests} stopOpacity={0.35} />
                        <stop offset='95%' stopColor={chartConfig.colors.requests} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={chartConfig.lineChart.grid.vertical}
                      horizontal={chartConfig.lineChart.grid.horizontal}
                      opacity={chartConfig.lineChart.grid.opacity}
                    />
                    <XAxis {...xAxisConfig} />
                    <YAxis hide={true} />
                    <Tooltip
                      content={
                        <ChartTooltip
                          labelFormatter={fmtDateLabel}
                          formatter={(v) => Number(v).toLocaleString()}
                        />
                      }
                    />
                    <Area
                      type='monotone'
                      dataKey='requests'
                      name={t('dashboard.charts.requests.tooltip')}
                      stroke={chartConfig.colors.requests}
                      strokeWidth={chartConfig.lineChart.line.strokeWidth}
                      fill='url(#gradRequests)'
                      dot={chartConfig.lineChart.line.dot}
                      activeDot={chartConfig.lineChart.line.activeDot}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Card fluid className='chart-card'>
            <Card.Content>
              <Card.Header>
                {t('dashboard.charts.quota.title')}
              </Card.Header>
              <div className='chart-container'>
                <ResponsiveContainer
                  width='100%'
                  height={120}
                  margin={{ left: 10, right: 10 }} // adjust container margins
                >
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id='gradQuota' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor={chartConfig.colors.quota} stopOpacity={0.35} />
                        <stop offset='95%' stopColor={chartConfig.colors.quota} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={chartConfig.lineChart.grid.vertical}
                      horizontal={chartConfig.lineChart.grid.horizontal}
                      opacity={chartConfig.lineChart.grid.opacity}
                    />
                    <XAxis {...xAxisConfig} />
                    <YAxis hide={true} />
                    <Tooltip
                      content={
                        <ChartTooltip
                          labelFormatter={fmtDateLabel}
                          formatter={(v) => `$${Number(v).toFixed(6)}`}
                        />
                      }
                    />
                    <Area
                      type='monotone'
                      dataKey='quota'
                      name={t('dashboard.charts.quota.tooltip')}
                      stroke={chartConfig.colors.quota}
                      strokeWidth={chartConfig.lineChart.line.strokeWidth}
                      fill='url(#gradQuota)'
                      dot={chartConfig.lineChart.line.dot}
                      activeDot={chartConfig.lineChart.line.activeDot}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Card fluid className='chart-card'>
            <Card.Content>
              <Card.Header>
                {t('dashboard.charts.tokens.title')}
              </Card.Header>
              <div className='chart-container'>
                <ResponsiveContainer
                  width='100%'
                  height={120}
                  margin={{ left: 10, right: 10 }} // adjust container margins
                >
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id='gradTokens' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor={chartConfig.colors.tokens} stopOpacity={0.35} />
                        <stop offset='95%' stopColor={chartConfig.colors.tokens} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={chartConfig.lineChart.grid.vertical}
                      horizontal={chartConfig.lineChart.grid.horizontal}
                      opacity={chartConfig.lineChart.grid.opacity}
                    />
                    <XAxis {...xAxisConfig} />
                    <YAxis hide={true} />
                    <Tooltip
                      content={
                        <ChartTooltip
                          labelFormatter={fmtDateLabel}
                          formatter={(v) => Number(v).toLocaleString()}
                        />
                      }
                    />
                    <Area
                      type='monotone'
                      dataKey='tokens'
                      name={t('dashboard.charts.tokens.tooltip')}
                      stroke={chartConfig.colors.tokens}
                      strokeWidth={chartConfig.lineChart.line.strokeWidth}
                      fill='url(#gradTokens)'
                      dot={chartConfig.lineChart.line.dot}
                      activeDot={chartConfig.lineChart.line.activeDot}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>

      {/* model usage statistics */}
      <Card fluid className='chart-card'>
        <Card.Content>
          <Card.Header>{t('dashboard.statistics.title')}</Card.Header>
          <div className='chart-container'>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={modelData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  opacity={0.1}
                />
                <XAxis {...xAxisConfig} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#A3AED0' }}
                />
                <Tooltip
                  content={<ChartTooltip labelFormatter={fmtDateLabel} />}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                />
                {models.map((model, index) => (
                  <Bar
                    key={model}
                    dataKey={model}
                    stackId='a'
                    fill={getRandomColor(index)}
                    name={model}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>

      {/* model usage ranking */}
      <Card fluid className='chart-card'>
        <Card.Content>
          <Card.Header>{t('dashboard.statistics.modelRanking')}</Card.Header>
          <div className='chart-container model-ranking'>
            {modelSummary.length === 0 ? (
              <div className='model-ranking-empty'>
                {t('dashboard.statistics.noData')}
              </div>
            ) : (
              <Table basic='very' unstackable className='model-table'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={1}>#</Table.HeaderCell>
                    <Table.HeaderCell>
                      {t('dashboard.statistics.columns.model')}
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>
                      {t('dashboard.statistics.columns.requests')}
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>
                      {t('dashboard.statistics.columns.inputTokens')}
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>
                      {t('dashboard.statistics.columns.outputTokens')}
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>
                      {t('dashboard.statistics.columns.totalTokens')}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {modelSummary.map((m, i) => (
                    <Table.Row key={m.model}>
                      <Table.Cell width={1}>
                        <span
                          className='model-rank'
                          style={{ background: getRandomColor(i) }}
                        >
                          {i + 1}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className='model-name'>{m.model}</span>
                        {i === 0 && (
                          <span className='model-badge'>
                            {t('dashboard.statistics.mostUsed')}
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign='right'>
                        {m.requests.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell textAlign='right'>
                        {m.inputTokens.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell textAlign='right'>
                        {m.outputTokens.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell textAlign='right'>
                        <span className='model-total'>
                          {m.totalTokens.toLocaleString()}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;
