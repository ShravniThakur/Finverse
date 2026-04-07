import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Wallet from './pages/Wallet'
import Expense from './pages/Expense'
import Budget from './pages/Budget'
import SplitBill from './pages/SplitBill'
import GroupDetails from './pages/GroupDetails'
import AddSplitExpense from './pages/AddSplitExpense'
import Transactions from './pages/Transactions'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoutes from './components/ProtectedRoutes'
import PublicRoutes from './components/PublicRoutes'
import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <ScrollToTop></ScrollToTop>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes></ProtectedRoutes>}>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
          <Route path='/wallet' element={<Wallet></Wallet>}></Route>
          <Route path='/expense' element={<Expense></Expense>}></Route>
          <Route path='/budget' element={<Budget></Budget>}></Route>
          <Route path='/split-bill' element={<SplitBill></SplitBill>}></Route>
          <Route path='/group-details/:groupCode' element={<GroupDetails></GroupDetails>}></Route>
          <Route path='/add-expense/:groupCode' element={<AddSplitExpense></AddSplitExpense>}></Route>
          <Route path='/transactions' element={<Transactions></Transactions>}></Route>
          <Route path='/my-profile' element={<MyProfile></MyProfile>}></Route>
        </Route>
        {/* Public Routes */}
        <Route element={<PublicRoutes></PublicRoutes>}>
          <Route path='/' element={<Landing></Landing>}></Route>
          <Route path='/login' element={<Login></Login>}> </Route>
        </Route>
      </Routes>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default App
