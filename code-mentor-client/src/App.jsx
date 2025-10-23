import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import CodeEditorPage from "./pages/CodeEditorPage"; 

// Layout
import Layout from "./components/layout/Layout";
import StudentLayout from "./components/layout/StudentLayout";

// Assignment Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateAssignment from "./pages/assignments/CreateAssignment";
import AssignmentList from "./pages/assignments/AssignmentList";
import AssignmentDetail from "./pages/assignments/AssignmentDetail";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";

// // Submissions
import SubmissionsList from "./pages/submissions/SubmissionsList";
import SubmissionDetail from "./pages/submissions/SubmissionDetail";

// // Other Pages
//import AIEvaluationBuilder from "./pages/AIEvaluationBuilder";
 import BatchManagement from "./pages/BatchManagement";
 import Reports from "./pages/Reports";
import Messaging from "./pages/Messaging";
// import Settings from "./pages/Settings";

// Auth Pages
import Login from "./pages/auth/Login"; 
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
// import VerifyEmail from "./pages/auth/VerifyEmail";
 //import ResetPassword from "./pages/auth/ResetPassword";
//import VerifyEmail from "./pages/auth/VerifyEmail";
import AccountDetails from "./pages/auth/AccountDetails";
import Progress from "./pages/Progress";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public home page */}
        <Route path="/" element={<Home />} />

        {/* Auth routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path=
        
        "/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        
        {/*<Route path="/verify-email" element={<VerifyEmail />} /> */}
        

        {/*<Route path="/reset-password" element={<ResetPassword />}
        <Route path="/verify-email" element={<VerifyEmail />} /> />
         */}

        {/* Code editor page */}
        <Route path="/code-editor" element={<CodeEditorPage />} />
        <Route path="/progress" element={<StudentLayout><Progress /></StudentLayout>} />
        <Route path="/student-dashboard" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
       

        {/* Protected routes with layout */}
        <Route path="/submissions" element={<SubmissionsList />} />
        <Route path="/submissions/:submissionId" element={<SubmissionDetail />} /> {/* Correct route */}
        <Route path="/messaging" element={<Layout><Messaging /></Layout>} />
        <Route path="/account" element={<Layout><AccountDetails /></Layout>} />
        <Route path="/assignments/create" element={<Layout><CreateAssignment /></Layout>} />
        <Route path="/assignments" element={<Layout><AssignmentList /></Layout>} />
        <Route path="/assignments/:id" element={<Layout><AssignmentDetail /></Layout>} />
        {/* <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
         <Route path="/assignments/:id" element={<Layout><AssignmentDetail /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
           <Route path="/batches" element={<Layout><BatchManagement /></Layout>} />

           <Route path="/addstudent" element={<AddStudent />} />
    <Route path="/students/:id/edit" element={<Layout><EditStudent /></Layout>} />

        {/*
        
        
       
        
        
        <Route path="/ai-evaluation" element={<Layout><AIEvaluationBuilder /></Layout>} />
        <Route path="/batches" element={<Layout><BatchManagement /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        */}
      </Routes>
    </Router>
  );
}

export default App;