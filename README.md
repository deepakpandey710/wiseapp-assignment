
#  Institute Instructor Attendance System

## Installation

To install all the required dependencies, use command:

npm install

## Usage

To run the project, use command:

npm start


## Assumptions

- I assumed that there will be no scenario where a user checks in and checks out in the next month. For example, there will be no case where check-in timing is on 31st Jan 2024 at 23:55, and check-out timing is on 1st Feb 2024 at 2:30.

## Cases Handled

1. **Multiple Check-in and Check-out in a Day:**
  
2. **Validation for Date & Timings:**

3. **Avoiding Slot Overlaps:**

4. **Handling Check-out Only if Checked In:**
   - Ensured that check-out operations are only allowed if the instructor has previously checked in.

5. **Instructor-wise Total Checked-in Time for the Given Month:**
   - The system computes and provides instructor-wise total checked-in time for all instructors in the specified month.



## Payload in api

**checkin**
url=http://localhost:5000/api/checkin
payload:
{
  "instructorId": "1234",
  "timestamp": "2024-02-18T01:10:50Z"
}


**checkout**
url=http://localhost:5000/api/checkout
payload:
{
  "instructorId": "1234",
  "timestamp": "2024-02-18T02:10:50Z"
}


**monthly report**
url=url= http://localhost:5000/api/monthly-report/month/year
example: http://localhost:5000/api/monthly-report/2/2024


