import { Routes, Route } from "react-router";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Map from "../pages/Map";
import Report from "../pages/Report";
import OccurrenceDetails from "../pages/OccurrenceDetails";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/map" element={<Map />} />
      <Route path="/report" element={<Report />} />
      <Route path="/occurrence/:id" element={<OccurrenceDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
