"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Target, Shield, Activity, MoreHorizontal } from "lucide-react"

export default function TacticalDashboard() {
  const missionData = [
    { month: "hhhhhhhh", success: 85, failed: 15 },
    { month: "Feb", success: 92, failed: 8 },
    { month: "Mar", success: 78, failed: 22 },
    { month: "Apr", success: 95, failed: 5 },
    { month: "May", success: 88, failed: 12 },
    { month: "Jun", success: 94, failed: 6 },
  ]

  const transactions = [
    {
      id: "OP-001",
      agent: "GHOST_FIRE",
      mission: "Intelligence Gathering",
      status: "Completed",
      time: "14:30",
      location: "Berlin",
    },
    {
      id: "OP-002",
      agent: "SHADOW_WOLF",
      mission: "Asset Extraction",
      status: "In Progress",
      time: "12:15",
      location: "Tokyo",
    },
    {
      id: "OP-003",
      agent: "NIGHT_HAWK",
      mission: "Surveillance",
      status: "Completed",
      time: "09:45",
      location: "Moscow",
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wider">TACTICAL REPORTS</h1>
          <p className="text-sm text-neutral-400">Mission analytics and operational metrics</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-black tracking-wider">Generate Report</Button>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Mission Success Chart */}
        <Card className="xl:col-span-2 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                  MISSION hhhhhhhh
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl lg:text-3xl font-bold text-white font-mono">94.2%</span>
                  <div className="flex items-center text-white text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +4.8%
                  </div>
                </div>
              </div>
              <div className="text-xs text-neutral-500">Last 6 months</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 lg:h-64 relative">
              {/* Chart Grid */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-8 opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-neutral-700"></div>
                ))}
              </div>

              {/* Chart Line */}
              <svg className="absolute inset-0 w-full h-full">
                <polyline
                  points="20,180 80,140 140,200 200,100 260,160 320,120"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                />
                <polyline
                  points="20,200 80,190 140,220 200,180 260,200 320,180"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />

                {/* Data points */}
                {missionData.map((_, index) => (
                  <circle
                    key={index}
                    cx={20 + index * 60}
                    cy={180 - index * 20}
                    r="4"
                    fill="#f97316"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                ))}
              </svg>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-8 font-mono">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-neutral-500 -mb-6 font-mono px-4">
                {missionData.map((data) => (
                  <span key={data.month}>{data.month}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Operations Summary */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ALL OPERATIONS</CardTitle>
            <div className="text-xs text-neutral-500">Monthly summary</div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white font-mono mb-2">+$15.2K</div>
              <div className="flex items-center justify-center text-white text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </div>
            </div>

            {/* Bar Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-16 bg-orange-500 rounded"></div>
                <div className="w-8 h-20 bg-purple-500 rounded"></div>
                <div className="w-8 h-12 bg-blue-500 rounded"></div>
                <div className="w-8 h-24 bg-orange-500 rounded"></div>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 font-mono">
                <span>Q1</span>
                <span>Q2</span>
                <span>Q3</span>
                <span>Q4</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-300 tracking-wider mb-1">NEW MISSIONS</p>
                <p className="text-2xl lg:text-3xl font-bold text-white font-mono">150.00</p>
                <p className="text-xs text-neutral-400">From last week</p>
              </div>
              <Target className="w-8 h-8 lg:w-10 lg:h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-300 tracking-wider mb-1">ACTIVE AGENTS</p>
                <p className="text-2xl lg:text-3xl font-bold text-white font-mono">150.00</p>
                <p className="text-xs text-neutral-400">From last week</p>
              </div>
              <Users className="w-8 h-8 lg:w-10 lg:h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border-pink-500/30">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-pink-300 tracking-wider mb-1">INTEL REPORTS</p>
                <p className="text-2xl lg:text-3xl font-bold text-white font-mono">250.00</p>
                <p className="text-xs text-neutral-400">From last week</p>
              </div>
              <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">RECENT OPERATIONS</CardTitle>
            <Button variant="ghost" className="text-neutral-400 hover:text-orange-500 text-sm">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-400 tracking-wider">OPERATION</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-400 tracking-wider">AGENT</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-400 tracking-wider">TIME</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-400 tracking-wider">STATUS</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-400 tracking-wider">LOCATION</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-400 tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-sm text-white font-mono">{transaction.id}</div>
                          <div className="text-xs text-neutral-400">{transaction.mission}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-white font-mono">{transaction.agent}</td>
                    <td className="py-3 px-2 text-sm text-neutral-300 font-mono">{transaction.time}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${
                          transaction.status === "Completed"
                            ? "bg-white/20 text-white"
                            : "bg-orange-500/20 text-orange-500"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-neutral-300">{transaction.location}</td>
                    <td className="py-3 px-2">
                      <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
