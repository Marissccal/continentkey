import { useEffect } from "react";
import { MESSAGE_DELAY_MS } from "../../lib/constants";

const ErrorMessage = ({ errorMessage, setErrorMessage }) => {
  // console.log(errorMessage);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, MESSAGE_DELAY_MS);
  }, []);

  return (
    <div className="notification is-danger has-text-centered custom-position-absolute-warning">
      <button className="delete" onClick={() => setErrorMessage(null)}></button>
      {`${errorMessage.code} - ${errorMessage.message}
    `}
    </div>
  );
};

export default ErrorMessage;
