import "./Chart.css"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Janeiro',
    uv: 60,
    //pv: 45,
    //amt: 41,
  },
  {
    name: 'Fevereiro',
    uv: 57,
    //pv: 37,
    //amt: 49,
  },
  {
    name: 'Março',
    uv: 61,
    //pv: 57,
    //amt: 65,
  },
  {
    name: 'Abril',
    uv: 58,
    //pv: 70,
    //amt: 54,
  },
  {
    name: 'Maio',
    uv: 60,
    //pv: 49,
    //amt: 39,
  },
  {
    name: 'Junho',
    uv: 62,
    //pv: 38,
    //amt: 80,
  },
  {
    name: 'Julho',
    uv: 57,
    //pv: 52,
    //amt: 56,
  },
  {
    name: 'Agosto',
    uv: 61,
    //pv: 65,
    //amt: 78,
  },
  {
    name: 'Setembro',
    uv: 67,
    //pv: 80,
    //amt: 100,
  },
  {
    name: 'Outubro',
    uv: 71,
    //pv: 75,
    //amt: 88,
  },
  {
    name: 'Novembro',
    uv: 69,
    //pv: 68,
    //amt: 82,
  },
  {
    name: 'Dezembro',
    uv: 75,
    //pv: 48,
    //amt: 78,
  }
];

const Chart = () => {
    return (
        <div className="chart">
            <div className="title">Last 6 Months (Expenses)</div>
            <ResponsiveContainer width="100%" aspect={7.7/3}>
                <AreaChart
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" />
                {/*<Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" />*/}
                {/*<Area type="monotone" dataKey="amt" stackId="1" stroke="#ffc658" fill="#ffc658" />*/}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart