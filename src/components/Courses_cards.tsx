import React, { useEffect, useRef, useState } from 'react';
import apiClient from '../services/api-client';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import  {fetchData, fetchCoursesBySearch} from '../services/course-service';
import { set } from 'react-hook-form';
interface Course {
    _id: string;
    name: string;
    owner: string;
    owner_name: string;
    description: string;
    Count: number;
    videoUrl: string;
  }
  interface ChildProps {
    searchQuery: any;
    selectedOption: string;
    courseAdded: boolean;
  }
//   const NewCourseForm: React.FC<ChildProps> = ({ sendDataToParent , showFormFromParent, setCourseAdded}): React.ReactNode => {

  const CourseCards: React.FC<ChildProps> = ({ searchQuery, selectedOption, courseAdded }) => {

    const [courses, setCourses] = useState<Course[]>([]);
    const MAX_DESCRIPTION_LENGTH = 50; // Maximum characters to display initially

    const [showFullDescription, setShowFullDescription] = useState(false);
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };
    const HandleBuyCourse = (courseId: string) => {
        console.log("the course id is:" + courseId)
        apiClient.put('/course/buy', {courseId: courseId}).then((res) => {
            console.log("the response is:" + res)
        })
    }
    useEffect(() => {
        if (searchQuery && searchQuery.trim() !== '') {
          console.log("the search query is:" + searchQuery)
          fetchCoursesBySearch(searchQuery, selectedOption).then((res)=> setCourses(res));
        } else {
          // If search query is empty or undefined, fetch all courses
          fetchData().then((res)=> setCourses(res));
        //   setCourses( res);
        }
    }, [searchQuery, courseAdded]);
    
    return (
        <Row className='pb-2'>
        {courses.map((course) => (
          <Col className='p-3' key={course._id} xs={12} sm={6} md={4} lg={3} >
            <Card className='p-2' style={{ margin: '10px 0', height: '110%' }}>
              <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div >
                  <Card.Title>{course.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{course.owner_name}</Card.Subtitle>
                  <Card.Text>
                    {showFullDescription ? course.description : course.description.slice(0, MAX_DESCRIPTION_LENGTH)}
                    {course.description.length > MAX_DESCRIPTION_LENGTH && !showFullDescription && (
                      <span>...</span>
                    )}
                  </Card.Text >
                 </div>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <video controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <source src={course.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button className='btn p-2' onClick={()=>HandleBuyCourse(course._id)} variant="primary">Buy ({course.Count})</Button>
                  {course.description.length > MAX_DESCRIPTION_LENGTH && (
                  <Button  onClick={toggleDescription} variant="outline-primary" size="sm">
                  {showFullDescription ? 'Show Less' : 'Show More'} {showFullDescription ? <BsChevronUp /> : <BsChevronDown />}
                 </Button>
                  )}
                  {/* <Button className='btn p-2' variant="info" onClick={handleOpenAddReviewModal}>Add Review</Button> */}
                  {/* <Button className='btn p-2' variant="secondary" onClick={() => fetchReviews(course.owner,course.name)}>Reviews</Button> */}
                </div>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }


export default CourseCards;
