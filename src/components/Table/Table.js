import React, { useState, useEffect } from "react";
import { Button, styled } from '@mui/material';
import "../../styles/table.css";

const ActionBtn = styled(Button)`
    border: 1px solid white;
    outline: none;
    background: #000;    
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: white;
`;

const Table = () => {
  const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
    const url = `https://shrouded-savannah-90405.herokuapp.com/student`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setStudentsData(data));
  }, []);
  
  const handlePayment = (id) => {
    console.log(id);
    const url = `https://shrouded-savannah-90405.herokuapp.com/student/${id}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        is_paid : true
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.modifiedCount > 0) {
          console.log("Student payment data updated.")
        }
      });
  }

  return (
    <>
      <table >
        <thead>
            <tr>
                <th>SL No</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Amount Paid</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody >
          {
              studentsData?.map((studentData, index) => (
                <>
                    <tr >
                        <td>{ index + 1 }</td>
                        <td>{studentData?.first_name}</td>
                        <td>{studentData?.last_name}</td>
                        <td>{studentData?.email_id}</td>
                        <td>{studentData?.is_paid === false ? "No" : "Yes"}</td>
                        <td>
                          {
                              studentData?.is_paid === false ? 
                                <ActionBtn  onClick={() => handlePayment(studentData?._id)} > Mark as Paid </ActionBtn> 
                                : "Paid"
                          }
                        </td>
                    </tr>
                </> 
            ))
          }        
        </tbody>
      </table>
    </>
  );
};

export default Table;
