import { createContext, useState } from "react";
import PropTypes from "prop-types";

// Create a context for error handling
export const ErrorHandlingContext = createContext();

export const ErrorHandlingProvider = ({ children }) => {
    const [error, setError] = useState([]);

    const showError = (message = [], duration = 3000) => {
        setError(message);
        console.log("ErrorHandlingProvider_showError : ", message, duration);
        setTimeout(() => {
            setError([]);
        }, duration);
    };

    return (
        <ErrorHandlingContext.Provider value={{ showError }}>
            {children}
            {error && <ErrorDialog message={error} />}
        </ErrorHandlingContext.Provider>
    );
};

const ErrorDialog = ({ message }) => {
    return (message && (message.map((element, index) => {
        return (
            <div key={index} style={{...styles.errorDialog }}>
                {element}
            </div>
        );
    })))
};

ErrorHandlingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

ErrorDialog.propTypes = {
    message: PropTypes.array.isRequired,
};

const styles = {
    errorDialog: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
    },
};