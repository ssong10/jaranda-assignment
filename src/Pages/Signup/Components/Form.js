import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import Password from './Password';
import Address from './Address';
import Card from './Card';
import Policy from './Policy';
import Input from 'Components/input';
import Alert from "Components/inputAlert";

import useForm from "hooks/useForm";
import { userListStorage } from "store";
import COLOR from 'constant/colorCode';
import { ROUTES_PATH } from 'constant/routesPath';
import { validPassword, validCardNumber, existUsername } from "../utils/validate";

const Container = styled.form`
  display: flex;
  flex-direction: column;
`;

const Submit = styled.input.attrs({ type: 'submit' })`
  height: 44px;
  background : ${COLOR.SINGUP_MAIN};
  color: #fff;
  border : none;
  border-radius: 6px;
  font-size : 17px;
`;

const getLastId = () => {
  const list = userListStorage.load();
  return list[list.length-1].id
}

const BASE_USER_DATA = {
  id: getLastId() + 1,
  userName: '',
  password: '',
  address: '',
  cardNumber: '',
  role: 0,
  isAdmin: false,
}

function Form() {
  const [ user, onFormChange ,formReducer ] = useForm(BASE_USER_DATA)
  const [showAlert, setShowAlert] = useState(false);
  const [showIdAlert, setIdAlert] = useState(false);

  const history = useHistory();

  const setCard = (value) => formReducer({
    cardNumber: value
  })
  const setAddress = (value) => formReducer({
    address: value
  })

  const isNotBlank = (value) => {
    return value.trim().length > 0
  }

  const verifiedInput = () => {
    const { userName, password, cardNumber, address } = user
    return isNotBlank(userName) && isNotBlank(address) && validPassword(password) && validCardNumber(cardNumber)
  }

  const validateCheck = () => {
    const checkDuplicateName = existUsername(user.userName)
    const checkInput = verifiedInput()
    setIdAlert(!checkDuplicateName)
    setShowAlert(!checkInput)
    return checkDuplicateName && checkInput
  }

  const onSubmit = event => {
    event.preventDefault();
    if (!validateCheck()) {
      return;
    }
    userListStorage.push(user);
    alert(`${user.userName}님 회원가입 되었습니다.`);
    history.push(ROUTES_PATH.MAIN)
  }

  return (
    <Container onSubmit={onSubmit}>
      <Input
        type='text'
        placeholder='아이디'
        value={user.userName}
        name="userName"
        onChange={onFormChange}
      />
      <Alert show={showIdAlert}>존재하는 아이디 입니다.</Alert>

      <Password
        value={user.password}
        name="password"
        onChange={onFormChange}
      />

      <Address
        value={user.address}
        setValue={setAddress}
      />

      <Card
        value={user.cardNumber}
        setValue={setCard}
      />

      <Policy />

      <Alert show={showAlert} big >올바른 값을 모두 입력해주세요</Alert>
      <Submit
        value='가입하기'
      />
    </Container>
  )
}

export default Form;