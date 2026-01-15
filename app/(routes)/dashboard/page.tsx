import { Button } from '@/components/ui/button'
import HistoryList from './_components/HistoryList'
import DoctorsAgentList from './_components/DoctorsAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'

const DashboardLayout = () => {
  return (
    <div>
        <div className='flex justify-between items-center'>
            <h2 className='font-bold text-lg md:text-2xl'>My Dashboard</h2>
            <AddNewSessionDialog />
        </div>
        <HistoryList />
        <DoctorsAgentList />
    </div>
  )
}

export default DashboardLayout