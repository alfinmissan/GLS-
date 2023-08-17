import React, { useState, useEffect } from 'react';
import { CChart } from '@coreui/react-chartjs';
import { Token, Url } from '../context/ApiVariables';
import axios from 'axios';

const HomeGraph = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios.get(Url + 'home/graph', {
      headers: {
        'Authorization': Token,
      },
    }).then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div style={{ marginBottom: '40px' }} className='home-graph'>
      <CChart
        type="bar"
        data={{
          labels: ['Pending Task', 'Completed Task'],
          datasets: [
            {
              label: 'Tasks',
              backgroundColor: ['#1CB7C9', '#1C61C9'],
              barPercentage: 30, // Adjust the barPercentage to increase the height
              barThickness: 100,
              maxBarThickness: 100,
              minBarLength: 3,
              borderWidth: 10,
              borderColor: 'white',
              textColor: '#701CC9',
              data: data,
            },
          ],
        }}
        labels="Task"
      />
    </div>
  );
};

export default HomeGraph;
