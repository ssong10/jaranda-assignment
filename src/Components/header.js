import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './button';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Login from 'Pages/Main/Login';
import LoginModal from 'Pages/Main/LoginModal';
import { userStorage } from 'store';
import { ROLE } from 'constant/role';
import { ROUTES_PATH } from 'constant/routesPath'

const HeaderWrap = styled.div`
  top: 0;
  left: 0;
  position: sticky;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 8px 0px;
  z-index: 10;
  background-color: #F9F9F9;
`;
const LeftLink = styled(Link)`
  margin-left: 10%;
`;
const PageLink = styled(Link)`
  margin-right: 10px;
`;
const Account = styled.div`
  display: flex;
  margin-right: 10%;
`;
const User = styled.div`
  display: flex;
  margin-right: 10px;
  align-items: center;
`;
function Header({ history }) {
  const pathname = history.location.pathname;
  const [modal, setModal] = useState(false);
  const isLoggedIn = userStorage.exist();
  const currentUser = userStorage.load()
  const toggleModal = () => {
    setModal(!modal);
  };
  const onLogin = ({ userName, password }) => {
    const user = Login({ userName, password });
    if (user) {
      userStorage.save(user);
      history.push(ROUTES_PATH.MAIN)
    } else {
      throw new Error();
    }
  };
  const onLogout = () => {
    setModal(false);
    localStorage.removeItem('jaranda-user');
  };
  return (
    <HeaderWrap>
      <LeftLink to={ROUTES_PATH.MAIN}>
        <Button select={pathname === ROUTES_PATH.MAIN}>Main</Button>
      </LeftLink>
      <Account>
        {isLoggedIn ? (
          <>
            <User>{currentUser.userName}</User>
            <User>{currentUser.isAdmin ? '관리자' : ROLE[currentUser.role]}</User>
            <PageLink to={ROUTES_PATH.MAIN}>
              <Button onClick={onLogout}>Logout</Button>
            </PageLink>
          </>
        ) : (
          <>
            <PageLink to={ROUTES_PATH.MAIN}>
              <Button onClick={toggleModal}>
                Login
              </Button>
            </PageLink>
            <PageLink to={ROUTES_PATH.SIGNUP}>
              <Button select={pathname === ROUTES_PATH.SIGNUP}>Sign Up</Button>
            </PageLink>
          </>
        )}
        <LoginModal
          show={modal}
          toggle={toggleModal}
          onLogin={onLogin}
        ></LoginModal>
      </Account>
    </HeaderWrap>
  );
}
export default withRouter(Header);