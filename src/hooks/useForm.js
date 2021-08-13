import { useState } from 'react';

const useForm = (initialValue) => {
  const [ formData , setformData ] = useState(initialValue)
  const onFormChange = (e) => {
    const { name, value } = e.target
    setformData({
      ...formData,
      [name] : value
    })
  }
  const formReducer = (obj) => {
    setformData({
      ...formData,
      ...obj
    })
  }
  return [ formData, onFormChange, formReducer ]
};

export default useForm;
