import React from 'react';

export function isValuePresent(oldData,newData,row,col) {
    if(isIndexValid(oldData,row, col)){
        if(oldData[row][col]!==newData[row][col]){
            return true;//values not matching
        }else{
            return false;//values matchinf
        }
    }else{
        return true;//value did not exist
    }
  }

  export function isValPresentInGrouped(olddict,newdict,key,row){
    // console.log(olddict[key])
    try {
      if(olddict[key]){
        if(isIndexValid(olddict[key],row,0)){
            if(olddict[key][row][0] !== newdict[key][row][0]){
                return true
            }else{
                return false
            }
        }else{
            return true
        }
    }else{
        return true
    }
  }catch{
    return false
  }
}


//function for checking index exist in given nested 2D array
  function isIndexValid(nestedArray, rowIndex, columnIndex) {
    if (
      rowIndex >= 0 &&
      rowIndex < nestedArray.length &&
      columnIndex >= 0 &&
      columnIndex < nestedArray[rowIndex].length
    ) {
      return true; // Index position is valid
    }
    return false; // Index position is invalid
  }

  
//example value l
let OldGrid = [[1],[1],[1],[1]]
let newgrid = [[1],[2],[1],[1]]




export function MyComponent({ data }) {
  // Create a new copy of the data array
  const newData = [...data];

  // Create new copies of the nested objects
  const updatedData = newData.map(item => {
    // Create a new copy of the nested array
    const nestedArray = [...item.nestedArray];

    // Make changes to the nested array or its elements
    nestedArray.push('new element');

    // Return the updated item with the new nested array
    return {
      ...item,
      nestedArray,
    };
  });

  // Render the component with the updated data
  return updatedData 
    
}

export function CheckPresent(oldArray, newArray, ind1, ind2) {
  if (oldArray && newArray && oldArray[ind1] && newArray[ind1]) {
    if (oldArray[ind1][ind2] && newArray[ind1][ind2]) {
      return oldArray[ind1][ind2][0] !== newArray[ind1][ind2][0];
    } else {
      return true;
    }
  } else {
    return true;
  }
}



export function isValueRepeatedInColumn(matrix, column, value) {
  var count = 0;
  console.log(matrix,column,value)
  // Iterate through each row in the matrix
  for (var i = 0; i < matrix.length; i++) {
    var row = matrix[i];

    // Check if the column index is within the row length
    if (column < row.length) {
      var cellValue = row[column];

      // Check if the value matches the given value
      if (cellValue === value) {
        count++;

        // Check if the value is repeated
        if (count >= 1) {
           console.log("yes")
          return true;
        }
      }
    }
  }
  console.log("no")
  return false; // Value is not repeated
}

export function extractNameFromURL(url) {
  const urlObj = new URL(url);
  const path = urlObj.pathname; // Get the pathname from the URL

  // Extract the name from the last part of the path
  const parts = path.split('/');
  const lastPart = parts[parts.length - 1];

  // Remove any file extension if present
  const name = lastPart.split('.')[0];

  return name;
}



export function isAsset(data) {
    const validLinks = [];
    console.log(data)
    data.forEach(element => {
      element.forEach(elem=>{
        if (isValidURL(elem)) {
        validLinks.push(elem);
      }
      })
    });
    // data.map((item, index) => {
      // if (isValidURL(item)) {
      //   validLinks.push(item);
      // }
    // });
    return validLinks;
  }

  function isValidURL(string) {
    if (Number(string)) {
      return null;
    } else {
      var res = string.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      return res !== null;
    }
  }

