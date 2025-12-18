import { Button } from '@/components/ui/button'
import HistoryList from './_components/HistoryList'
import DoctorsAgentList from './_components/DoctorsAgentList'

const DashboardLayout = () => {
  return (
    <div>
        <div className='flex justify-between items-center'>
            <h2 className='font-bold text-2xl'>My Dashboard</h2>
            <Button>+ Consult With Doctor</Button>
        </div>
        <HistoryList />
        <DoctorsAgentList />
    </div>
  )
}

export default DashboardLayout