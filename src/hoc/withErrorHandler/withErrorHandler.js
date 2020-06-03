import React, { useState, useEffect } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => (props) => {
  const [error, setError] = useState(null);
  const [resInterceptor, setResInterceptor] = useState(null);
  const [reqInterceptor, setReqInterceptor] = useState(null);

  useEffect(() => {
    setResInterceptor(
      axios.interceptors.response.use(
        (res) => res,
        (err) => {
          setError(err);
        }
      )
    );
    setReqInterceptor(
      axios.interceptors.request.use((req) => {
        setError(null);
        return req;
      })
    );
  }, []);

  useEffect(
    () => () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    },
    [reqInterceptor, resInterceptor]
  );

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return (
    <Aux>
      <Modal show={error} modalClosed={errorConfirmedHandler}>
        {error ? error.message : null}
      </Modal>
      <WrappedComponent {...props} />
    </Aux>
  );
};

export default withErrorHandler;