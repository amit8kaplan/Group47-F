import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { YourComponent } from "./pages/reg_try";
import { Login } from "./pages/Login";
import { CourseList } from "./pages/Store";
import  CourseReviewsPage  from "./pages/Course_reviews";
import { Nav_componnets } from "./components/Navbar";
import { useEffect, useState } from "react";
import Personal from "./pages/Personal";
import MyCourses from "./pages/MyCourses";
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLogin, setIsLogin] = useState(Boolean(sessionStorage.getItem("accessToken")));

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      setIsLogin(Boolean(sessionStorage.getItem("accessToken")));
    };

    // Listen for the custom event
    window.addEventListener("sessionStorageChange", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("sessionStorageChange", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <Nav_componnets isLogin={isLogin} />
      <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {isLogin ? null : <Route path="/register" element={<YourComponent />} />}
          <Route path="/login" element={<Login />} />
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course_review"
            element={
              <ProtectedRoute>
                <CourseReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/personal"
           element={
           <ProtectedRoute>
            <Personal/>
            </ProtectedRoute>
           }
          />
          <Route path= "/personal/my-courses"
           element={
            <ProtectedRoute>
              <MyCourses/>
              </ProtectedRoute>
           }
            />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
