import {Route, Routes} from "react-router-dom";
import UrlTable from "./components/urlTable/UrlTable";
import UserRequests from "./components/userRequests/UserRequests";
import React from "react";


const Router = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<UrlTable />} />
                <Route path="user-requests" element={<UserRequests />} />
            </Routes>
        </div>
    );
};

export default Router;