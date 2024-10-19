import SensorCard from "../components/SensorCard"
import { RiBook2Fill } from "react-icons/ri";
import GaugeChart from "../components/GaugeChart";
import ChartLine from "../components/ChartLine";

function Home() {
    const sampleData = [
        { date: '2024-10-01', value: 10 },
        { date: '2024-10-02', value: 20 },
        { date: '2024-10-03', value: 30 },
        { date: '2024-10-04', value: 40 },
        { date: '2024-10-05', value: 50 },
        { date: '2024-10-06', value: 60 },
        { date: '2024-10-07', value: 70 },
        { date: '2024-10-08', value: 80 },
        { date: '2024-10-09', value: 90 },
        { date: '2024-10-10', value: 100 },
    ]
    return (
        <div className='flex h-screen bg-background-light dark:bg-background-dark w-full items-center justify-center'>
            <div className='flex w-[92%] h-full pt-4 flex-col gap-4 pb-5 ml-1'>
                <div className="flex w-full justify-between h-10">
                    <h2 className="text-text-light dark:text-text-dark text-2xl font-bold">Dashboard</h2>
                </div>
                <div className="flex gap-3 w-full flex-row h-full">
                    <div className="w-2/3 h-full flex flex-col gap-4">
                        <div className="grid grid-cols-3 h-[40%] w-full gap-4 text-white rounded-lg">
                            <SensorCard currentValue='10' background='bg-[#b35b51]/20' color="#b35b51"/>
                            <SensorCard currentValue='20' background='bg-[#3765dc]/20' color="#3765dc"/>
                            <SensorCard currentValue='30' background='bg-[#a24ee0]/20' color="#a24ee0"/>
                        </div>
                        <div className="w-full bg-panel_bg-dark h-[60%] rounded-sm text-white">
                            <div className='p-3 flex flex-col items-start gap-2'>
                                <RiBook2Fill size={36} color="f0f0f0" className={`p-2 rounded-full bg-red-300/20`} />
                                <span className='text-2xl font-bold'>20</span>
                            </div>
                            <div className='flex flex-col gap-2 justify-center items-center h-[70%] pr-5'>
                                <ChartLine data={sampleData} color="#d2a8ff"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 h-full bg-panel_bg-dark rounded-sm flex items-center">
                        <GaugeChart value={30}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home