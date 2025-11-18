
import { Navigate } from "react-router-dom";
import PrincipalAudioMessages from "@/pages/PrincipalAudioMessages";

const PrincipalAudioRoute = () => {
  const isTeacherAuth = localStorage.getItem("teacherAuth") === "true";
  const isStudentAuth = localStorage.getItem("studentAuth") === "true";

  if (!isTeacherAuth && !isStudentAuth) {
    return <Navigate to="/" replace />;
  }

  if (isTeacherAuth) {
    const teacherEmail = localStorage.getItem("teacherEmail") || "";
    return <PrincipalAudioMessages userEmail={teacherEmail} userType="teacher" />;
  }

  // Student auth
  const studentEmail = localStorage.getItem("studentEmail") || "";
  const currentStudent = localStorage.getItem("currentStudent");
  let userClass = "";
  let userSection = "";
  let userId = "";

  if (currentStudent) {
    try {
      const student = JSON.parse(currentStudent);
      userClass = student.class || "";
      userSection = student.section || "";
      userId = student.studentId || student.id || "";
    } catch (e) {
      console.error("Error parsing student data:", e);
    }
  }

  return (
    <PrincipalAudioMessages 
      userEmail={studentEmail} 
      userType="student" 
      userClass={userClass}
      userSection={userSection}
      userId={userId}
    />
  );
};

export default PrincipalAudioRoute;
