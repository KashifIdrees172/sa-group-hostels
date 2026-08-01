import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import BranchDetail from '../pages/BranchDetail.jsx'
import NotFound from '../pages/NotFound.jsx'
export default function AppRoutes(){return <Routes><Route path="/" element={<Home/>}/><Route path="/branches/:branchId" element={<BranchDetail/>}/><Route path="*" element={<NotFound/>}/></Routes>}
