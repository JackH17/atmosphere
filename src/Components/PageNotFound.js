import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>Ooops! Page not found. Try heading back to <Link to="/">Atmosphere</Link>.</p>
            
        </div>
    )
};

export default PageNotFound;
