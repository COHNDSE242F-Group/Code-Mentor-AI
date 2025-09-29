from pydantic import BaseModel

class Student(BaseModel):
    id: int
    name: str
    age: int
    email: str
    uni_id: str # Id given to the student by the uiversity
    university_id: int # Foreign key to the University model
    batch_id: int # Foreign key to the Batch model

class Instructor(BaseModel):
    id: int
    name: str
    department: str
    email: str
    university_id: int # Foreign key to the University model

class University(BaseModel):
    id: int
    name: str
    location: str
    email: str
    phone: str

class Batch(BaseModel):
    id: int
    name: str
    start_year: int
    end_year: int
    university_id: int # Foreign key to the University model

class Course(BaseModel):
    id: int
    title: str
    description: str
    credits: int
    university_id: int # Foreign key to the University model
    instructor_id: int # Foreign key to the Instructor model
    batch_id: int # Foreign key to the Batch model

class Enrollment(BaseModel):
    id: int
    student_id: int # Foreign key to the Student model
    course_id: int # Foreign key to the Course model
    enrollment_date: str # Date when the student enrolled in the course

class Assignment(BaseModel):
    id: int
    title: str
    description: str
    due_date: str # Due date for the assignment
    course_id: int # Foreign key to the Course model

class Submission(BaseModel):
    id: int
    assignment_id: int # Foreign key to the Assignment model
    student_id: int # Foreign key to the Student model
    submission_date: str # Date when the assignment was submitted
    grade: float | None = None # Grade given for the submission, if any