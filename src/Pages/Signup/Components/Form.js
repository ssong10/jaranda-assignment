import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import Password from './Password';
import Address from './Address';
import Card from './Card';
import Policy from './Policy';
import Input from 'Components/input';
import Alert from "Components/inputAlert";

import useInput from "hooks/useInput";
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

function Form() {
  const id = useInput('');
  const password = useInput('');
  const [address, setAddress] = useState('');
  const [card, setCard] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showIdAlert, setIdAlert] = useState(false);

  const history = useHistory();

  const validateCheck = () => {
    if (existUsername(id.value)) {
      setIdAlert(true);
      return false;
    }
    else {
      setIdAlert(false);
    }

    if (
      id.value.trim() === ''
      || !validPassword(password.value)
      || !validCardNumber(card)
      || address.trim() === ''
    ) {
      setShowAlert(true);
      return false;
    }
    else {
      setShowAlert(false);
    }

    return true
  }

  const getLastId = () => {
    const list = userListStorage.load();
    return Math.max(...list.map(item => item.id))
  }

  const createUser = () => {
    return {
      id: getLastId() + 1,
      userName: id.value,
      password: password.value,
      address: address,
      cardNumber: card,
      accessMenus: [],
      role : 0,
      isAdmin: false,
    }
  }

  const onSubmit = event => {
    event.preventDefault();

    if (!validateCheck()) {
      return;
    }

    const user = createUser();

    userListStorage.push(user);
    alert(`${user.userName}님 회원가입 되었습니다.`);

    history.push(ROUTES_PATH.MAIN)
  }

  return (
    <Container onSubmit={onSubmit}>

      <Input
        type='text'
        placeholder='아이디'
        {...id}
      />
      <Alert show={showIdAlert}>존재하는 아이디 입니다.</Alert>

      <Password
        {...password}
      />

      <Address
        value={address}
        setValue={setAddress}
      />

      <Card
        value={card}
        setValue={setCard}
      />

      <Policy />

      <Alert show={showAlert} big >올바른 값을 모두 입력해주세요</Alert>

      <Submit
        type='submit'
        value='가입하기'
      />

    </Container>
  )
}

export default Form;
