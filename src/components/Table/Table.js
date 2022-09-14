import React, { useState, useEffect } from "react";
import { Button,Box, FormControl, Select, MenuItem,ToggleButton,  styled} from '@mui/material';
import "../../styles/table.css";
import axios  from "axios";

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
const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  margin: 10px;
  padding: 10px 15px;
`;
const InputWrapper = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  margin: 10px 30px;
  padding: 10px 15px;
  & > input {
    width: 300px;
    padding: 10px 15px;
    font-size : 18px;
  }
`;
const BtnWrapper = styled(ToggleButton)`
    margin: 3px;
`;


const Table = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [ limit, setLimit ] = useState(10);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ totalPage, setTotalPage ] = useState(0);
  const [selected, setSelected] = useState(false);
  const [ query, setQuery ] = useState(""); 


  
  useEffect(() => {    
    ( async () => {
        const { data } = await axios.get(`https://shrouded-savannah-90405.herokuapp.com/student?limit=${limit}&pageNumber=${pageNumber}`);
        setStudentsData(data?.data);
        setTotalPage(data?.count/limit);
      })() 
  }, [limit, pageNumber]);
  
  const handlePayment = (id) => {
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
          console.log("Student payment data updated.");
        }
      });
  };

  const keys = [ "first_name", "last_name", "email_id"]

  const FilteredStudents = (data) => {
    return data.filter((item)=> 
      keys.some(key => item[key].toLowerCase().includes(query)) 
    )
  }

  return (
    <>
      <InputWrapper>
        <input 
          type="text"  
          placeholder="Search students here ..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputWrapper>

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
              FilteredStudents(studentsData)?.map((studentData, index) => (
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
      <PaginationWrapper>
        {
          [...Array(totalPage).keys()].map(number => {
              return (
                <BtnWrapper
                  value= "check"
                  selected={ pageNumber === number ?  !selected : selected }
                  
                  onClick={() => setPageNumber(number)}
                >
                  { number+1 }
                </BtnWrapper>
          )})
        }
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <Select  
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
          </Box>
      </PaginationWrapper>
    </>
  );
};

export default Table;
