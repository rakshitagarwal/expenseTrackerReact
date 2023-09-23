import PageContent from '../components/Layout/PageContent';

import {NavLink, useRouteError } from "react-router-dom";
import MainNavigation from '../components/Header/MainNavigation';

const ErrorPage = () => {
  const error = useRouteError()

  let title = "An error occured.";
  let message = "Something went wrong.";

  return (
    <>
    <MainNavigation/>
    <PageContent title={title}>
      <p>{error.message ? error.message : message}</p>
    </PageContent>
    <div style={{textAlign:'center'}}>
    <NavLink to='/'>Go to Login Page</NavLink>
    </div>
    </>
  );
};

export default ErrorPage;