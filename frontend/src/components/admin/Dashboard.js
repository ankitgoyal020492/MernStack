import React from 'react'
import Sidebar from './Sidebar'
import { FaDatabase, FaProductHunt, FaUser } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Label } from 'recharts';

const Dashboard = () => {
    const data = [
        {
            name: 'Page A',
            uv: 4000,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            amt: 2100,
        },
    ];

    const data2 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    function CustomLabel({ viewBox, value1, value2 }) {
        const { cx, cy } = viewBox;
        return (
            <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                <tspan alignmentBaseline="middle" fontSize="26">{value1}</tspan>
                <tspan fontSize="14">{value2}</tspan>
            </text>
        )
    }

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                    <Sidebar />
                </div>
                <div className="col py-3">
                    <div className="row gx-5">
                        <div className="col-xxl-4 col-md-6 mb-5">
                            <div className="card card-raised border-start border-primary border-4">
                                <div className="card-body px-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="me-2">
                                            <div className="display-5">101.1K</div>
                                            <div className="card-text">Orders</div>
                                        </div>
                                        <div className="text-primary fs-3"><FaDatabase /></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-md-6 mb-5">
                            <div className="card card-raised border-start border-warning border-4">
                                <div className="card-body px-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="me-2">
                                            <div className="display-5">12.2K</div>
                                            <div className="card-text">Products</div>
                                        </div>
                                        <div className="text-warning fs-3"><FaProductHunt /></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-md-6 mb-5">
                            <div className="card card-raised border-start border-secondary border-4">
                                <div className="card-body px-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="me-2">
                                            <div className="display-5">5.3K</div>
                                            <div className="card-text">Users</div>
                                        </div>
                                        <div className="text-secondary fs-3"><FaUser /></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                    <PieChart width={800} height={400} onMouseEnter={null}>
                        <Pie
                            data={data2}
                            cx={120}
                            cy={200}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            <Label width={30} position="center"
                                content={<CustomLabel value1={data2.total} value2={"test"} />}>
                            </Label>
                            {data2.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
            </div>
        </div>
    )
}

export default Dashboard